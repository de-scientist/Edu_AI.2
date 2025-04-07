/**
 * Simple in-memory cache implementation to replace Redis
 * This provides a similar API to Redis but works without external dependencies
 */

class Cache {
  constructor() {
    this.store = new Map();
    this.expirations = new Map();
  }

  /**
   * Set a value in the cache with optional expiration
   * @param {string} key - Cache key
   * @param {string} value - Value to store
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {Promise<string>} - "OK" to match Redis API
   */
  async set(key, value, ttl = null) {
    this.store.set(key, value);
    
    if (ttl) {
      const expirationTime = Date.now() + (ttl * 1000);
      this.expirations.set(key, expirationTime);
    }
    
    return "OK";
  }

  /**
   * Set a value with expiration in one operation (like Redis setex)
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in seconds
   * @param {string} value - Value to store
   * @returns {Promise<string>} - "OK" to match Redis API
   */
  async setex(key, ttl, value) {
    return this.set(key, value, ttl);
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {Promise<string|null>} - The value or null if not found/expired
   */
  async get(key) {
    // Check if the key has expired
    if (this.expirations.has(key)) {
      const expirationTime = this.expirations.get(key);
      if (Date.now() > expirationTime) {
        this.store.delete(key);
        this.expirations.delete(key);
        return null;
      }
    }
    
    return this.store.get(key) || null;
  }

  /**
   * Delete a key from the cache
   * @param {string} key - Cache key
   * @returns {Promise<number>} - 1 if deleted, 0 if not found
   */
  async del(key) {
    const exists = this.store.has(key);
    if (exists) {
      this.store.delete(key);
      this.expirations.delete(key);
      return 1;
    }
    return 0;
  }

  /**
   * Clear all keys from the cache
   * @returns {Promise<string>} - "OK" to match Redis API
   */
  async flushall() {
    this.store.clear();
    this.expirations.clear();
    return "OK";
  }
}

// Create a singleton instance
const cache = new Cache();

export default cache; 