-- ========================================================
-- SUPABASE POSTGRESQL SCHEMA FOR PORTFOLIO BACKEND
-- ========================================================

-- Enable extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------
-- 1. USER TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    birth_date DATE NOT NULL,
    main_phrase TEXT NULL,
    email TEXT NOT NULL UNIQUE,
    cellphone_number TEXT NULL UNIQUE,
    avatar_url TEXT NOT NULL,
    linkedin_url TEXT NOT NULL UNIQUE,
    github_url TEXT NULL UNIQUE,
    medium_url TEXT NULL UNIQUE,
    instagram_url TEXT NULL UNIQUE,
    personality_test_url TEXT NULL UNIQUE,
    curriculum_url TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_user_updated_at
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 2. PROJECT TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "project" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    github_url TEXT NULL,
    test_url TEXT NULL,
    category TEXT NOT NULL CHECK (category IN ('FrontEnd', 'BackEnd', 'FullStack', 'DataScience', 'GameDev', 'Mobile', 'Other')),
    likes INT NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_project_updated_at
BEFORE UPDATE ON "project"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 3. PROJECT IMAGE TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "project_image" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES "project"(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_project_image_updated_at
BEFORE UPDATE ON "project_image"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 4. SKILL TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "skill" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_skill_updated_at
BEFORE UPDATE ON "skill"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 5. TOOL TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "tool" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_url TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_tool_updated_at
BEFORE UPDATE ON "tool"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 6. PROJECT TOOL ASSOCIATION TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "project_tool" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES "project"(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES "tool"(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_project_tool_updated_at
BEFORE UPDATE ON "project_tool"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 7. EXPERIENCE TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "experience" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    image_url TEXT NULL,
    position TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    exit_date DATE NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_experience_updated_at
BEFORE UPDATE ON "experience"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 8. CERTIFICATE TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "certificate" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name_course TEXT NOT NULL,
    plataform TEXT NOT NULL,
    workload INT NOT NULL,
    issue_date DATE NOT NULL,
    digital_certificate_url TEXT NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_certificate_updated_at
BEFORE UPDATE ON "certificate"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 9. RECOMMENDATION TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "recommendation" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    experience_id UUID NOT NULL REFERENCES "experience"(id) ON DELETE CASCADE,
    name_recommender TEXT NOT NULL,
    description TEXT NOT NULL,
    linkedin_recommender_url TEXT NULL,
    date DATE NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_recommendation_updated_at
BEFORE UPDATE ON "recommendation"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
