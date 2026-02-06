-- 앱 기능 관련 스키마 추가/변경

-- 이벤트 테이블
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url VARCHAR(1024),
  status VARCHAR(20) NOT NULL DEFAULT '진행중',
  push_on_publish TINYINT(1) NOT NULL DEFAULT 0,
  reward_points INT NOT NULL DEFAULT 0,
  reward_coupon_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 동의 테이블 (이미 존재하면 무시)
CREATE TABLE IF NOT EXISTS user_consents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  consent_type VARCHAR(64) NOT NULL,
  is_agreed TINYINT(1) NOT NULL,
  agreed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_consents_user_id (user_id),
  INDEX idx_user_consents_type (consent_type)
);

-- 배송지 테이블
CREATE TABLE IF NOT EXISTS delivery_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  recipient_name VARCHAR(64) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  postal_code VARCHAR(12),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  is_default TINYINT(1) DEFAULT 0,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_delivery_addresses_user_id (user_id),
  INDEX idx_delivery_addresses_default (is_default)
);
