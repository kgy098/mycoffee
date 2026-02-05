-- MariaDB table definitions for MyCoffee.AI

-- 사용자 취향분석 이력 (24시간 이후 삭제 정책 적용)
CREATE TABLE taste_histories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NULL,
  anonymous_id VARCHAR(128) NULL COMMENT '비회원 식별용 랜덤 ID (쿠키 등)',
  ip_address VARCHAR(45) NULL COMMENT '익명 접속자 IP',
  user_agent VARCHAR(512) NULL,
  user_id BIGINT NULL,
  acidity TINYINT UNSIGNED NOT NULL COMMENT '산미 1-5',
  sweetness TINYINT UNSIGNED NOT NULL COMMENT '단맛 1-5',
  body TINYINT UNSIGNED NOT NULL COMMENT '바디 1-5',
  nuttiness TINYINT UNSIGNED NOT NULL COMMENT '고소함 1-5',
  bitterness TINYINT UNSIGNED NOT NULL COMMENT '쓴맛 1-5',
  note TEXT NULL,
  expire_at DATETIME NULL COMMENT '만료시간(생성후 24시간)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (session_id),
  INDEX (anonymous_id),
  INDEX (ip_address),
  INDEX (user_id),
  INDEX (created_at)
) ENGINE=InnoDB;

-- 블렌드 (커피 상품 중심)
CREATE TABLE blends (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  origin_ratios JSON NOT NULL COMMENT '예: [{"origin":"Kenya","pct":51},{"origin":"Costa Rica","pct":49}]',
  summary VARCHAR(512) NULL,
  attributes JSON NOT NULL COMMENT '예: {"acidity":4,"sweetness":4,"body":3,"nuttiness":2,"bitterness":1}',
  price DECIMAL(10,2) NULL,
  stock INT DEFAULT 0,
  thumbnail_url VARCHAR(1024) NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (name),
  INDEX (is_active)
) ENGINE=InnoDB;

-- 분석 결과 (취향분석 이력과 추천 블렌드 연동)
CREATE TABLE analysis_results (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  taste_history_id BIGINT NOT NULL,
  blend_id BIGINT NULL,
  score JSON NULL COMMENT '원본 점수 및 추천 점수/매칭 정보',
  interpretation TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (taste_history_id) REFERENCES taste_histories(id) ON DELETE CASCADE,
  FOREIGN KEY (blend_id) REFERENCES blends(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 점수 척도 (참고용)
CREATE TABLE score_scales (
  id TINYINT UNSIGNED PRIMARY KEY,
  label VARCHAR(64) NULL,
  description TEXT NULL
) ENGINE=InnoDB;

INSERT INTO score_scales (id, label, description) VALUES
(1, 'Very Low', '거의 없음'),
(2, 'Low', '낮음'),
(3, 'Medium', '보통'),
(4, 'High', '강함'),
(5, 'Very High', '매우 강함');

-- 블렌드 샘플 데이터
INSERT INTO blends (name, origin_ratios, summary, attributes, price, stock, is_active) VALUES
('Velvet Touch Blend', JSON_ARRAY(JSON_OBJECT('origin','Kenya','pct',51), JSON_OBJECT('origin','Costa Rica','pct',49)), '부드럽고 균형잡힌 산미와 단맛의 조화', JSON_OBJECT('acidity',4,'sweetness',4,'body',3,'nuttiness',2,'bitterness',1), 15000, 100, 1);

-- 사용자
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NULL,
  password_hash VARCHAR(255) NULL,
  display_name VARCHAR(128) NULL,
  is_admin TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (email)
) ENGINE=InnoDB;

-- 이달의 커피 관리 (블렌드 특집)
CREATE TABLE monthly_features (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  blend_id BIGINT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  note VARCHAR(512) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (blend_id) REFERENCES blends(id) ON DELETE CASCADE,
  INDEX (start_date, end_date)
) ENGINE=InnoDB;

-- 통합된 구독 (월구독 전제, 배송 일시정지 지원)
CREATE TABLE subscriptions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  blend_id BIGINT NOT NULL,
  start_date DATE NOT NULL,
  next_billing_date DATE NULL,
  billing_cycle ENUM('monthly') NOT NULL DEFAULT 'monthly',
  status ENUM('active','paused','cancelled','expired') NOT NULL DEFAULT 'active',
  pause_until DATE NULL COMMENT '일시정지된 경우 재개일자',
  payment_method VARCHAR(64) NULL,
  total_amount DECIMAL(10,2) NULL,
  discount_id BIGINT NULL,
  failed_payment_attempts TINYINT UNSIGNED DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blend_id) REFERENCES blends(id) ON DELETE RESTRICT,
  INDEX (user_id),
  INDEX (status),
  INDEX (next_billing_date)
) ENGINE=InnoDB;

