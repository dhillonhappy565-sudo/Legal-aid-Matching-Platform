CREATE TABLE cases (
    id BIGSERIAL PRIMARY KEY,

    citizen_email VARCHAR(255) NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    category VARCHAR(50),
    sub_category VARCHAR(50),

    urgency VARCHAR(20),
    location VARCHAR(255),

    involved_parties VARCHAR(255),
    preferred_language VARCHAR(50),
    help_mode VARCHAR(50),

    additional_notes TEXT,

    target VARCHAR(20), -- LAWYER / NGO

    status VARCHAR(20),
    assigned_to VARCHAR(255),

    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
