-- Wedding Dashboard - Database Schema
-- Tables are auto-created on first request; this file is for reference only.

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  side text NOT NULL CHECK (side IN ('suson', 'susonit')),
  subgroup text NOT NULL,
  likelihood text NOT NULL DEFAULT 'green' CHECK (likelihood IN ('red', 'yellow', 'green')),
  has_plus_one boolean DEFAULT false,
  plus_one_name text,
  plus_one_likelihood text DEFAULT 'green' CHECK (plus_one_likelihood IN ('red', 'yellow', 'green')),
  will_dance boolean DEFAULT false,
  plus_one_will_dance boolean DEFAULT false,
  children jsonb DEFAULT '[]'::jsonb,
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
  owner text NOT NULL DEFAULT 'both' CHECK (owner IN ('suson', 'susonit', 'both')),
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

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  min_price numeric DEFAULT 0,
  max_price numeric DEFAULT 0,
  capacity integer,
  contact_name text,
  contact_phone text,
  status text NOT NULL DEFAULT 'considering'
    CHECK (status IN ('considering', 'visited', 'booked', 'rejected')),
  available_dates jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- App settings table (key-value store for UI settings like blocked dates, spreadsheet data)
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  location text,
  provider_name text,
  driver_phone text,
  guest_in_charge text,
  notes text,
  created_at timestamptz DEFAULT now()
);
