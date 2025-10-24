/**
 * WebTrackerSDK
 * @version 1.2.0
 */
class WebTracker {
  /**
   * SDK Version
   * @static
   * @readonly
   */
  static VERSION = '1.2.0';

  /**
   * Source Type Enum for configuration
   * @static
   * @readonly
   */
  static SourceType = Object.freeze({
    ClickID: 'Click ID',
    ReferrerURL: 'Referrer URL',
    UTMCampaign: 'UTM Campaign'
  });

  /**
   * Initialize the WebTrackerSDK with configuration
   * @param {Object} config - Configuration object
   * @param {string} config.apiEndpoint - Required: API endpoint for sending events
   * @param {string} config.trackerId - Required: tracker identifier
   * @param {boolean} [config.enabled=true] - Enable or disable the SDK completely
   * @param {boolean} [config.autoTrack=true] - Enable automatic event tracking
   * @param {boolean} [config.geo=true] - Request location tracking permission via browser API
   * @param {string} [config.source=null] - Click ID / Referrer URL
   * @param {string} [config.sourceType=null] - Types: use WebTracker.SourceType
   */
  constructor(config) {
    // Validate required configuration
    this.#validateConfig(config);

    // Initialize configuration with defaults (keep as private)
    this.#config = {
      enabled: true,
      autoTrack: true,
      geo: true,
      ...config
    };

    // If SDK is disabled, stop initialization here
    if (!this.#config.enabled) {
      console.log('WebTrackerSDK is disabled');
      return;
    }

