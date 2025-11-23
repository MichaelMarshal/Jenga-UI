-- Initialize Jenga Architecture Database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create system_metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC(10,2) NOT NULL,
    unit VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Create data_pipeline_logs table
CREATE TABLE IF NOT EXISTS data_pipeline_logs (
    id SERIAL PRIMARY KEY,
    stage_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    records_processed INTEGER DEFAULT 0,
    total_records INTEGER DEFAULT 0,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_ms INTEGER,
    error_message TEXT,
    metadata JSONB
);

-- Create architecture_components table
CREATE TABLE IF NOT EXISTS architecture_components (
    id SERIAL PRIMARY KEY,
    component_name VARCHAR(100) NOT NULL,
    component_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    configuration JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (name, email, password_hash, role) VALUES
('John Doe', 'john.doe@company.com', '$2b$10$example_hash_admin', 'admin'),
('Sarah Johnson', 'sarah.j@company.com', '$2b$10$example_hash_user', 'user'),
('Mike Chen', 'mike.chen@company.com', '$2b$10$example_hash_dev', 'developer')
ON CONFLICT (email) DO NOTHING;

-- Insert sample architecture components
INSERT INTO architecture_components (component_name, component_type, configuration) VALUES
('React Frontend', 'frontend', '{"port": 3000, "framework": "Next.js"}'),
('API Gateway', 'backend', '{"port": 8080, "type": "REST"}'),
('PostgreSQL Database', 'database', '{"port": 5432, "type": "relational"}'),
('Redis Cache', 'cache', '{"port": 6379, "type": "in-memory"}'),
('Data Pipeline', 'processor', '{"stages": 5, "throughput": "1000/min"}')
ON CONFLICT DO NOTHING;

-- Insert sample metrics
INSERT INTO system_metrics (metric_name, metric_value, unit) VALUES
('cpu_usage', 45.5, 'percent'),
('memory_usage', 67.2, 'percent'),
('disk_usage', 89.1, 'percent'),
('network_io', 23.8, 'percent'),
('active_connections', 1247, 'count'),
('response_time', 234, 'milliseconds');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_pipeline_logs_stage_status ON data_pipeline_logs(stage_name, status);
CREATE INDEX IF NOT EXISTS idx_architecture_components_type ON architecture_components(component_type);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_architecture_components_updated_at BEFORE UPDATE ON architecture_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();