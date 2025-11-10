/**
 * Meilisearch Proxy Client
 * Adapter to use Appwrite Function as Meilisearch proxy
 */

export class MeilisearchProxyClient {
  constructor(functionEndpoint, functionId) {
    this.endpoint = functionEndpoint || `https://cloud.appwrite.io/v1/functions/${functionId}/executions`;
    this.functionId = functionId;
  }

  /**
   * Make a request through the proxy
   */
  async request(path, method = 'GET', body = null) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path,
          method,
          body
        })
      });

      if (!response.ok) {
        throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
      }

      // Appwrite Function returns data wrapped in execution object
      const execution = await response.json();
      
      // Parse the response body (it's a string)
      if (execution.responseBody) {
        return JSON.parse(execution.responseBody);
      }
      
      return execution;
    } catch (error) {
      console.error('❌ Meilisearch proxy request error:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async isHealthy() {
    try {
      const result = await this.request('/health', 'GET');
      return result.status === 'available';
    } catch (error) {
      return false;
    }
  }

  /**
   * Get index
   */
  index(indexName) {
    return {
      search: async (query, options = {}) => {
        const searchBody = {
          q: query,
          ...options
        };
        return await this.request(`/indexes/${indexName}/search`, 'POST', searchBody);
      },

      addDocuments: async (documents, options = {}) => {
        const queryParams = new URLSearchParams();
        if (options.primaryKey) {
          queryParams.append('primaryKey', options.primaryKey);
        }
        const path = `/indexes/${indexName}/documents${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await this.request(path, 'POST', documents);
      },

      updateDocuments: async (documents) => {
        return await this.request(`/indexes/${indexName}/documents`, 'PUT', documents);
      },

      deleteDocument: async (documentId) => {
        return await this.request(`/indexes/${indexName}/documents/${documentId}`, 'DELETE');
      },

      deleteAllDocuments: async () => {
        return await this.request(`/indexes/${indexName}/documents`, 'DELETE');
      },

      getSettings: async () => {
        return await this.request(`/indexes/${indexName}/settings`, 'GET');
      },

      updateSettings: async (settings) => {
        return await this.request(`/indexes/${indexName}/settings`, 'PATCH', settings);
      }
    };
  }
}

export default MeilisearchProxyClient;
