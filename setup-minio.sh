#!/bin/bash
echo "🗄️ إعداد MinIO للعمل مع Fyleo..."

# تثبيت MinIO Client إذا لم يكن موجود
if ! command -v mc &> /dev/null; then
    echo "📥 تثبيت MinIO Client..."
    wget https://dl.min.io/client/mc/release/linux-amd64/mc
    chmod +x mc
    sudo mv mc /usr/local/bin/
fi

# إعداد alias للاتصال بـ MinIO
echo "🔗 إعداد اتصال MinIO..."
mc alias set fyleo-minio http://localhost:9000 minioadmin minioadmin

# إنشاء bucket إذا لم يكن موجود
echo "📦 إنشاء bucket 'appwrite-storage'..."
mc mb fyleo-minio/appwrite-storage --ignore-existing

# تعيين سياسة عامة للقراءة (مؤقتاً للاختبار)
echo "🔓 تعيين سياسة القراءة العامة..."
mc anonymous set public fyleo-minio/appwrite-storage

# عرض معلومات الـ bucket
echo "📊 معلومات الـ bucket:"
mc ls fyleo-minio/

# اختبار رفع ملف تجريبي
echo "🧪 اختبار رفع ملف..."
echo "Hello from Fyleo!" > test-file.txt
mc cp test-file.txt fyleo-minio/appwrite-storage/
rm test-file.txt

# عرض محتوى الـ bucket
echo "📋 محتوى bucket:"
mc ls fyleo-minio/appwrite-storage/

echo "✅ تم إعداد MinIO بنجاح!"
echo "🔗 رابط Console: http://79.76.119.182:9001"
echo "🔑 Access Key: minioadmin"
echo "🔑 Secret Key: minioadmin"
echo "📦 Bucket: appwrite-storage"