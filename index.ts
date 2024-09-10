class TrackerInstance {
  apiKey: string | null;
  engineURL: string | null;
  buffer: any[];

  constructor(apiKey?: string, engineURL?: string) {
    if ((apiKey && engineURL) || (!apiKey && !engineURL)) {
      throw new Error("Either apiKey or engineURL must be provided, but not both.");
    }

    this.apiKey = apiKey || null;
    this.engineURL = engineURL || null;

    this.buffer = []; // Buffer all the data
    console.log(`Tracker initialized with ${this.apiKey ? `API Key: ${this.apiKey}` : `Engine URL: ${this.engineURL}`}`);
  }

  // Save data to localStorage/sessionStorage
  saveToStorage() {
    localStorage.setItem("userTrackingData", JSON.stringify(this.buffer));
  }

  // Add data to buffer and persist it
  addToBuffer(data: any) {
    this.buffer.push(data);
    this.saveToStorage(); // Persist the data in localStorage
  }

  // Track Mouse Movement
  trackMouseMovement() {
    let lastTimestamp: number | null = null;
    let lastPosition = { x: 0, y: 0 };

    document.addEventListener("mousemove", (e) => {
      const now = Date.now();
      const x = e.clientX;
      const y = e.clientY;

      if (lastPosition.x !== null) {
        const dx = x - lastPosition.x;
        const dy = y - lastPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeDiff = lastTimestamp ? now - lastTimestamp : 0;
        const speed = timeDiff > 0 ? distance / timeDiff : 0;

        const data = {
          event: "mousemove",
          x,
          y,
          speed,
          timeDiff,
          distance,
          timestamp: now,
        };

        this.addToBuffer(data); // Add data to buffer
      }

      lastTimestamp = now;
      lastPosition = { x, y };
    });

    console.log("Mouse movement tracking started");
  }

  // Track Keystroke Dynamics
  trackKeystrokeDynamics() {
    let keyTimings: { [key: string]: { startTime: number; count: number } } = {};

    document.addEventListener("keydown", (e) => {
      if (!keyTimings[e.key]) {
        keyTimings[e.key] = {
          startTime: Date.now(),
          count: 0,
        };
      }
    });

    document.addEventListener("keyup", (e) => {
      const timing = keyTimings[e.key];
      if (timing) {
        const pressDuration = Date.now() - timing.startTime;
        timing.count += 1;
        const data = {
          event: "keystroke",
          key: e.key,
          pressDuration,
          count: timing.count,
          timestamp: Date.now(),
        };
        this.addToBuffer(data); // Add data to buffer
        delete keyTimings[e.key];
      }
    });
  }

  // Track Browser Properties
  getBrowserProperties() {
    const userAgent = navigator.userAgent;
    const windowSize = { width: window.innerWidth, height: window.innerHeight };
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const data = {
      event: "browserProperties",
      userAgent,
      windowSize,
      timezone,
      apiKey: this.apiKey,
      timestamp: Date.now(),
    };

    this.addToBuffer(data); // Add data to buffer
  }

  // Track Device Information
  getDeviceInfo() {
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const data = {
      event: "deviceInfo",
      screenWidth,
      screenHeight,
      isMobile,
      apiKey: this.apiKey,
      timestamp: Date.now(),
    };

    this.addToBuffer(data); // Add data to buffer
  }

  // Track Network Details
  getNetworkDetails() {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;
  
    if (connection) {
      const { effectiveType, rtt, downlink } = connection;
  
      const data = {
        event: "networkDetails",
        effectiveType,
        rtt,
        downlink,
        apiKey: this.apiKey,
        timestamp: Date.now(),
      };
  
      this.addToBuffer(data); // Add data to buffer
    }
  }
  

  // Track Touch Gestures (for Mobile)
  trackTouchGestures() {
    document.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      const data = {
        event: "touchstart",
        x: touch.clientX,
        y: touch.clientY,
        apiKey: this.apiKey,
        timestamp: Date.now(),
      };

      this.addToBuffer(data); // Add data to buffer
    });

    document.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      const data = {
        event: "touchmove",
        x: touch.clientX,
        y: touch.clientY,
        apiKey: this.apiKey,
        timestamp: Date.now(),
      };

      this.addToBuffer(data); // Add data to buffer
    });

    document.addEventListener("touchend", () => {
      const data = {
        event: "touchend",
        apiKey: this.apiKey,
        timestamp: Date.now(),
      };

      this.addToBuffer(data); // Add data to buffer
    });
  }

  // Send the buffer data to backend
  async sendToBackend() {
      let reply ={}
      const storedData = localStorage.getItem("userTrackingData");
    console.log("Stored data:", storedData);
  
    let url = "http://localhost:3000/api/infer?apiKey=" + this.apiKey;

    if (this.engineURL) {
      url = this.engineURL;
    }

    if (storedData) {
      await fetch(url, {
        method: "POST",
        body: storedData,
      })
        .then((response) => {
          console.log(response)
          return response.json();
        }
      )  // Remove duplicate
        .then((data) => {
          reply = data;
          console.log("Data successfully sent:", data);
          localStorage.removeItem("userTrackingData");
        })
    }
    console.log("Reply:", reply); 
    return reply;
  }
}

// Factory function to create a tracker instance
function createTrackerInstance({ apiKey, engineURL }: { apiKey?: string; engineURL?: string }) {
  return new TrackerInstance(apiKey, engineURL);
}

export { createTrackerInstance };
