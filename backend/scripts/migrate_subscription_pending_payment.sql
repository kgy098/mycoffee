-- 구독 상태에 pending_payment 추가 (토스 결제 대기)
-- MySQL에서 subscriptions.status 가 ENUM 타입일 때만 실행. VARCHAR면 불필요.

-- ENUM인 경우 예시 (실제 컬럼 정의에 맞게 수정):
-- ALTER TABLE subscriptions
--   MODIFY COLUMN status ENUM('active','paused','cancelled','expired','pending_payment') NOT NULL DEFAULT 'active';
