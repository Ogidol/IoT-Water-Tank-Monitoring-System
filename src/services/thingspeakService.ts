// ThingSpeak API Service for ESP8266 Water Level Sensor Data
// Channel ID: 3035826 | Read API Key: MUY6DYREULF05D4

export interface ThingSpeakEntry {
  created_at: string;
  entry_id: number;
  field1: string | null; // Water level percentage
  field2: string | null; // Optional: Temperature
  field3: string | null; // Optional: Distance in cm
  field4: string | null; // Optional: Tank capacity
  field5: string | null; // Optional: Pump status
  field6: string | null; // Optional: Battery level
  field7: string | null; // Optional: WiFi signal strength
  field8: string | null; // Optional: Additional sensor data
}

export interface ThingSpeakChannel {
  id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  field1: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  field7?: string;
  field8?: string;
  created_at: string;
  updated_at: string;
  last_entry_id: number;
}

export interface ThingSpeakResponse {
  channel: ThingSpeakChannel;
  feeds: ThingSpeakEntry[];
}

export interface WaterLevelData {
  waterLevel: number;
  temperature?: number;
  distance?: number;
  tankCapacity: number;
  pumpStatus: "ON" | "OFF";
  batteryLevel?: number;
  wifiSignal?: number;
  timestamp: string;
  lastUpdate: string;
}

export interface HistoricalData {
  time: string;
  level: number;
  temperature?: number;
}

class ThingSpeakService {
  private readonly channelId = "3035826";
  private readonly readApiKey = "MUY6DYREULF05D4F"; // Read API Key
  private readonly baseUrl = "https://api.thingspeak.com";

  // Cache for reducing API calls
  private cache: {
    data: WaterLevelData | null;
    timestamp: number;
    historicalData: HistoricalData[];
    historyTimestamp: number;
  } = {
    data: null,
    timestamp: 0,
    historicalData: [],
    historyTimestamp: 0,
  };

  private readonly cacheTimeout = 30000; // 30 seconds cache
  private readonly historyCacheTimeout = 300000; // 5 minutes cache for historical data