-- 결제 (선결제, 선배송 정책)
CREATE TABLE payments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  subscription_id BIGINT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'KRW',
  status ENUM('paid','failed','pending') NOT NULL DEFAULT 'pending',
  provider_transaction_id VARCHAR(255) NULL,
  attempts TINYINT UNSIGNED DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  INDEX (status),
  INDEX (created_at)
) ENGINE=InnoDB;

-- 배송 (월별 배송)
CREATE TABLE shipments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  subscription_id BIGINT NOT NULL,
  scheduled_date DATE NULL,
  shipped_at DATETIME NULL,
  status ENUM('pending','shipped','delivered','cancelled') DEFAULT 'pending',
  tracking_number VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  INDEX (status),
  INDEX (scheduled_date)
) ENGINE=InnoDB;

-- AI 운영 계정 (chat-gpt 기반)
CREATE TABLE ai_accounts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NULL,
  name VARCHAR(128) NULL,
  api_provider VARCHAR(64) NOT NULL DEFAULT 'chat-gpt',
  api_key_encrypted TEXT NULL,
  note TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 사용자 커피 컬렉션 (조회용 이력)
CREATE TABLE user_collections (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  blend_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blend_id) REFERENCES blends(id) ON DELETE CASCADE,
  UNIQUE (user_id, blend_id)
) ENGINE=InnoDB;

-- 할인 (첫구독, 프로모션)
CREATE TABLE discounts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NULL,
  discount_type ENUM('percent','fixed','free') NOT NULL,
  value DECIMAL(10,2) NULL COMMENT 'percent이면 0-100, fixed이면 금액',
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 포인트 이력 (적립/사용/회수, 만료 개념 없음)
CREATE TABLE points_ledger (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  change_amount INT NOT NULL,
  reason ENUM('review','purchase','manual','refund','event') NOT NULL,
  related_id BIGINT NULL COMMENT '리뷰/이벤트 ID 등',
  note TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (user_id),
  INDEX (created_at)
) ENGINE=InnoDB;

-- 쿠폰 (난수 코드, 이벤트 보상)
CREATE TABLE coupons (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  coupon_type ENUM('percent','fixed','free') NOT NULL,
  value DECIMAL(10,2) NULL,
  valid_from DATE NULL,
  valid_until DATE NULL,
  max_redemptions INT DEFAULT 1,
  redeemed_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (code)
) ENGINE=InnoDB;

-- 쿠폰 사용 이력
CREATE TABLE coupon_redemptions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  coupon_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  subscription_id BIGINT NULL,
  redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (user_id),
  INDEX (coupon_id)
) ENGINE=InnoDB;

-- 리뷰 (포토리뷰, 모니터링, 포인트 수동 지급)
CREATE TABLE reviews (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  blend_id BIGINT NOT NULL,
  rating TINYINT UNSIGNED NULL,
  content TEXT NULL,
  photo_url VARCHAR(1024) NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  points_awarded TINYINT(1) DEFAULT 0 COMMENT '1000점 또는 수동 지급 여부',
  moderated_by BIGINT NULL COMMENT '관리자 ID',
  moderated_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blend_id) REFERENCES blends(id) ON DELETE CASCADE,
  FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX (status),
  INDEX (blend_id),
  INDEX (created_at)
) ENGINE=InnoDB;

-- 이벤트 (리워드: 포인트 또는 쿠폰)
CREATE TABLE events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NULL,
  push_on_publish TINYINT(1) DEFAULT 0 COMMENT '등록 시 푸시 일괄발송',
  reward_points INT DEFAULT 0,
  reward_coupon_id BIGINT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reward_coupon_id) REFERENCES coupons(id) ON DELETE SET NULL,
  INDEX (created_at)
) ENGINE=InnoDB;

-- 푸시 구독 (비회원도 가능, 동의한 사용자/디바이스)
CREATE TABLE push_subscriptions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NULL,
  auth_key TEXT NULL,
  enabled TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX (user_id)
) ENGINE=InnoDB;

-- 운영자 관리 (별도 관리, 등급 없음)
CREATE TABLE admins (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  role VARCHAR(64) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id)
) ENGINE=InnoDB;

COMMIT;
