/**
 * Link Security Client
 * Frontend service to validate URLs using Appwrite Function
 */

import { Client, Functions } from 'appwrite';

// Initialize Appwrite client
const client = new Client();
const functions = new Functions(client);

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const FUNCTION_ID = import.meta.env.VITE_APPWRITE_VALIDATE_LINK_FUNCTION_ID || 'validate-link';

/**
 * Validate URL safety using Appwrite Function
 * @param {string} url - The URL to validate
 * @returns {Promise<{valid: boolean, safe: boolean, message: string}>}
 */
export async function validateUrlSafety(url) {
  try {
    console.log('🔒 Validating URL with Appwrite Function:', url);
    
    // Execute the Appwrite Function
    const execution = await functions.createExecution(
      FUNCTION_ID,
      JSON.stringify({ url }),
      false, // async = false (wait for result)
      '/', // path
      'POST' // method
    );
    
    console.log('📊 Function execution response:', execution);
    
    // Parse the response
    let data;
    try {
      data = JSON.parse(execution.responseBody);
    } catch (e) {
      console.error('Failed to parse function response:', e);
      throw new Error('Invalid response from validation function');
    }
    
    console.log('✅ Validation result:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error validating URL with Appwrite Function:', error);
    
    // If function is not available, perform basic client-side validation only
    console.warn('⚠️  Appwrite Function not available, performing basic validation only');
    try {
      new URL(url);
      return {
        valid: true,
        safe: true,
        message: 'URL format is valid (security check unavailable)',
        warning: 'Appwrite Function not available'
      };
    } catch {
      return {
        valid: false,
        safe: false,
        message: 'Invalid URL format'
      };
    }
  }
}

export default {
  validateUrlSafety
};
