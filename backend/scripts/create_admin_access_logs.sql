-- Admin access logs table
-- Added for admin access log feature

CREATE TABLE IF NOT EXISTS access_logs (
  id INT NOT NULL AUTO_INCREMENT,
  admin_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  ip_address VARCHAR(64) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_access_logs_admin_id ON access_logs(admin_id);
CREATE INDEX idx_access_logs_created_at ON access_logs(created_at);
