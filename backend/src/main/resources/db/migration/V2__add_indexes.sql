-- Users table indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email
ON users (email);

CREATE INDEX IF NOT EXISTS idx_users_role
ON users (role);

-- Lawyer profile indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_lawyer_license
ON lawyer_profiles (license_number);

-- NGO profile indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_ngo_registration
ON ngo_profiles (registration_number);
