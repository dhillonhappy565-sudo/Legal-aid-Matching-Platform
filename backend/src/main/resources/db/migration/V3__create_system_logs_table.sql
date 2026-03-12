CREATE TABLE IF NOT EXISTS system_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    category VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    actor_email VARCHAR(255),
    target_email VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    metadata VARCHAR(1000)
);
