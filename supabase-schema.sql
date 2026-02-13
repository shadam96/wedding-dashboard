-- Wedding Dashboard - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  side text NOT NULL CHECK (side IN ('suson', 'susonit')),
  subgroup text NOT NULL CHECK (subgroup IN ('family', 'friends', 'work', 'army', 'school', 'other')),
  likelihood text NOT NULL DEFAULT 'green' CHECK (likelihood IN ('red', 'yellow', 'green')),
  has_plus_one boolean DEFAULT false,
  plus_one_name text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date date,
  created_at timestamptz DEFAULT now()
);

-- Budget items table
CREATE TABLE IF NOT EXISTS budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  description text NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  paid_amount numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Disable RLS on all tables (app uses middleware-level auth)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow all operations since auth is at middleware level)
CREATE POLICY "Allow all on guests" ON guests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on budget_items" ON budget_items FOR ALL USING (true) WITH CHECK (true);
