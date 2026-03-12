CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,

    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role IN ('CITIZEN', 'LAWYER', 'NGO', 'ADMIN'))
);

CREATE TABLE lawyer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    license_number VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    experience_years INT NOT NULL,

    CONSTRAINT uk_lawyer_license UNIQUE (license_number),
    CONSTRAINT uk_lawyer_user UNIQUE (user_id),
    CONSTRAINT fk_lawyer_user FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE TABLE ngo_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(255) NOT NULL,

    CONSTRAINT uk_ngo_registration UNIQUE (registration_number),
    CONSTRAINT uk_ngo_user UNIQUE (user_id),
    CONSTRAINT fk_ngo_user FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_users_role ON users(role);