  /**
   * Create JSONP request to bypass CORS issues
   */
  private async makeJsonpRequest(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const callbackName = `thingspeak_callback_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const script = document.createElement("script");

      // Set up callback
      (window as any)[callbackName] = (data: any) => {
        document.head.removeChild(script);
        delete (window as any)[callbackName];
        resolve(data);
      };

      // Handle errors
      script.onerror = () => {
        document.head.removeChild(script);
        delete (window as any)[callbackName];
        reject(new Error("JSONP request failed"));
      };

      // Create JSONP URL
      const separator = url.includes("?") ? "&" : "?";
      script.src = `${url}${separator}callback=${callbackName}`;

      // Add script to head
      document.head.appendChild(script);

      // Timeout after 10 seconds
      setTimeout(() => {
        if ((window as any)[callbackName]) {
          document.head.removeChild(script);
          delete (window as any)[callbackName];
          reject(new Error("JSONP request timeout"));
        }
      }, 10000);
    });
  }

  /**
   * Fallback to regular fetch with proper error handling
   */
  private async makeFetchRequest(url: string): Promise<any> {
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("Fetch request failed:", error);
      throw error;
    }
  }

  /**
   * Make API request with fallback methods
   */
  private async makeRequest(url: string): Promise<any> {
    try {
      // Try JSONP first (ThingSpeak supports JSONP)
      return await this.makeJsonpRequest(url);
    } catch (jsonpError) {
      console.warn("JSONP failed, trying fetch:", jsonpError);

      try {
        // Fallback to regular fetch
        return await this.makeFetchRequest(url);
      } catch (fetchError) {
        console.warn("Fetch failed, trying with proxy URL:", fetchError);

        // Last resort: try with a CORS proxy (for development)
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
          url
        )}`;
        return await this.makeFetchRequest(proxyUrl);
      }
    }
  }

  /**
   * Fetch the latest water level data from ThingSpeak
   */
  async getCurrentWaterLevel(): Promise<WaterLevelData> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.cache.data && now - this.cache.timestamp < this.cacheTimeout) {
        return this.cache.data;
      }

      // Build URL with proper parameters
      const params = new URLSearchParams({
        api_key: this.readApiKey,
        results: "1",
      });

      const url = `${this.baseUrl}/channels/${
        this.channelId
      }/feeds.json?${params.toString()}`;

      console.log("Fetching current data from ThingSpeak:", url);

      const data = await this.makeRequest(url);

      if (!data || !data.feeds || data.feeds.length === 0) {
        console.warn("No feeds data received from ThingSpeak");
        return this.getFallbackData();
      }

      const latestEntry = data.feeds[0];
      const processedData = this.processThingSpeakData(
        latestEntry,
        data.channel
      );

      // Update cache
      this.cache.data = processedData;
      this.cache.timestamp = now;

      console.log(
        "Successfully fetched current water level data:",
        processedData
      );
      return processedData;
    } catch (error) {
      console.error("Error fetching ThingSpeak data:", error);
      return this.getFallbackData();
    }
  }

  /**
   * Fetch historical data for charts (last 24 hours)
   */
  async getHistoricalData(hours: number = 24): Promise<HistoricalData[]> {
    try {
      // Check cache for historical data
      const now = Date.now();
      if (
        this.cache.historicalData.length > 0 &&
        now - this.cache.historyTimestamp < this.historyCacheTimeout
      ) {
        return this.cache.historicalData;
      }

      const results = Math.min(hours * 6, 8000); // Max 6 readings per hour, ThingSpeak limit 8000

      // Build URL with proper parameters
      const params = new URLSearchParams({
        api_key: this.readApiKey,
        results: results.toString(),
      });

      const url = `${this.baseUrl}/channels/${
        this.channelId
      }/feeds.json?${params.toString()}`;

      console.log("Fetching historical data from ThingSpeak:", url);

      const data = await this.makeRequest(url);

      if (!data || !data.feeds || data.feeds.length === 0) {
        console.warn("No historical feeds data received from ThingSpeak");
        return this.generateFallbackHistoricalData();
      }

      const historicalData = data.feeds
        .filter(
          (entry: ThingSpeakEntry) =>
            entry.field1 && !isNaN(parseFloat(entry.field1))
        )
        .map((entry: ThingSpeakEntry) => ({
          time: this.formatTimeForChart(entry.created_at),
          level: Math.round(parseFloat(entry.field1 || "0")),
          temperature: entry.field2 ? parseFloat(entry.field2) : undefined,
        }))
        .reverse(); // ThingSpeak returns newest first, we want oldest first for charts

      // Sample data if we have too many points (keep every nth point for performance)
      const sampledData = this.sampleData(historicalData, 24); // 24 points max for chart

      this.cache.historicalData = sampledData;
      this.cache.historyTimestamp = now;

      console.log(
        `Successfully fetched ${sampledData.length} historical data points`
      );
      return sampledData;
    } catch (error) {
      console.error("Error fetching historical data:", error);
      return this.generateFallbackHistoricalData();
    }
  }

  /**
   * Get channel information and field descriptions
   */
  async getChannelInfo() {
    try {
      const url = `${this.baseUrl}/channels/${this.channelId}.json`;
      const data = await this.makeRequest(url);
      return data;
    } catch (error) {
      console.error("Error fetching channel info:", error);
      return null;
    }
  }

  /**
   * Process raw ThingSpeak data into our application format
   */
  private processThingSpeakData(
    entry: ThingSpeakEntry,
    channel?: ThingSpeakChannel
  ): WaterLevelData {
    const waterLevel = entry.field1 ? Math.round(parseFloat(entry.field1)) : 0;
    const temperature = entry.field2 ? parseFloat(entry.field2) : undefined;
    const distance = entry.field3 ? parseFloat(entry.field3) : undefined;
    const tankCapacity = entry.field4 ? parseFloat(entry.field4) : 1000;
    const pumpStatus = entry.field5
      ? ((entry.field5.toLowerCase() === "on" ? "ON" : "OFF") as "ON" | "OFF")
      : "OFF";
    const batteryLevel = entry.field6 ? parseFloat(entry.field6) : undefined;
    const wifiSignal = entry.field7 ? parseFloat(entry.field7) : undefined;

    // Calculate how long ago the last update was
    const lastUpdateTime = new Date(entry.created_at);
    const now = new Date();
    const diffMs = now.getTime() - lastUpdateTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    let lastUpdate = "";
    if (diffMins < 1) {
      lastUpdate = "Just now";
    } else if (diffMins < 60) {
      lastUpdate = `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        lastUpdate = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        lastUpdate = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
      }
    }

    return {
      waterLevel: Math.max(0, Math.min(100, waterLevel)), // Ensure 0-100 range
      temperature,
      distance,
      tankCapacity,
      pumpStatus,
      batteryLevel,
      wifiSignal,
      timestamp: entry.created_at,
      lastUpdate,
    };
  }

  /**
   * Get fallback data when API fails
   */
  private getFallbackData(): WaterLevelData {
    return {
      waterLevel: 0,
      tankCapacity: 1000,
      pumpStatus: "OFF",
      timestamp: new Date().toISOString(),
      lastUpdate: "Connection Error",
    };
  }

  /**
   * Format timestamp for chart display
   */
  private formatTimeForChart(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  /**
   * Sample data to reduce chart complexity while maintaining trend visibility
   */
  private sampleData(
    data: HistoricalData[],
    maxPoints: number
  ): HistoricalData[] {
    if (data.length <= maxPoints) {
      return data;
    }

    const step = Math.floor(data.length / maxPoints);
    const sampled: HistoricalData[] = [];

    for (let i = 0; i < data.length; i += step) {
      sampled.push(data[i]);
    }

    // Always include the last data point
    if (sampled[sampled.length - 1] !== data[data.length - 1]) {
      sampled.push(data[data.length - 1]);
    }

    return sampled;
  }

  /**
   * Generate fallback historical data when API fails
   */
  private generateFallbackHistoricalData(): HistoricalData[] {
    const data: HistoricalData[] = [];
    const now = new Date();

    // Generate some sample data points for the last 24 hours
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        level: Math.floor(Math.random() * 30) + 45, // Random level between 45-75%
      });
    }

    return data;
  }

  /**
   * Clear cache to force fresh data fetch
   */
  clearCache(): void {
    this.cache.data = null;
    this.cache.timestamp = 0;
    this.cache.historicalData = [];
    this.cache.historyTimestamp = 0;
    console.log("ThingSpeak service cache cleared");
  }

  /**
   * Check if the service is working correctly
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/channels/${this.channelId}.json`;
      await this.makeRequest(url);
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }

  /**
   * Get system status information
   */
  getSystemStatus(): {
    isOnline: boolean;
    lastUpdate: string;
    cacheStatus: "fresh" | "stale" | "empty";
  } {
    const now = Date.now();
    const hasData = this.cache.data !== null;
    const isDataFresh =
      hasData && now - this.cache.timestamp < this.cacheTimeout;

    return {
      isOnline: hasData && isDataFresh,
      lastUpdate: this.cache.data?.lastUpdate || "Never",
      cacheStatus: !hasData ? "empty" : isDataFresh ? "fresh" : "stale",
    };
  }

  /**
   * Generate demo data for testing when API is unavailable
   */
  generateDemoData(): WaterLevelData {
    // Generate realistic demo data
    const waterLevel = Math.floor(Math.random() * 40) + 40; // 40-80%
    const temperature = Math.floor(Math.random() * 15) + 20; // 20-35°C
    const distance = Math.floor(Math.random() * 50) + 10; // 10-60cm

    return {
      waterLevel,
      temperature,
      distance,
      tankCapacity: 1000,
      pumpStatus: waterLevel < 50 ? "ON" : "OFF",
      batteryLevel: Math.floor(Math.random() * 30) + 70, // 70-100%
      wifiSignal: Math.floor(Math.random() * 30) + 70, // 70-100%
      timestamp: new Date().toISOString(),
      lastUpdate: "Demo Mode",
    };
  }
}

// Export singleton instance
export const thingSpeakService = new ThingSpeakService();
export default thingSpeakService;
