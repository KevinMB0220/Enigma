/**
 * Recalculate trust scores for all agents
 * This should be run periodically to keep trust scores up to date
 */
import { recalculateAllScores } from '@/services/trust-score-service';
import { createLogger } from '@/lib/utils/logger';

const logger = createLogger('recalculate-trust-scores');

async function main() {
  console.log('=== Recalculating Trust Scores ===\n');
  
  const batchSize = parseInt(process.argv[2] || '50');
  console.log(`Batch size: ${batchSize}\n`);
  
  try {
    const startTime = Date.now();
    const updatedCount = await recalculateAllScores(batchSize);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\n=== Summary ===`);
    console.log(`Updated ${updatedCount} agents in ${duration}s`);
    console.log(`Average: ${(parseFloat(duration) / updatedCount).toFixed(2)}s per agent`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
