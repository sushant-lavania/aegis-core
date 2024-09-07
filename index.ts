class TrackerInstance {
  apiKey: string;
buffer: any[];
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    if (!apiKey) {
      throw new Error("API key is required to create an instance");
    }

    this.buffer = []; // This will buffer all the data
    console.log(`Tracker initialized with API Key: ${this.apiKey}`);
  }

  // Save data to localStorage/sessionStorage
  saveToStorage() {
    localStorage.setItem("userTrackingData", JSON.stringify(this.buffer));
  }

  // Add data to buffer and persist it
  addToBuffer(data:any) {
    this.buffer.push(data);
    this.saveToStorage(); // Persist the data in localStorage
  }

  // Track Mouse Movement
  trackMouseMovement() {
    let lastTimestamp: number | null = null;
    let lastPosition = { x: 0, y: 0 };

    // Registering the event listener properly
    document.addEventListener("mousemove", (e) => {
      console.log("Mouse moved:", e.clientX, e.clientY); // Confirm the event handler is firing

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

        this.addToBuffer(data); // Add the data to the buffer
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
        this.addToBuffer(data); // Add the data to the buffer
        delete keyTimings[e.key];
      }
    });
  }

  // Track other events similarly and buffer the data

  // Send the buffer data to backend
  sendToBackend() {
      const storedData = localStorage.getItem("userTrackingData");
      console.log("Stored data:", storedData);
    if (storedData) {
      fetch("https://your-backend-endpoint.com/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: storedData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data successfully sent:", data);
          // Clear localStorage once data is sent
          localStorage.removeItem("userTrackingData");
        })
        .catch((error) => {
          console.error("Error sending data:", error);
        });
    }
  }
}

// Factory function to create a tracker instance
function createTrackerInstance(apiKey:string) {
  return new TrackerInstance(apiKey);
}

export { createTrackerInstance };
