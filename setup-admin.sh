#!/bin/bash

# =====================================================
# ADMIN USER SETUP SCRIPT
# Pragyan Bank of USA
# =====================================================

echo "🔐 Creating Admin User for Banking System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if MySQL container is running
if ! docker ps | grep -q banking-mysql; then
    echo "❌ Error: MySQL container is not running."
    echo "Please start the application first with: docker-compose up -d"
    exit 1
fi

echo "✅ Docker is running"
echo "✅ MySQL container found"
echo ""

# Run the SQL script
echo "📝 Creating admin user in database..."
docker exec -i banking-mysql mysql -u root -prootpassword < CREATE_ADMIN.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Admin user created successfully!"
    echo ""
    echo "================================================"
    echo "  ADMIN CREDENTIALS"
    echo "================================================"
    echo "  Username: admin"
    echo "  Password: admin123"
    echo ""
    echo "  🌐 Login at: http://localhost:3000/login"
    echo "================================================"
    echo ""
    echo "⚠️  SECURITY WARNING:"
    echo "    Change this password after first login!"
    echo ""
else
    echo ""
    echo "❌ Error creating admin user."
    echo "This might be normal if the admin user already exists."
    echo ""
    echo "To check if admin exists, run:"
    echo "  docker exec -it banking-mysql mysql -u root -prootpassword -e \"SELECT username FROM auth_db.users WHERE username='admin';\""
    echo ""
fi

