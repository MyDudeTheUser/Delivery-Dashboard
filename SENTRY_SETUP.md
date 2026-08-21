# Sentry Error Tracking & Monitoring

The Delivery Dashboard is integrated with Sentry for real-time error tracking, performance monitoring, and session replay in production.

## Features Enabled
*   **Error Tracking:** Automatically captures unhandled exceptions and promise rejections.
*   **Performance Monitoring:** Tracks frontend transaction times and API latency (`tracesSampleRate: 1.0`).
*   **Session Replay:** Captures video-like reproductions of user sessions leading up to errors (`replaysOnErrorSampleRate: 1.0`).
*   **Source Maps:** Automatically uploads source maps during the Vercel build process to de-minify stack traces.

## Required Configuration

To activate Sentry, you must configure the following environment variables.

### 1. Vercel Environment Variables (Frontend Client)
These variables must be added to your Vercel project settings so they are available to the browser.
1.  Go to your Vercel Project -> **Settings** -> **Environment Variables**.
2.  Add the following variable (ensure it is available in Production/Preview):
    *   `VITE_SENTRY_DSN`: Your Sentry project's Data Source Name (DSN). Find this in your Sentry Project Settings -> Client Keys (DSN).

### 2. GitHub Actions Secrets (Source Map Upload)
These variables must be added to your GitHub repository secrets so the CI/CD pipeline can securely upload source maps during the build step.
1.  Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2.  Add the following secrets:
    *   `SENTRY_ORG`: Your Sentry organization slug.
    *   `SENTRY_PROJECT`: Your Sentry project slug.
    *   `SENTRY_AUTH_TOKEN`: A Sentry Internal Integration Auth Token with `project:releases` and `org:read` permissions. Create this in Sentry -> Settings -> Developer Settings -> Internal Integrations.

Once these variables are configured, the next deployment will automatically upload source maps and begin tracking errors!

## Verifying the Integration
To verify that Sentry is correctly capturing errors in your production environment:
1. Ensure your Vercel deployment has finished and the environment variables are active.
2. Open the deployed Delivery Dashboard.
3. In the top right corner of the dashboard, click the **"Trigger Sentry Test Error"** button.
4. Open your Sentry project dashboard. You should see a new unresolved issue titled `Error: Sentry Test Error: This is a controlled test exception.` appear within a few seconds.
