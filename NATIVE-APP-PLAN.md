# RadioTrack Pro — Native App Foundation

## Architecture
- Existing desktop web application remains available through Vercel.
- Firebase Authentication and Cloud Firestore remain the shared identity and data services.
- Capacitor app identifier: `com.bmc.radiotrackpro`.
- Android APK/AAB is the first build target from Windows.
- iOS project is prepared for a later Xcode/macOS build or a trusted cloud build service.

## Release safety
- This branch is isolated from the production branch.
- Do not merge into the production branch until login, role permissions, cloud reads/writes, account management, and mobile workflows pass acceptance tests.
- Do not cache Firebase tokens, credentials, or private user data in the service worker.
- Keep all Firestore writes routed through the existing Firebase security rules.

## Build prerequisites
- Node.js 20 or later and npm.
- Android Studio with Android SDK for Android builds.
- macOS with Xcode for local iOS builds. A cloud macOS build service may be evaluated later.

## Important implementation note
The current web app uses relative Vercel API paths for username login and account management. These must be routed securely to the existing Vercel backend when running inside the native WebView. Do not ship a native build until this routing, Firebase Auth behavior, and CORS/preflight handling have been verified.
