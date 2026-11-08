# RadioTrack Pro Android APK build

This branch builds an Android debug APK using GitHub Actions. The existing desktop deployment and Firebase data are not modified by this workflow.

## Build
1. Open the repository's Actions tab.
2. Select **Build RadioTrack Pro Android APK**.
3. Run workflow on branch `capacitor-android-apk`.
4. Download the artifact **RadioTrack-Pro-Android-APK** when the run completes.
5. Extract the ZIP and install `app-debug.apk` on an Android phone.

The APK connects to the existing Vercel API at `https://dingithubio.vercel.app` for username-based Admin/Viewer login and account management. Firebase Authentication and Firestore continue to use the existing project.

This is a debug/test APK, not a Play Store release. A signed release AAB/APK and final mobile acceptance tests are required before Play Store publication.
