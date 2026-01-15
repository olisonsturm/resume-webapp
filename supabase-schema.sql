-- Supabase SQL Schema for Resume Webapp
-- Run this in Supabase SQL Editor to create the tables

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CVs table
CREATE TABLE IF NOT EXISTS cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  linkedin_url TEXT,
  resume JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Letters table
CREATE TABLE IF NOT EXISTS letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  letter_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for CVs
CREATE POLICY "Users can view their own CVs"
  ON cvs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CVs"
  ON cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs"
  ON cvs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs"
  ON cvs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Letters
CREATE POLICY "Users can view their own letters"
  ON letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own letters"
  ON letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own letters"
  ON letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own letters"
  ON letters FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS cvs_user_id_idx ON cvs(user_id);
CREATE INDEX IF NOT EXISTS cvs_updated_at_idx ON cvs(updated_at DESC);
CREATE INDEX IF NOT EXISTS letters_user_id_idx ON letters(user_id);
CREATE INDEX IF NOT EXISTS letters_updated_at_idx ON letters(updated_at DESC);
