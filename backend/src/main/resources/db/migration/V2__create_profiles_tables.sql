CREATE TABLE lawyer_profiles (
    id BIGSERIAL PRIMARY KEY,
    license_number VARCHAR(255) NOT NULL UNIQUE,
    specialization VARCHAR(255) NOT NULL,
    experience_years INTEGER NOT NULL,
    user_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_lawyer_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE ngo_profiles (
    id BIGSERIAL PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(255) NOT NULL UNIQUE,
    contact_phone VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_ngo_user FOREIGN KEY (user_id) REFERENCES users(id)
);
