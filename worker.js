// Background worker for data pipeline processing
const { createClient } = require('redis');
const { Pool } = require('pg');

console.log('🚀 Starting Jenga Architecture Data Pipeline Worker...');

// Database connections
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const postgres = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/jenga_arch'
});

// Pipeline stages
const PIPELINE_STAGES = [
  'data_ingestion',
  'data_validation', 
  'data_transformation',
  'data_normalization',
  'data_storage'
];

class DataPipelineWorker {
  constructor() {
    this.isProcessing = false;
    this.currentBatch = null;
  }

  async start() {
    try {
      await redis.connect();
      console.log('✅ Connected to Redis');
      
      await postgres.connect();
      console.log('✅ Connected to PostgreSQL');

      // Start processing loop
      this.processLoop();
      
      console.log('🔄 Worker is ready and listening for jobs...');
    } catch (error) {
      console.error('❌ Failed to start worker:', error);
      process.exit(1);
    }
  }

  async processLoop() {
    setInterval(async () => {
      if (!this.isProcessing) {
        await this.checkForJobs();
      }
    }, 5000); // Check every 5 seconds
  }

  async checkForJobs() {
    try {
      // Check for pending jobs in Redis queue
      const job = await redis.lPop('pipeline_queue');
      
      if (job) {
        const jobData = JSON.parse(job);
        await this.processJob(jobData);
      }
    } catch (error) {
      console.error('❌ Error checking for jobs:', error);
    }
  }

  async processJob(jobData) {
    this.isProcessing = true;
    this.currentBatch = jobData;
    
    console.log(`🔄 Processing batch: ${jobData.batchId}`);
    
    try {
      for (const stage of PIPELINE_STAGES) {
        await this.processStage(stage, jobData);
        await this.delay(1000); // Simulate processing time
      }
      
      console.log(`✅ Completed batch: ${jobData.batchId}`);
    } catch (error) {
      console.error(`❌ Error processing batch ${jobData.batchId}:`, error);
      await this.logError(jobData.batchId, error);
    } finally {
      this.isProcessing = false;
      this.currentBatch = null;
    }
  }

  async processStage(stageName, jobData) {
    const startTime = new Date();
    const totalRecords = jobData.totalRecords || 1000;
    
    console.log(`  📊 Processing stage: ${stageName}`);
    
    // Log stage start
    await this.logStage(stageName, 'running', 0, totalRecords, startTime);
    
    // Simulate processing records in chunks
    for (let processed = 0; processed < totalRecords; processed += 100) {
      await this.delay(200); // Simulate processing time
      const currentProcessed = Math.min(processed + 100, totalRecords);
      
      // Update progress in database
      await this.logStage(stageName, 'running', currentProcessed, totalRecords, startTime);
      
      // Update Redis with current progress
      await redis.hSet(`batch:${jobData.batchId}`, {
        currentStage: stageName,
        processed: currentProcessed.toString(),
        total: totalRecords.toString()
      });
    }
    
    const endTime = new Date();
    const duration = endTime - startTime;
    
    // Log stage completion
    await this.logStage(stageName, 'completed', totalRecords, totalRecords, startTime, endTime, duration);
    
    console.log(`    ✅ Completed ${stageName} - ${totalRecords} records in ${duration}ms`);
  }

  async logStage(stageName, status, processed, total, startTime, endTime = null, duration = null) {
    try {
      const query = `
        INSERT INTO data_pipeline_logs (stage_name, status, records_processed, total_records, start_time, end_time, duration_ms)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      
      await postgres.query(query, [
        stageName,
        status, 
        processed,
        total,
        startTime,
        endTime,
        duration
      ]);
    } catch (error) {
      console.error('❌ Error logging stage:', error);
    }
  }

  async logError(batchId, error) {
    try {
      await redis.hSet(`batch:${batchId}:error`, {
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error('❌ Error logging error:', logError);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start the worker
const worker = new DataPipelineWorker();
worker.start();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Gracefully shutting down worker...');
  await redis.disconnect();
  await postgres.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, shutting down...');
  await redis.disconnect();
  await postgres.end();
  process.exit(0);
});