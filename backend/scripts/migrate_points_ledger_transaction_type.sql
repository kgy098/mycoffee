-- points_ledger에 transaction_type 컬럼 추가 (1054 Unknown column 해결)
-- 서버 DB에서 실행

ALTER TABLE points_ledger
  ADD COLUMN transaction_type VARCHAR(20) NOT NULL DEFAULT 'earned'
    COMMENT 'earned|spent|expired'
  AFTER user_id;
