# Aegis Core

## Description

The Aegis Core NPM package adds core passive tracking functionality to any framework website. It provides various tracking methods like mouse movement, keystroke dynamics, browser properties, device information, network details, and touch gestures. Additionally, it allows sending buffered tracking data to the backend.

## Installation

To install the package, run the following command:
[NPM package](https://www.npmjs.com/package/@algoholics/aegis-core)

```bash
npm i @algoholics/aegis-core
```

## Usage

To use the package, import the `createTrackerInstance` factory function and create a tracker instance by providing either an `apiKey` or an `engineURL`:

```javascript
import { createTrackerInstance } from '@algoholics/aegis-core';

const tracker = createTrackerInstance({ apiKey: 'your-api-key' });
// or
const tracker = createTrackerInstance({ engineURL: 'https://your-engine-url.com' });
```

### TrackerInstance Methods

1. **trackMouseMovement**: Tracks and buffers mouse movements, including speed and distance.

   ```javascript
   tracker.trackMouseMovement();
   ```
2. **trackKeystrokeDynamics**: Tracks keystroke dynamics (key press duration and count).

   ```javascript
   tracker.trackKeystrokeDynamics();
   ```
3. **getBrowserProperties**: Retrieves and buffers browser properties, such as user agent, window size, and timezone.

   ```javascript
   tracker.getBrowserProperties();
   ```
4. **getDeviceInfo**: Retrieves and buffers device information like screen dimensions and whether the device is mobile.

   ```javascript
   tracker.getDeviceInfo();
   ```
5. **getNetworkDetails**: Retrieves and buffers network details such as connection type, round-trip time (RTT), and downlink speed.

   ```javascript
   tracker.getNetworkDetails();
   ```
6. **trackTouchGestures**: Tracks touch gestures on mobile devices, including touch start, move, and end events.

   ```javascript
   tracker.trackTouchGestures();
   ```
7. **sendToBackend**: Sends the buffered data to the backend server specified by either the `apiKey` or `engineURL`. Data is automatically cleared from local storage after sending.

   ```javascript
   const response = await tracker.sendToBackend();
   ```

### Example

```javascript
import { createTrackerInstance } from '@algoholics/aegis-core';

const tracker = createTrackerInstance({ apiKey: 'your-api-key' });

tracker.trackMouseMovement();
tracker.trackKeystrokeDynamics();
tracker.getBrowserProperties();
tracker.getDeviceInfo();
tracker.getNetworkDetails();
tracker.trackTouchGestures();

// Send data to the backend when ready
const response = await tracker.sendToBackend();
console.log(response);
```

### API Details

- **`apiKey`**: Used to authenticate the tracking instance with a backend.
- **`engineURL`**:  Infer URL to the self hosted python engine using [Aegis-Engine](https://github.com/killerz3/aegis-engine)
- **`addToBuffer(data)`**: Adds tracking data to the buffer and saves it in localStorage.
- **`saveToStorage()`**: Persists the buffered data into localStorage.
- **`sendToBackend()`**: Sends all buffered data to the backend and clears the local storage after a successful response.
