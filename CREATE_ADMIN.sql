-- =====================================================
-- ADMIN USER CREATION SCRIPT
-- Pragyan Bank of USA - Banking Capstone Project
-- =====================================================

-- Switch to auth database
USE auth_db;

-- Step 1: Create admin user
-- Username: admin_new
-- Password: admin123 (created through signup endpoint for proper BCrypt hashing)
-- Email: admin_new@bank.com
-- Note: This user should be created through the signup API endpoint first

-- Step 2: Create ADMIN role (if it doesn't exist)
INSERT IGNORE INTO roles (name) VALUES ('ROLE_ADMIN');

-- Step 3: Link admin user to admin role
INSERT INTO user_roles (user_id, role_id) 
VALUES (
  (SELECT id FROM users WHERE username = 'admin_new'),
  (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')
);

-- Step 4: Remove customer role (keep only admin role)
DELETE FROM user_roles 
WHERE user_id = (SELECT id FROM users WHERE username = 'admin_new') 
AND role_id = (SELECT id FROM roles WHERE name = 'ROLE_CUSTOMER');

-- Step 5: Verify admin user creation
SELECT 
  u.id,
  u.username,
  u.email,
  u.first_name,
  u.last_name,
  r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin_new';

-- =====================================================
-- CREDENTIALS
-- =====================================================
-- Username: admin_new
-- Password: admin123
-- 
-- ⚠️  IMPORTANT SECURITY NOTICE:
-- This is a default admin account for testing purposes.
-- Change the password immediately after first login!
-- =====================================================

