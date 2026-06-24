#!/bin/bash

# Pastikan script berhenti jika terjadi error
set -e

echo "============================================="
echo "   MENGAMBIL UPDATE DARI GITHUB (GIT PULL)   "
echo "============================================="
git pull

echo ""
echo "============================================="
echo "       MENGUPDATE BACKEND (LARAVEL)          "
echo "============================================="
cd backend

echo "[1/5] Menginstall dependensi PHP..."
composer install --no-dev --optimize-autoloader

echo "[2/5] Menjalankan migrasi database..."
php artisan migrate --force

echo "[3/5] Menghubungkan storage (symlink)..."
php artisan storage:link || echo "Storage link sudah ada."

echo "[4/5] Mengoptimalkan cache Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "[5/5] Selesai memproses backend."
cd ..

echo ""
echo "============================================="
echo "       MENGUPDATE FRONTEND (NEXT.JS)         "
echo "============================================="
cd frontend

echo "[1/2] Menginstall dependensi Node.js..."
npm install

echo "[2/2] Membangun Next.js production build..."
npm run build

echo "Selesai memproses frontend."
cd ..

echo ""
echo "============================================="
echo "             DEPLOYMENT SELESAI              "
echo "============================================="
echo "Semua file berhasil diperbarui!"
echo "Catatan: Jangan lupa untuk menekan tombol 'Restart' pada"
echo "aplikasi Node.js Anda di menu 'Setup Node.js App' cPanel"
echo "agar perubahan frontend langsung aktif."
echo "============================================="
