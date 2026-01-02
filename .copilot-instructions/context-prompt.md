## Project Context: Whisper-based Speech-to-Text Utility — UI

### 1. Project Overview
This UI project is a React/TypeScript desktop interface for controlling and visualizing the Whisper-based speech-to-text utility. It allows users to initiate audio recording, view transcription progress, and display results. The UI communicates with a Python backend via HTTP or WebSocket.

#### MVP Core Workflow
1. **Trigger:** User clicks a button or uses a UI hotkey to start/stop recording.
2. **Record:** UI shows a spinner or progress indicator while audio is being captured.
3. **Process:** UI displays real-time or post-process transcription status.
4. **Output:** Transcribed text is shown in the UI and optionally copied to clipboard.

---

### 2. Technical Stack
* **Language:** TypeScript, JavaScript
* **Framework:** React
* **Package Manager:** npm
* **IDE:** WebStorm
* **UI Components:** Custom or third-party (e.g., Material UI, Chakra UI)
* **Communication:** REST API or WebSocket to Python backend
* **OS Target:** macOS (Development), Windows/Linux (Deployment)

---

### 3. Implementation Details & Constraints
#### Audio Handling
* Audio recording is managed by the backend; UI only triggers start/stop and shows status.
* UI should handle backend errors gracefully (e.g., permission issues, backend offline).

#### Hotkey Management
* UI may support local hotkeys (e.g., `Cmd+Shift+R`) for triggering actions, but global hotkeys are managed by the backend.
* Use libraries like `react-hotkeys` for local hotkey support.

#### Transcription Status
* UI should show clear feedback: recording, processing, completed, error.
* Use spinners, progress bars, and status messages.

#### Text Output
* Display transcribed text in a readable format.
* Provide a "Copy to Clipboard" button for user convenience.
* Optionally, show a history of recent transcriptions.

---

### 4. UX Considerations
* Responsive design for cross-platform compatibility.
* Accessibility: Ensure keyboard navigation and screen reader support.
* Error handling: Show user-friendly messages for backend or permission issues.

---

### 5. Integration
* All UI actions (record, stop, fetch transcription) should call backend endpoints.
* Use environment variables or config files for backend URL.
* Handle CORS and authentication if required.

---

### 6. Testing
* Unit tests for UI components (Jest, React Testing Library).
* Mock backend responses for integration tests.
* Manual testing for hotkey and clipboard features.

---

### 7. Deployment
* Build with `npm run build`.
* Package as a desktop app (optional: Electron, Tauri) for cross-platform distribution.
* Ensure backend and UI can be started independently for development.

