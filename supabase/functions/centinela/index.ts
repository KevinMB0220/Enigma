// Supabase Edge Function: Centinela Verification
// Runs periodically to verify all agents
// Deno runtime

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Types
interface Agent {
  address: string;
  name: string;
  status: string;
  is_proxy: boolean;
  proxy_type: string;
  implementation_address: string | null;
}

interface VerificationResult {
  address: string;
  proxyDetection: ProxyResult | null;
  heartbeat: HeartbeatResult | null;
  ozMatch: OZMatchResult | null;
  error?: string;
}

interface ProxyResult {
  isProxy: boolean;
  proxyType: string;
  implementationAddress?: string;
}

interface HeartbeatResult {
  success: boolean;
  responseTimeMs: number | null;
  result: 'PASS' | 'FAIL' | 'TIMEOUT';
}

interface OZMatchResult {
  score: number;
  matchedComponents: string[];
  confidence: string;
}

// EIP-1967 storage slots
const EIP1967_SLOTS = {
  IMPLEMENTATION: '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
  BEACON: '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50',
  ADMIN: '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103',
};

// RPC URL for Avalanche
const RPC_URL = Deno.env.get('AVALANCHE_RPC_URL') || 'https://api.avax-test.network/ext/bc/C/rpc';

/**
 * Make an RPC call to Avalanche
 */
async function rpcCall(method: string, params: unknown[]): Promise<unknown> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`RPC Error: ${data.error.message}`);
  }
  return data.result;
}

/**
 * Get contract code at address
 */
async function getCode(address: string): Promise<string | null> {
  try {
    const code = await rpcCall('eth_getCode', [address, 'latest']);
    return code as string;
  } catch {
    return null;
  }
}

/**
 * Read storage slot at address
 */
async function getStorageAt(address: string, slot: string): Promise<string> {
  try {
    const value = await rpcCall('eth_getStorageAt', [address, slot, 'latest']);
    return value as string;
  } catch {
    return '0x0000000000000000000000000000000000000000000000000000000000000000';
  }
}

/**
 * Extract address from storage slot value
 */
function extractAddress(slotValue: string): string | null {
  const address = '0x' + slotValue.slice(-40);
  if (address === '0x0000000000000000000000000000000000000000') {
    return null;
  }
  return address.toLowerCase();
}

/**
 * Detect proxy pattern for an agent
 */
async function detectProxy(address: string): Promise<ProxyResult> {
  const [implSlot, beaconSlot, adminSlot] = await Promise.all([
    getStorageAt(address, EIP1967_SLOTS.IMPLEMENTATION),
    getStorageAt(address, EIP1967_SLOTS.BEACON),
    getStorageAt(address, EIP1967_SLOTS.ADMIN),
  ]);

  const implementationAddress = extractAddress(implSlot);
  const beaconAddress = extractAddress(beaconSlot);
  const adminAddress = extractAddress(adminSlot);

  let proxyType = 'NONE';
  let isProxy = false;

  if (beaconAddress) {
    proxyType = 'BEACON';
    isProxy = true;
  } else if (implementationAddress && adminAddress) {
    proxyType = 'TRANSPARENT';
    isProxy = true;
  } else if (implementationAddress) {
    proxyType = 'UUPS';
    isProxy = true;
  }

  return {
    isProxy,
    proxyType,
    ...(implementationAddress && { implementationAddress }),
  };
}

/**
 * Send heartbeat to an agent (check if contract still exists)
 */
async function sendHeartbeat(address: string): Promise<HeartbeatResult> {
  const startTime = Date.now();

  try {
    const code = await Promise.race([
      getCode(address),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 5000)
      ),
    ]);

    const responseTimeMs = Date.now() - startTime;

    if (!code || code === '0x') {
      return {
        success: false,
        responseTimeMs,
        result: 'FAIL',
      };
    }

    return {
      success: true,
      responseTimeMs,
      result: 'PASS',
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'timeout') {
      return {
        success: false,
        responseTimeMs: null,
        result: 'TIMEOUT',
      };
    }
    return {
      success: false,
      responseTimeMs: Date.now() - startTime,
      result: 'FAIL',
    };
  }
}

/**
 * Verify a single agent
 */
async function verifyAgent(
  supabase: ReturnType<typeof createClient>,
  agent: Agent
): Promise<VerificationResult> {
  const result: VerificationResult = {
    address: agent.address,
    proxyDetection: null,
    heartbeat: null,
    ozMatch: null,
  };

  try {
    // Run proxy detection
    result.proxyDetection = await detectProxy(agent.address);

    // Send heartbeat
    result.heartbeat = await sendHeartbeat(agent.address);

    // Log heartbeat to database
    if (result.heartbeat) {
      await supabase.from('heartbeat_logs').insert({
        agent_address: agent.address,
        challenge_type: 'PING',
        response_time_ms: result.heartbeat.responseTimeMs,
        result: result.heartbeat.result,
      });
    }

    // Update agent proxy info if changed
    if (
      result.proxyDetection &&
      (agent.is_proxy !== result.proxyDetection.isProxy ||
        agent.proxy_type !== result.proxyDetection.proxyType ||
        agent.implementation_address !== result.proxyDetection.implementationAddress)
    ) {
      await supabase
        .from('agents')
        .update({
          is_proxy: result.proxyDetection.isProxy,
          proxy_type: result.proxyDetection.proxyType,
          implementation_address: result.proxyDetection.implementationAddress || null,
        })
        .eq('address', agent.address);
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
}

/**
 * Main handler for Centinela Edge Function
 */
Deno.serve(async (req) => {
  try {
    // Get authorization header for security
    const authHeader = req.headers.get('Authorization');
    const expectedToken = Deno.env.get('CENTINELA_SECRET');

    // Verify authorization if secret is set
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting Centinela verification run...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all verified agents
    const { data: agents, error: fetchError } = await supabase
      .from('agents')
      .select('address, name, status, is_proxy, proxy_type, implementation_address')
      .eq('status', 'VERIFIED');

    if (fetchError) {
      throw new Error(`Failed to fetch agents: ${fetchError.message}`);
    }

    if (!agents || agents.length === 0) {
      console.log('No verified agents to process');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No verified agents to process',
          summary: { total: 0, successful: 0, failed: 0 },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${agents.length} verified agents...`);

    // Process agents sequentially to avoid rate limiting
    const results: VerificationResult[] = [];
    let successful = 0;
    let failed = 0;

    for (const agent of agents) {
      try {
        const result = await verifyAgent(supabase, agent);
        results.push(result);

        if (result.error) {
          failed++;
          console.error(`Error verifying ${agent.address}: ${result.error}`);
        } else {
          successful++;
          console.log(`Verified ${agent.address}: heartbeat=${result.heartbeat?.result}, proxy=${result.proxyDetection?.isProxy}`);
        }
      } catch (error) {
        failed++;
        console.error(`Exception verifying ${agent.address}:`, error);
        results.push({
          address: agent.address,
          proxyDetection: null,
          heartbeat: null,
          ozMatch: null,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const summary = {
      total: agents.length,
      successful,
      failed,
      timestamp: new Date().toISOString(),
    };

    console.log('Centinela verification completed:', summary);

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        results,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Centinela verification failed:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
