#!/bin/bash
# 🔍 سكريبت فحص متغيرات البيئة - Fyleo MinIO Integration

echo "🚀 فحص متغيرات البيئة المطلوبة للنشر..."
echo "================================================"

# ألوان للعرض
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# متغيرات مطلوبة
REQUIRED_VARS=(
    "VITE_APPWRITE_URL"
    "VITE_APPWRITE_PROJECT_ID"
    "VITE_APPWRITE_DATABASE_ID"
    "VITE_MINIO_ENDPOINT"
    "VITE_MINIO_PORT"
    "VITE_MINIO_ACCESS_KEY"
    "VITE_MINIO_SECRET_KEY"
    "VITE_MINIO_BUCKET_NAME"
    "VITE_APPWRITE_FILES_COLLECTION_ID"
    "VITE_APPWRITE_USERS_COLLECTION_ID"
)

# متغيرات اختيارية
OPTIONAL_VARS=(
    "VITE_APP_NAME"
    "VITE_APP_VERSION"
    "VITE_MAX_FILE_SIZE"
    "VITE_ALLOWED_FILE_TYPES"
    "VITE_DEFAULT_LANGUAGE"
    "VITE_ENABLE_DARK_MODE"
)

missing_count=0
optional_missing=0

echo "📋 فحص المتغيرات المطلوبة:"
echo "----------------------------"

for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo -e "${RED}❌ مفقود: $var${NC}"
        ((missing_count++))
    else
        # إخفاء القيم الحساسة
        if [[ $var == *"KEY"* || $var == *"SECRET"* ]]; then
            echo -e "${GREEN}✅ موجود: $var = ****${NC}"
        else
            echo -e "${GREEN}✅ موجود: $var = ${!var}${NC}"
        fi
    fi
done

echo ""
echo "📋 فحص المتغيرات الاختيارية:"
echo "----------------------------"

for var in "${OPTIONAL_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo -e "${YELLOW}⚠️  اختياري مفقود: $var${NC}"
        ((optional_missing++))
    else
        echo -e "${GREEN}✅ موجود: $var = ${!var}${NC}"
    fi
done

echo ""
echo "📊 ملخص النتائج:"
echo "==============="

if [ $missing_count -eq 0 ]; then
    echo -e "${GREEN}🎉 جميع المتغيرات المطلوبة موجودة!${NC}"
    echo -e "${GREEN}✅ جاهز للنشر${NC}"
else
    echo -e "${RED}❌ $missing_count متغير مطلوب مفقود${NC}"
    echo -e "${RED}⚠️  يجب إضافة المتغيرات المفقودة قبل النشر${NC}"
fi

if [ $optional_missing -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $optional_missing متغير اختياري مفقود (لا يؤثر على العمل)${NC}"
fi

echo ""
echo "🔗 روابط مفيدة:"
echo "==============="
echo "MinIO Console: http://${VITE_MINIO_ENDPOINT:-79.76.119.182}:9001"
echo "Appwrite Console: ${VITE_APPWRITE_URL:-https://fra.cloud.appwrite.io/v1}"

echo ""
echo "📝 لإضافة المتغيرات المفقودة:"
echo "=============================="
echo "1. انسخ من .env.production"
echo "2. الصق في منصة الاستضافة"
echo "3. أعد النشر"

exit $missing_count