    // Start initialization process
    this.#init();
  }

  // ==================== Private Properties ====================

  #config;
  #userId = null;
  #sessionId;
  #browserFingerprint;
  #geoData = null;
  #userAgent;
  #language;
  #timezone;
  #sessionStartTime;
  #isNewUser = false;
  #sessionEndSent = false;
  #utmData = null;

  // ==================== Private Methods ====================

  /**
   * Validate required configuration parameters
   * @private
   */
  #validateConfig(config) {
    if (!config?.apiEndpoint) {
      throw new Error('WebTrackerSDK: apiEndpoint is required');
    }
    if (!config?.trackerId) {
      throw new Error('WebTrackerSDK: trackerId is required');
    }
  }

  /**
   * Initialize the SDK - set up instance properties, tracking and data collection
   * @private
   */
  #init() {
    // Don't initialize if SDK is disabled
    if (!this.#config.enabled) return;

    // Extract and store UTM parameters
    const currentUTM = this.#extractUTMParameters();
    if (currentUTM) {
      this.#storeUTMData(currentUTM);
    }

    // Get UTM data (current or stored)
    this.#utmData = this.#getStoredUTMData();

    // Update source/sourceType based on UTM if not explicitly set
    if (this.#utmData && this.#config.sourceType == null) {
      this.#config.source = this.#generateSourceFromUTM(this.#utmData);
      this.#config.sourceType = WebTracker.SourceType.UTMCampaign;
    }

    // Auto-populate source and sourceType from document.referrer when sourceType is null
    try {
      if (this.#config.sourceType == null) {
        const ref = typeof document !== 'undefined' ? (document.referrer || null) : null;
        if (ref) {
          if (this.#config.source == null) {
            this.#config.source = ref;
          }
          this.#config.sourceType = WebTracker.SourceType.ReferrerURL;
        }
      }
    } catch (_) {
      // Ignore referrer access issues (privacy policies, sandboxed iframes, etc.)
    }

    // Initialize instance properties
    this.#userId = null;
    this.#sessionId = this.#generateSessionId();
    this.#browserFingerprint = this.#generateBrowserFingerprint();
    this.#geoData = null;

    // Initialize browser information
    this.#userAgent = navigator.userAgent;
    this.#language = navigator.language;
    this.#timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Initialize session start time
    this.#sessionStartTime = Date.now();

    // Detect if this is a new user
    this.#isNewUser = this.#detectNewUser();

    this.#scheduleIdleTask(() => {
      // Request geolocation if configured
      if (this.#config.geo) {
        this.#requestGeolocation();
      }

      // Set up automatic tracking if enabled
      if (this.#config.autoTrack) {
        this.#setupAutoTracking();
      }

      // Determine if new user, try sending UV once
      this.#maybeTrackUV();
    });
  }



  /**
   * Extract UTM and click ID parameters from URL if any
   * @private
   */
  #extractUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {};

    // Standard UTM parameters
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const clickIds = ['gclid', 'fbclid', 'msclkid', 'ttclid'];

    [...utmParams, ...clickIds].forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        utmData[param] = value;
      }
    });

    return Object.keys(utmData).length > 0 ? utmData : null;
  }

  /**
   * Store UTM into localStorage/sessionStorage/memory
   * @private
   */
  #storeUTMData(utmData) {
    if (!utmData) return;

    try {
      // Store in localStorage for persistence across sessions
      const utmKey = `utm_${this.#config.trackerId}`;
      const existingUTM = localStorage.getItem(utmKey);

      // Only overwrite if we have new UTM data (first-touch attribution)
      if (!existingUTM) {
        localStorage.setItem(utmKey, JSON.stringify({
          ...utmData,
          expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        }));
      }
    } catch (e) {
      // Fallback to sessionStorage
      try {
        sessionStorage.setItem(`utm_session_${this.#config.trackerId}`, JSON.stringify(utmData));
      } catch (e) {
        // Store in memory as last resort
        this.#utmData = utmData;
      }
    }
  }

  /**
   * Get the stored UTM data if any
   * @private
   */
  #getStoredUTMData() {
    const utmKey = `utm_${this.#config.trackerId}`;

    try {
      const stored = localStorage.getItem(utmKey);
      if (stored) {
        const utmData = JSON.parse(stored);
        // Check if expired
        if (utmData.expires && Date.now() > utmData.expires) {
          localStorage.removeItem(utmKey);
          return null;
        }
        return utmData;
      }
    } catch (e) {
      // Try sessionStorage fallback
      try {
        const sessionData = sessionStorage.getItem(`utm_session_${this.#config.trackerId}`);
        return sessionData ? JSON.parse(sessionData) : null;
      } catch (e) {
        return this.#utmData || null;
      }
    }

    return null;
  }

  /**
   * Get source from UTM data if available
   * @private
   */
  #generateSourceFromUTM(utmData) {
    // Create a readable source string
    const parts = [];

    if (utmData.utm_source) parts.push(utmData.utm_source);
    if (utmData.utm_medium) parts.push(utmData.utm_medium);
    if (utmData.utm_campaign) parts.push(utmData.utm_campaign);

    return parts.length > 0 ? parts.join(' / ') : null;
  }

  /**
   * Request user's geolocation using browser's permission API
   * @private
   */
  #requestGeolocation() {
    // Only request if configured and geolocation available
    if (!this.#config.geo || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => this.#handleGeolocationSuccess(position),
      (error) => this.#handleGeolocationError(error),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000 // Cache for 10 minutes
      }
    );
  }

  /**
   * Handle successful geolocation request
   * @private
   */
  #handleGeolocationSuccess(position) {
    this.#geoData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  }

  /**
   * Handle geolocation error
   * @private
   */
  #handleGeolocationError(error) {
    console.warn('Geolocation error:', error.message);
  }

  /**
   * Track session end event
   * @private
   */
  #trackSessionEnd() {
    // Prevent duplicate session end events from beforeunload & pagehide
    if (this.#sessionEndSent) return;
    this.#sessionEndSent = true;

    const sessionDuration = Date.now() - this.#sessionStartTime;
    const event = this.#createSchemaCompliantEvent('session_end', {
      session_duration: sessionDuration   // milliseconds
    });
    this.#sendBeaconEvent(event);
  }

  /**
   * Set up automatic event tracking
   * @private
   */
  #setupAutoTracking() {
    // Track initial page view
    this.#trackPageView();

    // Track click events
    this.#setupClickTracking();

    // Track scroll events
    this.#setupScrollTracking();

    // Track form submissions
    this.#setupFormTracking();

    // Track session end
    this.#setupSessionEndTracking();

    // Track visibility changes
    this.#setupVisibilityTracking();
  }

  /**
   * Set up click event tracking
   * @private
   */
  #setupClickTracking() {
    document.addEventListener('click', (event) => {
      this.#scheduleIdleTask(() => this.#trackClick(event));
    }, { passive: true });
  }

  /**
   * Set up scroll event tracking
   * @private
   */
  #setupScrollTracking() {
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.#scheduleIdleTask(() => this.#trackScroll());
      }, 500); // Debounce scroll events
    }, { passive: true });
  }

  /**
   * Set up form submission tracking
   * @private
   */
  #setupFormTracking() {
    document.addEventListener('submit', (event) => {
      this.#scheduleIdleTask(() => this.#trackFormSubmit(event));
    });
  }

  /**
   * Set up session end tracking
   * @private
   */
  #setupSessionEndTracking() {
    // Track on both beforeunload and pagehide for better coverage
    window.addEventListener('beforeunload', () => {
      this.#trackSessionEnd();
    });

    window.addEventListener('pagehide', () => {
      this.#trackSessionEnd();
    });
  }

  /**
   * Set up visibility change tracking
   * @private
   */
  #setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      const eventType = document.hidden ? 'page_hidden' : 'page_visible';
      this.#scheduleIdleTask(() => this.#trackEvent(eventType, {}));
    });
  }

  /**
   * Track page view event
   * @private
   */
  #trackPageView() {
    this.#trackEvent('page_view', {});
  }

  /**
   * Track click event
   * @private
   */
  #trackClick(event) {
    const element = event.target;
    const clickData = {
      interaction: {
        action_type: 'click',
        element_id: element.id || null,
        element_class: element.className || null,
        element_tag: element.tagName?.toLowerCase() || null,
        element_text: element.textContent?.slice(0, 100) || null,
        position_x: event.clientX,
        position_y: event.clientY
      }
    };

    this.#trackEvent('click', clickData);
  }

  /**
   * Track scroll event
   * @private
   */
  #trackScroll() {
    const scrollData = {
      interaction: {
        action_type: 'scroll',
        scroll_top: window.pageYOffset,
        scroll_percent: Math.round((window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100)
      }
    };

    this.#trackEvent('scroll', scrollData);
  }

  /**
   * Track form submission
   * @private
   */
  #trackFormSubmit(event) {
    const form = event.target;
    const formData = {
      interaction: {
        action_type: 'form_submit',
        element_id: form.id || null,
        form_action: form.action || null,
        field_count: form.elements.length
      }
    };

    this.#trackEvent('form_submit', formData);
  }

  /**
   * Core event tracking method (private)
   * @private
   * @param {string} eventType - Type of event to track
   * @param {Object} [eventDetail={}] - Additional event data
   */
  #trackEvent(eventType, eventDetail = {}) {
    // Don't track if SDK is disabled
    if (!this.#config.enabled) return;

    // Create schema-compliant event
    const event = this.#createSchemaCompliantEvent(eventType, eventDetail);

    // Send event immediately
    this.#sendEvent(event);
  }

  /**
   * Create a schema-compliant event object
   * @private
   * @param {string} eventType - Event type
   * @param {Object} [eventDetail={}] - Additional event data
   * @returns {Object} Schema-compliant event object
   */
  #createSchemaCompliantEvent(eventType, eventDetail = {}) {
    const timestamp = Date.now();

    // Base event structure
    const event = {
      tracker_id: this.#config.trackerId,
      event_id: this.#generateEventId(),
      event_type: eventType,
      event_detail: eventDetail,
      timestamp: timestamp,
      timezone: this.#timezone,
      browser_fingerprint: this.#browserFingerprint,
      source: this.#config.source || null,
      source_type: this.#config.sourceType || null,
      session_id: this.#sessionId,
      language: this.#language,
      user_agent: this.#userAgent,
      geo: this.#geoData,
      user_id: this.#userId
    };

    // Add page information as JSON string
    event.page = {
      url: window.location.href,
      referrer: document.referrer || null,
      title: document.title,
      path: window.location.pathname,
      query_params: this.#getQueryParams()
    };

    // Check if source is present in query_params and override event.source and event.source_type
    if (event.page.query_params && event.page.query_params.source) {
      event.source = event.page.query_params.source;
      event.source_type = WebTracker.SourceType.ClickID;
    }

    // Add UTM data to all events
    if (this.#utmData) {
      event.utm = {
        utm_source: this.#utmData.utm_source || null,
        utm_medium: this.#utmData.utm_medium || null,
        utm_campaign: this.#utmData.utm_campaign || null,
        utm_term: this.#utmData.utm_term || null,
        utm_content: this.#utmData.utm_content || null,
        gclid: this.#utmData.gclid || null,
        fbclid: this.#utmData.fbclid || null
      };
    }

    return event;
  }

  /**
   * Send a single event immediately
   * @private
   * @param {Object} event - Event to send
   */
  async #sendEvent(event) {
    try {
      await this.#sendSingleEvent(event);
    } catch (error) {
      // Just log the error
      console.error(`Failed to send event '${event.event_type}':`, error.message);
    }
  }

  /**
   * Send a single event to the server
   * @private
   * @param {Object} event - Event to send
   * @returns {Promise} Promise resolving to response
   */
  #sendSingleEvent(event) {
    return fetch(`${this.#config.apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      keepalive: true // Ensure request completes even if page unloads
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    });
  }

  /**
   * Send event using beacon API for reliability
   * @private
   * @param {Object} event - Event to send
   */
  #sendBeaconEvent(event) {
    const payload = JSON.stringify(event);

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const success = navigator.sendBeacon(`${this.#config.apiEndpoint}`, blob);

      // Fall back to regular sending if beacon fails
      if (!success) {
        this.#sendEvent(event);
      }
    } else {
      // Fallback if sendBeacon not available
      this.#sendEvent(event);
    }
  }

  /**
   * Generate a UUID (v4) string, using crypto if available, otherwise fallback.
   * @private
   * @returns {string} UUID string
   */
  #generateUUID() {
    if (window.crypto && window.crypto.randomUUID) {
      return `${window.crypto.randomUUID()}`;
    }
    // Fallback to manual UUID generation if randomUUID is unavailable
    const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
    return `${uuid}`;
  }

  /**
   * Generate a unique session ID using UUID
   * @private
   * @returns {string} Session ID
   */
  #generateSessionId() {
    return this.#generateUUID();
  }

  /**
   * Generate a unique event ID using UUID
   * @private
   * @returns {string} Event ID
   */
  #generateEventId() {
    return this.#generateUUID();
  }

  /**
   * Generate browser fingerprint for identification
   * @private
   * @returns {string} Browser fingerprint
   */
  #generateBrowserFingerprint() {
    return this.#generateOptimizedFingerprint();
  }

  /**
   * Generate optimized browser fingerprint with caching
   * @private
   * @returns {string} Cached or new fingerprint
   */
  #generateOptimizedFingerprint() {
    // Check for cached fingerprint
    const cached = sessionStorage.getItem('fingerprint');
    if (cached) return cached;

    // Generate fingerprint from browser characteristics
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown'
    ].join('|');

    // Hash the fingerprint
    const hash = 'fp_' + this.#simpleHash(fingerprint);

    // Cache in session storage
    try {
      sessionStorage.setItem('fingerprint', hash);
    } catch (e) {
      // Ignore if sessionStorage is not available
    }

    return hash;
  }

  /**
   * Simple hash function for strings
   * @private
   * @param {string} str - String to hash
   * @returns {string} Hash value
   */
  #simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Extract query parameters from URL
   * @private
   * @returns {Object|null} Query parameters object or null if none
   */
  #getQueryParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);

    for (const [key, value] of urlParams) {
      params[key] = value;
    }

    return Object.keys(params).length > 0 ? params : null;
  }

  /**
   * Schedule task to run when browser is idle
   * @private
   * @param {Function} callback - Task to run
   */
  #scheduleIdleTask(callback) {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(callback, { timeout: 1000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(callback, 0);
    }
  }

  /**
   * Determine whether this browser is on its first visit for the current product.
   *
   * Behavior:
   * - Checks a per‑tracker marker key `uv_{trackerId}` in localStorage.
   * - Falls back to a cookie with the same key when storage is unavailable.
   * - If no marker exists, writes it (best‑effort) and returns true.
   * - If a marker exists, returns false.
   *
   * Notes:
   * - Cookie fallback TTL is 1 year; only existence is relevant.
   * - Idempotent per page load: once it sets the marker, later calls return false.
   *
   * @private
   * @returns {boolean} true if this is the first detected visit; otherwise false.
   */
  #detectNewUser() {
    const storageKey = `uv_${this.#config.trackerId}`;

    // Helper cookie ops (fallback when storage is unavailable)
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    };
    const setCookie = (name, value, maxAgeSeconds) => {
      try {
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=Lax`;
      } catch (_) { /* ignore */ }
    };

    // 1) If any prior marker exists, not new
    try {
      if (localStorage.getItem(storageKey)) return false;
    } catch (_) {
      // If localStorage not available, check cookie fallback
      if (getCookie(storageKey)) return false;
    }

    // 2) Mark first visit now (both storage and cookie as best-effort)
    try {
      localStorage.setItem(storageKey, Date.now().toString());
    } catch (_) { /* ignore */ }
    // 1 years TTL cookie fallback
    setCookie(storageKey, '1', 60 * 60 * 24 * 365 * 1);

    return true;
  }

  #maybeTrackUV() {
    if (!this.#config.enabled) return;

    // Only send for brand-new users
    if (!this.#isNewUser) return;

    const uvSentKey = `uv_sent_${this.#config.trackerId}`;

    try {
      // Already sent before? bail
      if (localStorage.getItem(uvSentKey)) return;

      // Mark as sent to avoid duplicates across subsequent page loads
      localStorage.setItem(uvSentKey, '1');
    } catch (e) {
      // If storage fails, still attempt to send once in this session
      // (risk of duplicates across tabs is acceptable fallback)
      console.warn('UV storage marker not available:', e.message);
    }

    // Give geolocation a short window to resolve, then send UV
    const sendUV = () => this.trackUV();

    if (this.#geoData || !this.#config.geo) {
      // Geo already available or not requested
      this.#scheduleIdleTask(sendUV);
    } else {
      // Wait briefly for geo, then send regardless
      setTimeout(() => this.#scheduleIdleTask(sendUV), 800);
    }
  }

  // ==================== Public API Methods ====================

  /**
   * Track an UV (Unique Visitor) event
   */
  trackUV() {
    // Don't track if SDK is disabled
    if (!this.#config.enabled) return;

    this.#trackEvent('unique_visitor', {});
  }

  /**
   * Track a register event
   * @param {Object} registerData - Registration data
   * @param {string} [registerData.user_id] - User ID if registered successfully
   * @param {string} [registerData.identifier] - Hashed email or phone number
   */
  trackRegister(registerData = {}) {
    // Don't track if SDK is disabled
    if (!this.#config.enabled) return;

    // Set user ID if provided (internal operation)
    if (registerData.user_id) {
      this.#userId = registerData.user_id;
    }

    const registerEvent = {
      user_id: registerData.user_id || null,
      identifier: registerData.identifier || null
    };

    this.#trackEvent('register', registerEvent);
  }

  /**
   * Track a download click event
   * @param {Object} downloadData - Download data
   * @param {string} [downloadData.store_type] - Store type (e.g., 'App Store', 'Google Play')
   */
  trackDownloadClick(downloadData = {}) {
    // Don't track if SDK is disabled
    if (!this.#config.enabled) return;

    const downloadEvent = {
      store_type: downloadData.store_type || null
    };

    this.#trackEvent('download_click', downloadEvent);
  }

  /**
   * Track a login event
   * @param {Object} loginData - Login data
   * @param {string} loginData.user_id - Required: User ID
   */
  trackLogin(loginData) {
    // Don't track if SDK is disabled
    if (!this.#config.enabled) return;

    if (!loginData?.user_id) {
      console.error('WebTrackerSDK: user_id is required for login event');
      return;
    }

    // Set user ID (internal operation)
    this.#userId = loginData.user_id;

    const loginEvent = {
      user_id: loginData.user_id
    };

    this.#trackEvent('login', loginEvent);
  }

  /**
   * Track a deposit event
   * @param {Object} depositData - Deposit data
   * @param {string} depositData.currency - Required: Currency (e.g., 'USDT')
   * @param {string} depositData.network - Required: Network (e.g., 'TRON', 'ETH')
   * @param {number} depositData.amount - Required: Amount in currency units
   */
  trackDeposit(depositData) {
    // Don't track if SDK is disabled
    if (!this.#config.enabled) return;

    if (!depositData?.currency || !depositData?.network || !depositData?.amount) {
      console.error('WebTrackerSDK: currency, network, and amount are required for deposit event');
      return;
    }

    const depositEvent = {
      currency: depositData.currency,
      network: depositData.network,
      amount: depositData.amount
    };

    this.#trackEvent('deposit', depositEvent);
  }

  /**
   * Track an enter game event
   * @param {Object} gameData - Game data
   * @param {string} gameData.currency - Required: Currency (e.g., 'USDT')
   * @param {string} gameData.game_id - Required: Game ID
   * @param {string} gameData.game_provider - Required: Game provider
   */
  trackEnterGame(gameData) {
    // Don't track if SDK is disabled
    if (!this.#config.enabled) return;

    if (!gameData?.currency || !gameData?.game_id || !gameData?.game_provider) {
      console.error('WebTrackerSDK: currency, game_id, and game_provider are required for enter_game event');
      return;
    }

    const gameEvent = {
      currency: gameData.currency,
      game_id: gameData.game_id,
      game_provider: gameData.game_provider
    };

    this.#trackEvent('enter_game', gameEvent);
  }

  /**
   * Track a custom event
   * @param {string} eventType - Event type name
   * @param {Object} [customData={}] - Custom event data
   */
  trackCustomEvent(eventType, customData = {}) {
    // Don't track if SDK is disabled
    if (!this.#config.enabled) return;

    this.#trackEvent(eventType, customData);
  }

  /**
   * Get the SDK version
   * @returns {string} The SDK version
   */
  getVersion() {
    return WebTracker.VERSION;
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebTracker;
} else {
  window.WebTrackerSDK = WebTracker;
}