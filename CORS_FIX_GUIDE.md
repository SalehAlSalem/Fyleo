# 🔧 CORS Issue Fix - Meilisearch + Localhost

## 🐛 Problem

The browser is blocking requests from `http://localhost:5174` to `https://minio97.chickenkiller.com/meili` due to CORS policy.

**Error**:
```
❌ Request to https://minio97.chickenkiller.com/meili/health has failed
Caused by: TypeError: Failed to fetch
```

---

## ✅ Solution: Update Caddy CORS Configuration

Your Caddy server needs to allow requests from `http://localhost:5174` (and other local ports).

### Step 1: Update Caddyfile

SSH into your server and edit the Caddyfile:

```bash
sudo nano /etc/caddy/Caddyfile
```

Find the `/meili*` route and update the CORS headers:

```caddy
minio97.chickenkiller.com {
    # ... other config ...

    # Meilisearch reverse proxy
    handle /meili* {
        # CORS Headers - UPDATED
        header Access-Control-Allow-Origin "http://localhost:5174, http://localhost:5173, http://localhost:3000, https://fyleo.dev, https://fyleo.vercel.app, https://fyleo.appwrite.network"
        header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
        header Access-Control-Allow-Credentials "true"
        header Access-Control-Max-Age "86400"

        # Handle preflight OPTIONS requests
        @options {
            method OPTIONS
        }
        respond @options 204

        # Proxy to Meilisearch
        reverse_proxy 127.0.0.1:7701
    }
}
```

**Or use wildcard for all localhost ports** (more permissive for development):

```caddy
header Access-Control-Allow-Origin "*"
```

### Step 2: Reload Caddy

```bash
sudo systemctl reload caddy
```

### Step 3: Verify

```bash
# Check Caddy status
sudo systemctl status caddy

# Test CORS from your local machine
curl -i -X OPTIONS https://minio97.chickenkiller.com/meili/health \
  -H "Origin: http://localhost:5174" \
  -H "Access-Control-Request-Method: GET"
```

Expected response should include:
```
Access-Control-Allow-Origin: http://localhost:5174
```

---

## 🔍 Alternative: Check Current CORS Headers

From your Windows machine, test the current CORS configuration:

```powershell
# PowerShell
Invoke-WebRequest -Uri "https://minio97.chickenkiller.com/meili/health" `
  -Method OPTIONS `
  -Headers @{
    "Origin" = "http://localhost:5174"
    "Access-Control-Request-Method" = "GET"
  } | Select-Object -ExpandProperty Headers
```

---

## 🚀 Temporary Workaround (For Testing)

While waiting for the CORS fix, you can test Meilisearch from Node.js scripts (which don't have CORS restrictions):

```powershell
# This works because Node.js doesn't enforce CORS
node scripts/test-meilisearch-connection.js
```

**Note**: The frontend will still fail until Caddy CORS is updated.

---

## 📋 Complete Caddyfile Example

Here's a complete Meilisearch section for your Caddyfile:

```caddy
minio97.chickenkiller.com {
    # SSL managed by Caddy (Let's Encrypt)
    
    # Meilisearch reverse proxy
    handle /meili* {
        # CORS Headers
        @cors_preflight {
            method OPTIONS
        }
        
        header Access-Control-Allow-Origin "http://localhost:5174, http://localhost:5173, http://localhost:3000, https://fyleo.dev, https://fyleo.vercel.app, https://fyleo.appwrite.network"
        header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, X-Meili-API-Key"
        header Access-Control-Allow-Credentials "true"
        header Access-Control-Max-Age "86400"
        
        # Respond to preflight
        respond @cors_preflight 204
        
        # Proxy to Meilisearch
        reverse_proxy 127.0.0.1:7701 {
            header_up Host {host}
            header_up X-Real-IP {remote}
            header_up X-Forwarded-For {remote}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # Other routes...
}
```

---

## 🧪 Verify CORS Fix

After updating Caddy, test in your browser console:

```javascript
// Test CORS from browser console
fetch('https://minio97.chickenkiller.com/meili/health', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer StrongSearchKey123'
  }
})
  .then(r => r.json())
  .then(d => console.log('✅ CORS working!', d))
  .catch(e => console.error('❌ CORS still blocked:', e))
```

Expected: `✅ CORS working! { status: 'available' }`

---

## 🔒 Security Note

For **production**, limit CORS to specific origins:

```caddy
# Production-only CORS (recommended)
header Access-Control-Allow-Origin "https://fyleo.dev, https://fyleo.vercel.app"
```

For **development**, you can use wildcard temporarily:

```caddy
# Development-only (less secure)
header Access-Control-Allow-Origin "*"
```

---

## 📞 Still Having Issues?

### Check Browser Console

Look for specific CORS error messages:

```
❌ Access to fetch at 'https://minio97.chickenkiller.com/meili/health' 
   from origin 'http://localhost:5174' has been blocked by CORS policy
```

### Check Network Tab

1. Open DevTools → Network
2. Try a search
3. Look for the failed request to `/meili/health`
4. Check Response Headers - should include `Access-Control-Allow-Origin`

### Check Caddy Logs

On your server:

```bash
sudo journalctl -u caddy -f
```

Look for any errors or access logs when you try to connect.

---

## ✅ Expected Result

Once CORS is fixed, you should see in browser console:

```
🚀 Initializing Meilisearch sync...
✅ Meilisearch health check passed
📊 Performing initial indexing...
✅ Meilisearch fully synchronized
```

**No more "Failed to fetch" errors!** 🎉

---

**Quick Fix Command** (Run on your server):

```bash
# Backup current config
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup

# Edit Caddyfile
sudo nano /etc/caddy/Caddyfile

# Add localhost:5174 to Access-Control-Allow-Origin
# Then save and reload:

sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```
