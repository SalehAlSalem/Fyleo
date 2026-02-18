-- Core Fyleo Schema v1.0
-- Updated: 2026-02-15
-- Description: منصة تعليمية متكاملة مستوحاة من StudoCu

-- ============================================
-- 1. Categories (تصنيفات)
-- ============================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  nameAr TEXT NOT NULL,
  nameEn TEXT NOT NULL,
  descriptionAr TEXT,
  descriptionEn TEXT,
  icon TEXT,
  color TEXT,
  slug TEXT UNIQUE NOT NULL,
  'order' INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Subjects (المواد/التخصصات)
-- ============================================
CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  nameAr TEXT NOT NULL,
  nameEn TEXT NOT NULL,
  descriptionAr TEXT,
  descriptionEn TEXT,
  categoryId TEXT,
  code TEXT,
  creditHours INTEGER,
  level TEXT,
  isActive BOOLEAN DEFAULT true,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);

-- ============================================
-- 3. File Types (أنواع الملفات)
-- ============================================
CREATE TABLE fileTypes (
  id TEXT PRIMARY KEY,
  nameAr TEXT NOT NULL,
  nameEn TEXT NOT NULL,
  mimeType TEXT,
  extension TEXT,
  icon TEXT,
  color TEXT,
  allowedInBrowser BOOLEAN DEFAULT false,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. Materials (المواد الدراسية)
-- ============================================
CREATE TABLE materials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file TEXT NOT NULL,
  uploaderId TEXT NOT NULL,
  subjectId TEXT NOT NULL,
  fileTypeId TEXT NOT NULL,
  tags TEXT,
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  averageRating REAL DEFAULT 0,
  totalRatings INTEGER DEFAULT 0,
  isVerified BOOLEAN DEFAULT false,
  isPublic BOOLEAN DEFAULT true,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaderId) REFERENCES users(id),
  FOREIGN KEY (subjectId) REFERENCES subjects(id),
  FOREIGN KEY (fileTypeId) REFERENCES fileTypes(id)
);

-- ============================================
-- 5. Material Ratings (تقييمات المواد)
-- ============================================
CREATE TABLE material_ratings (
  id TEXT PRIMARY KEY,
  materialId TEXT NOT NULL,
  userId TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful INTEGER DEFAULT 0,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (materialId) REFERENCES materials(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  UNIQUE(materialId, userId)
);

-- ============================================
-- 6. Material Reports (بلاغات المحتوى)
-- ============================================
CREATE TABLE material_reports (
  id TEXT PRIMARY KEY,
  materialId TEXT NOT NULL,
  userId TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'open' CHECK(status IN ('open', 'reviewing', 'resolved', 'rejected')),
  reviewedById TEXT,
  reviewNotes TEXT,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (materialId) REFERENCES materials(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (reviewedById) REFERENCES users(id)
);

-- ============================================
-- 7. User Profiles (بيانات المستخدمين الإضافية)
-- ============================================
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  userId TEXT UNIQUE NOT NULL,
  bio TEXT,
  university TEXT,
  major TEXT,
  year INTEGER,
  totalUploads INTEGER DEFAULT 0,
  totalRatings INTEGER DEFAULT 0,
  averageRating REAL DEFAULT 0,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- ============================================
-- 8. Posts (منشورات/نقاشات)
-- ============================================
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  subjectId TEXT,
  userId TEXT NOT NULL,
  title TEXT,
  content TEXT,
  links TEXT,
  views INTEGER DEFAULT 0,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subjectId) REFERENCES subjects(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_materials_subject ON materials(subjectId);
CREATE INDEX idx_materials_uploader ON materials(uploaderId);
CREATE INDEX idx_materials_created ON materials(created DESC);
CREATE INDEX idx_materials_rating ON materials(averageRating DESC);
CREATE INDEX idx_ratings_material ON material_ratings(materialId);
CREATE INDEX idx_ratings_user ON material_ratings(userId);
CREATE INDEX idx_reports_material ON material_reports(materialId);
CREATE INDEX idx_reports_status ON material_reports(status);
CREATE INDEX idx_subjects_category ON subjects(categoryId);
CREATE INDEX idx_posts_subject ON posts(subjectId);
