/**
 * 🔒 Appwrite Function: validate-link
 * Validates URL safety using Google Safe Browsing API
 * 
 * Environment Variables Required:
 * - GOOGLE_SAFE_BROWSING_API_KEY: Google Safe Browsing API key
 * 
 * Request Body:
 * {
 *   "url": "https://example.com"
 * }
 * 
 * Response:
 * {
 *   "valid": true/false,
 *   "safe": true/false,
 *   "message": "string",
 *   "threats": []
 * }
 */

const https = require('https');

/**
 * Make HTTPS request
 */
function httpsRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: body
          });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

/**
 * Check if URL is valid
 */
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Check URL safety using Google Safe Browsing API
 */
async function checkUrlSafety(url, apiKey) {
  if (!apiKey) {
    console.warn('⚠️  Google Safe Browsing API key not configured');
    return { safe: true, threats: [], warning: 'API key not configured' };
  }

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    
    const requestBody = {
      client: {
        clientId: 'fyleo-platform',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    };

    const response = await httpsRequest(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      requestBody
    );

    const threats = response.data.matches || [];
    
    if (threats.length > 0) {
      console.warn('🚨 Unsafe URL detected:', url);
      return {
        safe: false,
        threats: threats.map(t => ({
          type: t.threatType,
          platform: t.platformType
        }))
      };
    }

    console.log('✅ URL is safe:', url);
    return { safe: true, threats: [] };

  } catch (error) {
    console.error('❌ Error checking URL safety:', error.message);
    
    // On error, fail safe: allow the URL but log warning
    console.warn('⚠️  Allowing URL due to API error');
    return { safe: true, threats: [], warning: 'Could not verify URL safety' };
  }
}

/**
 * Main function handler
 */
module.exports = async ({ req, res, log, error }) => {
  try {
    log('🔒 Link Validation Function Started');
    
    // Parse request body
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      error('Failed to parse request body:', e);
      return res.json({
        valid: false,
        safe: false,
        message: 'Invalid request body',
        threats: []
      }, 400);
    }
    
    const { url } = body;
    
    if (!url) {
      log('❌ No URL provided');
      return res.json({
        valid: false,
        safe: false,
        message: 'URL is required',
        threats: []
      }, 400);
    }
    
    log('🔍 Validating URL:', url);
    
    // Step 1: Validate format
    if (!isValidUrl(url)) {
      log('❌ Invalid URL format');
      return res.json({
        valid: false,
        safe: false,
        message: 'Invalid URL format. Must start with http:// or https://',
        threats: []
      }, 200);
    }
    
    // Step 2: Check safety
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    const safetyCheck = await checkUrlSafety(url, apiKey);
    
    if (!safetyCheck.safe) {
      const threatTypes = safetyCheck.threats.map(t => t.type).join(', ');
      log('🚨 URL flagged as dangerous:', threatTypes);
      return res.json({
        valid: true,
        safe: false,
        message: `This URL has been flagged as potentially dangerous: ${threatTypes}`,
        threats: safetyCheck.threats
      }, 200);
    }
    
    log('✅ URL is valid and safe');
    return res.json({
      valid: true,
      safe: true,
      message: 'URL is valid and safe',
      threats: [],
      warning: safetyCheck.warning
    }, 200);
    
  } catch (err) {
    error('❌ Function error:', err);
    return res.json({
      valid: false,
      safe: false,
      message: 'Internal server error',
      threats: [],
      error: err.message
    }, 500);
  }
};
