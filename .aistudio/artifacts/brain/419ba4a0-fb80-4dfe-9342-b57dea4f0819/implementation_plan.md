# Al Hidayah Audio — Android APK Packaging & Offline Audio Implementation Plan

## Executive Summary
This plan details the end-to-end technical approach to:
1. **Permanently resolve the GitHub Pages deployment failure** (404 on `manifest.json`, `icon.svg`, and the blank white screen).
2. **Package the application into a native Android app using Capacitor**, configuring all native Android permissions, filesystem access, and build scripts.
3. **Implement a robust offline audio architecture**: genuine local file storage (Capacitor Filesystem for native Android, IndexedDB binary Blob storage for Web/PWA), offline metadata persistence, and strict playback rules.
4. **Harden application stability**: add a React `ErrorBoundary`, network connectivity listener, offline user notifications in Bengali, and ensure zero white-screen failure modes.

---

## Phase 1: GitHub Pages Blank Screen & 404 Diagnostics

### Root Cause Analysis
1. **GitHub Pages URL Structure & Relative Path Traversal**:
   - When users visit `https://shorioutsadi-commits.github.io/alhidayah_audio` (without a trailing slash), browsers evaluate relative links (such as `./assets/...`, `./manifest.json`, `./icon.svg`) relative to `https://shorioutsadi-commits.github.io/`, causing 404 errors for the JS/CSS bundles and manifest.
   - When the primary JavaScript bundle fails to load due to 404, the browser cannot execute `main.tsx`, leaving the page completely blank.
2. **Jekyll Processing**:
   - GitHub Pages runs Jekyll static site generator by default unless a `.nojekyll` file is present in the build root. Without `.nojekyll`, files or folders with underscores or certain extensions can be skipped or served with incorrect MIME types.
3. **Absence of React Error Boundary**:
   - If an unhandled promise rejection or rendering error occurs, React 19 unmounts the `#root` component tree, resulting in an unrecoverable white screen.

### Remediation Steps
- **Trailing-slash URL Normalization in `index.html`**:
  Add an inline script in `<head>` that immediately redirects `/alhidayah_audio` to `/alhidayah_audio/`, ensuring relative asset paths always resolve correctly under the project subpath.
- **Vite Configuration for Multi-Target Builds**:
  Support `base: process.env.VITE_BASE_PATH || './'`, allowing GitHub Pages builds to specify base path while retaining relative paths for Capacitor Android webview.
- **`.nojekyll` File Creation**:
  Add `public/.nojekyll` so Vite copies it directly to `dist/`, instructing GitHub Pages to serve all static assets raw.
- **Workflow Build Verification**:
  Add validation in `.github/workflows/deploy.yml` that checks for `dist/index.html`, `dist/manifest.json`, `dist/icon.svg`, and `dist/.nojekyll` before uploading the Pages artifact.

---

## Phase 2: Capacitor Android Setup & Native APK Toolchain

### Architectural Design
Capacitor wraps the web application in an Android WebView (`com.alhidayah.audio`) with zero latency, offline file access, and native hardware integration.

### Packages & Dependencies
- `@capacitor/core`: Core Capacitor runtime.
- `@capacitor/cli`: Build and management CLI.
- `@capacitor/android`: Native Android platform bridge and Gradle project structure.
- `@capacitor/filesystem`: High-performance native Android file read/write/delete in app-specific persistent storage.
- `@capacitor/network`: Real-time network status monitoring.
- `@capacitor/preferences`: Native persistent key-value store.

### Android Project Configuration
1. Initialize Capacitor config (`capacitor.config.ts`) with app ID `com.alhidayah.audio` and app name `Al Hidayah Audio`.
2. Generate native Android project via `npx cap add android`.
3. Configure `AndroidManifest.xml` with:
   - `android.permission.INTERNET`
   - `android.permission.ACCESS_NETWORK_STATE`
   - `android.permission.READ_EXTERNAL_STORAGE` / `android.permission.WRITE_EXTERNAL_STORAGE` (maxSdkVersion 32)
   - `android.permission.FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_MEDIA_PLAYBACK` for continuous audio.
4. Environment Assessment:
   - Check if `gradle` / `javac` / Android SDK exist in the current Linux container.
   - If available: build debug APK (`./gradlew assembleDebug`).
   - If Android SDK is not pre-installed in this container: prepare the full native project and provide the exact commands to build the APK via Android Studio or GitHub Actions.

---

## Phase 3: Genuine Local Audio Download & Storage Engine

### Storage Implementation
Create a unified storage abstraction `src/services/offlineStorage.ts` that automatically detects platform capabilities:
1. **On Android (Capacitor Native)**:
   - Uses `Filesystem.writeFile` with base64 chunks or `Filesystem.downloadFile` to store `.mp3` files in `Directory.Data` (persistent, app-private storage that survives reboots and app updates).
   - Generates webview-compatible playable URLs using `Capacitor.convertFileSrc(filePath)`.
2. **On Web / PWA (Browser)**:
   - Uses IndexedDB with `IDBDatabase` to store binary `Blob` objects.
   - Converts blobs to active `URL.createObjectURL(blob)` for playback.
3. **Metadata Storage**:
   - Persists audio ID, title, speaker name, duration, category, local file path, and download timestamp in `al_hidayah_downloads_meta`.
   - Never considers an audio file downloaded unless the file bytes have been fully verified and saved.
   - Supports safe file deletion: removes the physical file/blob from storage and removes metadata, without altering the online catalog entry.

---

## Phase 4: Audio Playback & Connectivity Engine

### Playback Rules
- **Rule 1 (Downloaded File)**:
  Always play local copy directly (via converted native file URI or IndexedDB object URL), whether online or offline.
- **Rule 2 (Not Downloaded & Online)**:
  Stream directly from remote URL.
- **Rule 3 (Not Downloaded & Offline)**:
  Do not crash or stall. Display a clear Bengali notification toast:
  `"এই অডিওটি শোনার জন্য ইন্টারনেট সংযোগ প্রয়োজন অথবা পূর্বে ডাউনলোড করে রাখুন"`
  Keep player in safe state.
- **Rule 4 (Network Stall / Playback Error)**:
  Catch errors safely, notify user, reset loading indicator, and prevent UI unmounting.

---

## Phase 5: Testing & Verification Matrix

1. **Production Build & Dist Verification**:
   - Verify `dist/index.html`, `dist/manifest.json`, `dist/icon.svg`, `dist/.nojekyll`, and `dist/assets/`.
2. **Offline Mode Simulation**:
   - Test application behavior when `navigator.onLine` is false or network disconnects.
3. **Download & Playback Verification**:
   - Download audio, check IndexedDB / local file storage, test offline playback.
4. **Error Boundary Test**:
   - Verify that unexpected component errors display the recovery UI instead of a white screen.
