# 🔧 إصلاح CORS لـ Meilisearch

## المشكلة
المتصفح يحظر الطلبات من `http://localhost:5173` إلى `https://minio97.chickenkiller.com/meili`

```
❌ Error: Request to https://minio97.chickenkiller.com/meili/health has failed
Caused by: TypeError: Failed to fetch
```

## الحل: تعديل Caddyfile على السيرفر

### 1️⃣ اتصل بالسيرفر
```bash
ssh user@minio97.chickenkiller.com
```

### 2️⃣ افتح ملف Caddyfile
```bash
sudo nano /etc/caddy/Caddyfile
```

### 3️⃣ أضف/عدل إعدادات CORS
ابحث عن القسم الخاص بـ `/meili*` وعدله ليصبح:

```caddyfile
minio97.chickenkiller.com {
    # Meilisearch - مع إعدادات CORS محدثة
    route /meili* {
        # إعدادات CORS للسماح للمتصفح بالوصول
        header {
            # السماح لجميع منافذ localhost
            Access-Control-Allow-Origin http://localhost:*
            
            # أو حدد المنافذ بشكل منفصل:
            # Access-Control-Allow-Origin "http://localhost:5173, http://localhost:5174, https://fyleo.dev, https://fyleo.vercel.app"
            
            Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            Access-Control-Allow-Headers "Authorization, Content-Type, X-Meili-API-Key"
            Access-Control-Allow-Credentials true
            Access-Control-Max-Age 86400
        }
        
        # معالجة طلبات OPTIONS (preflight)
        @options {
            method OPTIONS
        }
        handle @options {
            respond 204
        }
        
        # إعادة توجيه الطلبات إلى Meilisearch
        reverse_proxy 127.0.0.1:7701 {
            header_up Host {host}
            header_up X-Real-IP {remote_host}
        }
    }
    
    # باقي إعدادات السيرفر...
}
```

### 4️⃣ احفظ الملف
- في nano: اضغط `Ctrl+X` ثم `Y` ثم `Enter`

### 5️⃣ تحقق من صحة الإعدادات
```bash
sudo caddy validate --config /etc/caddy/Caddyfile
```

### 6️⃣ أعد تشغيل Caddy
```bash
sudo systemctl reload caddy
```

أو:
```bash
sudo systemctl restart caddy
```

### 7️⃣ تحقق من حالة Caddy
```bash
sudo systemctl status caddy
```

---

## ✅ بعد تطبيق الإصلاح

1. **افتح المتصفح** على: http://localhost:5173/
2. **افتح Console** (F12)
3. **جرب البحث**

### النتيجة المتوقعة:
```
✅ 🚀 Initializing Meilisearch sync...
✅ 📊 Performing initial indexing...
✅ ✅ Meilisearch fully synchronized
✅ 🔍 Meilisearch global search: "test"
```

---

## 🔍 التحقق من CORS

يمكنك اختبار CORS من المتصفح:

```javascript
// افتح Console في المتصفح واكتب:
fetch('https://minio97.chickenkiller.com/meili/health', {
  headers: {
    'Authorization': 'Bearer StrongSearchKey123'
  }
})
.then(r => r.json())
.then(data => console.log('✅ CORS working:', data))
.catch(err => console.error('❌ CORS blocked:', err));
```

إذا ظهر `✅ CORS working: { status: "available" }` فإن CORS يعمل!

---

## 🎯 ملاحظات مهمة

### Wildcard في localhost
```caddyfile
Access-Control-Allow-Origin http://localhost:*
```
هذا **لا يعمل** في جميع إصدارات Caddy. إذا لم ينجح، استخدم:

```caddyfile
@cors_origins {
    header_regexp Origin (http://localhost:[0-9]+|https://fyleo\.dev|https://fyleo\.vercel\.app)
}
handle @cors_origins {
    header Access-Control-Allow-Origin {http.request.header.Origin}
}
```

### للإنتاج فقط
إذا كنت تريد تعطيل localhost في الإنتاج:

```caddyfile
Access-Control-Allow-Origin "https://fyleo.dev, https://fyleo.vercel.app, https://fyleo.appwrite.network"
```

---

## 🆘 إذا لم ينجح الحل

1. **تحقق من logs Caddy**:
   ```bash
   sudo journalctl -u caddy -f
   ```

2. **تحقق من Meilisearch يعمل**:
   ```bash
   curl http://127.0.0.1:7701/health
   ```

3. **اختبر CORS مباشرة**:
   ```bash
   curl -X OPTIONS https://minio97.chickenkiller.com/meili/health \
     -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -v
   ```
   
   يجب أن ترى:
   ```
   < Access-Control-Allow-Origin: http://localhost:5173
   ```

---

## 📚 مصادر إضافية

- [Caddy CORS Documentation](https://caddyserver.com/docs/caddyfile/directives/header)
- [Meilisearch CORS Guide](https://www.meilisearch.com/docs/learn/security/cors)
