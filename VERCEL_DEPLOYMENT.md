# Vercel Deployment Configuration

The Delivery Dashboard repository is configured for automated deployments to Vercel via GitHub Actions.

## How it Works
*   **Staging:** Any push or merge to the `main` branch automatically triggers a deployment to the Vercel Preview (Staging) environment.
*   **Production:** Creating a new **GitHub Release** automatically triggers a deployment to the Vercel Production environment.

## Required Secrets Setup

To enable this automated deployment pipeline, you must configure the following secrets in your GitHub repository.

### 1. Generate Vercel Credentials
1.  **Vercel Token (`VERCEL_TOKEN`):**
    *   Go to your Vercel account settings: https://vercel.com/account/tokens
    *   Create a new token and copy its value.
2.  **Organization ID (`VERCEL_ORG_ID`):**
    *   Go to your Vercel team/account settings.
    *   Find the Organization ID (usually under Settings -> General).
3.  **Project ID (`VERCEL_PROJECT_ID`):**
    *   You must first link your local repository to Vercel.
    *   Run `npx vercel link` in your local terminal.
    *   Follow the prompts to link the project.
    *   Open the newly generated `.vercel/project.json` file.
    *   Copy the `projectId` value.

### 2. Add Secrets to GitHub
1.  Navigate to your GitHub repository: `https://github.com/MyDudeTheUser/Delivery-Dashboard`
2.  Go to **Settings** -> **Secrets and variables** -> **Actions**.
3.  Click **New repository secret**.
4.  Add the following three secrets with the values you gathered above:
    *   `VERCEL_TOKEN`
    *   `VERCEL_ORG_ID`
    *   `VERCEL_PROJECT_ID`

Once these secrets are saved, your GitHub Actions workflow will successfully authenticate and deploy to Vercel!
