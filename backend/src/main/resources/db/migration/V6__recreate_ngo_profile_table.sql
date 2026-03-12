CREATE TABLE IF NOT EXISTS ngo_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    registration_id VARCHAR(255),
    type VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    focus_areas TEXT,
    services TEXT,
    modes TEXT,
    languages TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
