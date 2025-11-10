/**
 * Meilisearch Proxy - Appwrite Cloud Function
 * 
 * 🔒 Secure proxy that hides Meilisearch API key from browser
 * 🚀 Forwards all requests to Meilisearch server with authentication
 * 
 * Environment Variables Required:
 * - MEILISEARCH_HOST: https://minio97.chickenkiller.com/meili
 * - MEILISEARCH_API_KEY: StrongSearchKey123
 * 
 * Usage from browser:
 * - POST https://fyleo.appwrite.network/v1/functions/[FUNCTION_ID]/executions
 * - Body: { path: "/indexes/materials_posts/search", method: "POST", body: {...} }
 */

export default async ({ req, res, log, error }) => {
  // CORS headers for browser access
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.json({ ok: true }, 200, corsHeaders);
  }

  try {
    // Get configuration from environment variables
    const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'https://minio97.chickenkiller.com/meili';
    const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY;

    if (!MEILISEARCH_API_KEY) {
      error('❌ MEILISEARCH_API_KEY not configured in function environment');
      return res.json(
        { error: 'Meilisearch API key not configured' },
        500,
        corsHeaders
      );
    }

    // Parse request body
    let requestData;
    try {
      requestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      error('❌ Invalid JSON in request body:', e);
      return res.json(
        { error: 'Invalid JSON in request body' },
        400,
        corsHeaders
      );
    }

    const { path, method = 'GET', body: meiliBody } = requestData;

    if (!path) {
      error('❌ Missing "path" in request body');
      return res.json(
        { error: 'Missing "path" parameter. Example: /indexes/materials_posts/search' },
        400,
        corsHeaders
      );
    }

    // Build full URL
    const url = `${MEILISEARCH_HOST}${path}`;
    log(`📡 Proxying ${method} ${url}`);

    // Prepare fetch options
    const fetchOptions = {
      method: method,
      headers: {
        'Authorization': `Bearer ${MEILISEARCH_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    // Add body for POST/PUT/PATCH requests
    if (meiliBody && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      fetchOptions.body = typeof meiliBody === 'string' ? meiliBody : JSON.stringify(meiliBody);
    }

    // Forward request to Meilisearch
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    log(`✅ Meilisearch response: ${response.status}`);

    // Return Meilisearch response with CORS headers
    return res.json(data, response.status, corsHeaders);

  } catch (err) {
    error('❌ Proxy error:', err);
    return res.json(
      { 
        error: 'Proxy error',
        message: err.message,
        details: err.toString()
      },
      500,
      corsHeaders
    );
  }
};
