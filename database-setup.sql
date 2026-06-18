-- Run this in your Neon SQL editor to create all tables

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY DEFAULT 1,
  text_ar TEXT,
  text_fr TEXT,
  card1_icon TEXT,
  card1_title_ar TEXT,
  card1_title_fr TEXT,
  card1_text_ar TEXT,
  card1_text_fr TEXT,
  card2_icon TEXT,
  card2_title_ar TEXT,
  card2_title_fr TEXT,
  card2_text_ar TEXT,
  card2_text_fr TEXT,
  card3_icon TEXT,
  card3_title_ar TEXT,
  card3_title_fr TEXT,
  card3_text_ar TEXT,
  card3_text_fr TEXT,
  card4_icon TEXT,
  card4_title_ar TEXT,
  card4_title_fr TEXT,
  card4_text_ar TEXT,
  card4_text_fr TEXT
);

CREATE TABLE IF NOT EXISTS bureau_members (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_fr TEXT,
  role_ar TEXT NOT NULL,
  role_fr TEXT,
  initial TEXT,
  color TEXT DEFAULT '#1a6fa0',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_fr TEXT,
  period_ar TEXT,
  period_fr TEXT,
  description_ar TEXT,
  description_fr TEXT,
  emoji TEXT DEFAULT '🎯',
  gradient_from TEXT DEFAULT '#2980b9',
  gradient_to TEXT DEFAULT '#1a6fa0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id SERIAL PRIMARY KEY,
  label_ar TEXT,
  label_fr TEXT,
  emoji TEXT DEFAULT '📸',
  is_featured BOOLEAN DEFAULT FALSE,
  gradient_from TEXT DEFAULT '#2980b9',
  gradient_to TEXT DEFAULT '#1a6fa0',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_fr TEXT,
  logo_url TEXT,
  emoji TEXT DEFAULT '🤝',
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
