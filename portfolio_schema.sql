-- =========================================================
-- Portfolio Platform - MySQL Schema
-- Engine: InnoDB, Charset: utf8mb4
-- =========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- Admins (single or multi-admin auth for the dashboard)
-- ---------------------------------------------------------
CREATE TABLE admins (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)      NOT NULL,
  email         VARCHAR(150)      NOT NULL,
  password      VARCHAR(255)      NOT NULL,       -- bcrypt hash, never plaintext
  avatar        VARCHAR(255)      NULL,
  role          ENUM('super_admin','editor') NOT NULL DEFAULT 'editor',
  is_active     TINYINT(1)        NOT NULL DEFAULT 1,
  last_login_at DATETIME          NULL,
  created_at    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME          NULL,
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Media library (every uploaded file is tracked here, not
-- stored raw in other tables — other tables reference media_id)
-- ---------------------------------------------------------
CREATE TABLE media (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  disk          VARCHAR(20)       NOT NULL DEFAULT 'local', -- local | s3 | cloudinary etc.
  path          VARCHAR(500)      NOT NULL,
  url           VARCHAR(500)      NOT NULL,
  original_name VARCHAR(255)      NOT NULL,
  mime_type     VARCHAR(100)      NOT NULL,
  size_bytes    INT UNSIGNED      NOT NULL,
  width         INT UNSIGNED      NULL,
  height        INT UNSIGNED      NULL,
  uploaded_by   BIGINT UNSIGNED   NULL,
  created_at    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_admin FOREIGN KEY (uploaded_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Site settings (singleton row, key/value fallback table below)
-- ---------------------------------------------------------
CREATE TABLE site_settings (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_title        VARCHAR(150)   NOT NULL DEFAULT '',
  tagline           VARCHAR(255)   NULL,
  hero_title        VARCHAR(255)   NULL,
  hero_subtitle     TEXT           NULL,
  about_text        TEXT           NULL,
  resume_media_id   BIGINT UNSIGNED NULL,
  avatar_media_id   BIGINT UNSIGNED NULL,
  email             VARCHAR(150)   NULL,
  phone             VARCHAR(30)    NULL,
  address           VARCHAR(255)   NULL,
  seo_title         VARCHAR(160)   NULL,
  seo_description   VARCHAR(320)   NULL,
  updated_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_settings_resume FOREIGN KEY (resume_media_id) REFERENCES media(id) ON DELETE SET NULL,
  CONSTRAINT fk_settings_avatar FOREIGN KEY (avatar_media_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- key/value store for anything you don't want a dedicated column for
-- (e.g. social_links.github, theme.primary_color)
CREATE TABLE settings_kv (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`         VARCHAR(100) NOT NULL,
  `value`       TEXT         NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_settings_kv_key (`key`)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Skills
-- ---------------------------------------------------------
CREATE TABLE skills (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)    NOT NULL,
  category      VARCHAR(60)     NOT NULL DEFAULT 'general', -- e.g. backend, frontend, mobile, tools
  proficiency   TINYINT UNSIGNED NOT NULL DEFAULT 80,        -- 0-100
  icon_media_id BIGINT UNSIGNED NULL,
  order_index   INT UNSIGNED    NOT NULL DEFAULT 0,
  is_visible    TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_skills_icon FOREIGN KEY (icon_media_id) REFERENCES media(id) ON DELETE SET NULL,
  KEY idx_skills_category (category),
  KEY idx_skills_order (order_index)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Projects (case studies)
-- ---------------------------------------------------------
CREATE TABLE projects (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(180)    NOT NULL,
  slug              VARCHAR(200)    NOT NULL,
  short_description VARCHAR(300)    NULL,
  description       LONGTEXT        NULL,          -- rich text / markdown
  thumbnail_media_id BIGINT UNSIGNED NULL,
  category          VARCHAR(80)     NULL,           -- e.g. Web, Mobile, SaaS
  live_url          VARCHAR(255)    NULL,
  github_url        VARCHAR(255)    NULL,
  is_featured       TINYINT(1)      NOT NULL DEFAULT 0,
  status            ENUM('draft','published') NOT NULL DEFAULT 'draft',
  order_index       INT UNSIGNED    NOT NULL DEFAULT 0,
  views             INT UNSIGNED    NOT NULL DEFAULT 0,
  published_at      DATETIME        NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        DATETIME        NULL,
  UNIQUE KEY uq_projects_slug (slug),
  CONSTRAINT fk_projects_thumb FOREIGN KEY (thumbnail_media_id) REFERENCES media(id) ON DELETE SET NULL,
  KEY idx_projects_status (status),
  KEY idx_projects_featured (is_featured)
) ENGINE=InnoDB;

-- extra gallery images per project (one-to-many, avoids a JSON blob)
CREATE TABLE project_images (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id    BIGINT UNSIGNED NOT NULL,
  media_id      BIGINT UNSIGNED NOT NULL,
  order_index   INT UNSIGNED    NOT NULL DEFAULT 0,
  CONSTRAINT fk_pimg_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_pimg_media   FOREIGN KEY (media_id)   REFERENCES media(id)    ON DELETE CASCADE,
  KEY idx_pimg_project (project_id)
) ENGINE=InnoDB;

-- tech stack tags per project (many-to-many via skills, or free tags)
CREATE TABLE tags (
  id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(60) NOT NULL,
  slug  VARCHAR(70) NOT NULL,
  UNIQUE KEY uq_tags_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE project_tags (
  project_id BIGINT UNSIGNED NOT NULL,
  tag_id     BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (project_id, tag_id),
  CONSTRAINT fk_ptag_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_ptag_tag     FOREIGN KEY (tag_id)     REFERENCES tags(id)     ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Experience
-- ---------------------------------------------------------
CREATE TABLE experiences (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company       VARCHAR(150)  NOT NULL,
  role          VARCHAR(150)  NOT NULL,
  location      VARCHAR(150)  NULL,
  description   TEXT          NULL,
  start_date    DATE          NOT NULL,
  end_date      DATE          NULL,               -- NULL = current
  order_index   INT UNSIGNED  NOT NULL DEFAULT 0,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Education
-- ---------------------------------------------------------
CREATE TABLE education (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  institution   VARCHAR(180)  NOT NULL,
  degree        VARCHAR(150)  NOT NULL,
  field         VARCHAR(150)  NULL,
  start_date    DATE          NOT NULL,
  end_date      DATE          NULL,
  description   TEXT          NULL,
  order_index   INT UNSIGNED  NOT NULL DEFAULT 0,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------
CREATE TABLE testimonials (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_name       VARCHAR(150)  NOT NULL,
  client_role       VARCHAR(150)  NULL,
  client_company    VARCHAR(150)  NULL,
  avatar_media_id   BIGINT UNSIGNED NULL,
  message           TEXT          NOT NULL,
  rating            TINYINT UNSIGNED NOT NULL DEFAULT 5, -- 1-5
  is_approved       TINYINT(1)    NOT NULL DEFAULT 0,
  order_index       INT UNSIGNED  NOT NULL DEFAULT 0,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_testimonials_avatar FOREIGN KEY (avatar_media_id) REFERENCES media(id) ON DELETE SET NULL,
  KEY idx_testimonials_approved (is_approved)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Blog
-- ---------------------------------------------------------
CREATE TABLE blog_posts (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title               VARCHAR(200)  NOT NULL,
  slug                VARCHAR(220)  NOT NULL,
  excerpt             VARCHAR(300)  NULL,
  content             LONGTEXT      NOT NULL,
  cover_media_id      BIGINT UNSIGNED NULL,
  author_id           BIGINT UNSIGNED NULL,
  status              ENUM('draft','published') NOT NULL DEFAULT 'draft',
  views               INT UNSIGNED  NOT NULL DEFAULT 0,
  published_at        DATETIME      NULL,
  seo_title           VARCHAR(160)  NULL,
  seo_description     VARCHAR(320)  NULL,
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          DATETIME      NULL,
  UNIQUE KEY uq_blog_slug (slug),
  CONSTRAINT fk_blog_cover  FOREIGN KEY (cover_media_id) REFERENCES media(id)  ON DELETE SET NULL,
  CONSTRAINT fk_blog_author FOREIGN KEY (author_id)      REFERENCES admins(id) ON DELETE SET NULL,
  KEY idx_blog_status (status)
) ENGINE=InnoDB;

CREATE TABLE blog_post_tags (
  blog_post_id BIGINT UNSIGNED NOT NULL,
  tag_id       BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (blog_post_id, tag_id),
  CONSTRAINT fk_bptag_post FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_bptag_tag  FOREIGN KEY (tag_id)        REFERENCES tags(id)      ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Contact messages (public contact form submissions)
-- ---------------------------------------------------------
CREATE TABLE contact_messages (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  email         VARCHAR(150)  NOT NULL,
  subject       VARCHAR(200)  NULL,
  message       TEXT          NOT NULL,
  ip_address    VARCHAR(45)   NULL,
  is_read       TINYINT(1)    NOT NULL DEFAULT 0,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_contact_read (is_read)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
