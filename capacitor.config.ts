import type { CapacitorConfig } from "@capacitor/cli";

// Polyglot Explorer ships as a server-rendered Next.js app (auth, server
// actions, API routes), so the Capacitor shell points at the deployed
// Vercel URL rather than bundling a static export — the native app is a
// thin native wrapper around the same live web app.
//
// After you `npx cap add ios` / `npx cap add android` locally (requires
// Xcode / Android Studio, not available in this build environment), run
// `npx cap sync` whenever this config or the deployed URL changes.
const config: CapacitorConfig = {
  appId: "com.polyglotexplorer.app",
  appName: "Polyglot Explorer",
  webDir: "public",
  server: {
    url: "https://polyglot-explorer.vercel.app",
    cleartext: false,
  },
  ios: {
    contentInset: "always",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
