// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ENIGMA_API_URL = Deno.env.get('ENIGMA_API_URL') || 'http://localhost:3000';

console.log('Agent Indexer Edge Function started');

serve(async (req) => {
  try {
    console.log('Triggering agent sync...');

    // Call the sync endpoint
    const response = await fetch(`${ENIGMA_API_URL}/api/v1/indexer/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('Sync completed:', data);

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error during agent sync:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to sync agents',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/agent-indexer' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
