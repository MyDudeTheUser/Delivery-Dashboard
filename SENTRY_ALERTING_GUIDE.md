# Sentry Alerting & Notification Guide

This guide outlines how to configure custom alerting rules and notification channels in Sentry for the Delivery Dashboard to ensure your team is immediately notified of critical production errors.

## 1. Defining Alert Rules

Alert rules determine _when_ a notification should be sent based on specific error criteria.

1. Log in to your Sentry dashboard and navigate to **Alerts** in the left sidebar.
2. Click **Create Alert**.
3. Select **Errors** as the alert type.
4. **Set Conditions (When):**
   - **Trigger:** An event is captured.
   - **Filter:** `environment: production` AND `level: error` OR `level: fatal`.
   - **Frequency:** "The issue is seen more than 10 times in 1 hour" (This prevents alert fatigue from isolated, one-off glitches).
5. **Set Actions (Then):**
   - Select your preferred notification channel (see Section 2).

## 2. Configuring Notification Channels

Sentry integrates with various communication tools. Here is how to set up the most common ones for critical production alerts:

### Slack Integration

1. In Sentry, go to **Settings** -> **Integrations** -> **Slack**.
2. Click **Add Workspace** and follow the OAuth flow to authorize Sentry in your Slack workspace.
3. Once authorized, go back to your Alert Rule (from Section 1).
4. Under **Actions**, select **Send a Slack notification**.
5. Choose the workspace and specify the channel (e.g., `#alerts-production`).
6. _(Optional)_ Add tags like `environment` and `release` to the Slack message for better context.

### Email Notifications

1. By default, Sentry sends emails to project members.
2. In your Alert Rule, under **Actions**, select **Send an email**.
3. You can choose to send it to **Issue Owners** (if you have ownership rules configured based on file paths) or specific team members.

### PagerDuty (For Critical Incidents)

1. In Sentry, go to **Settings** -> **Integrations** -> **PagerDuty**.
2. Click **Add Installation** and follow the authorization flow.
3. In your Alert Rule, under **Actions**, select **Send a PagerDuty notification**.
4. Select the appropriate PagerDuty service (e.g., "Frontend On-Call").

## 3. Best Practices for Alerting

- **Avoid Alert Fatigue:** Do not alert on every single warning or handled exception. Only alert on unhandled exceptions that degrade the user experience.
- **Use Issue Owners:** Configure Sentry's "Issue Owners" feature to automatically assign errors in specific files (e.g., `src/services/*`) to the backend team, and `src/components/*` to the frontend team.
- **Monitor Performance:** Consider creating a separate metric alert for Performance (e.g., "Alert if the p95 transaction duration of the dashboard load exceeds 3 seconds").
