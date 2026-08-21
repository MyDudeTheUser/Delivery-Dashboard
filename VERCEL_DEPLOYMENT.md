# Vercel Deployment Configuration

The Delivery Dashboard repository is configured for automated deployments to Vercel via GitHub Actions.

## How it Works

- **Staging:** Any push or merge to the `main` branch automatically triggers a deployment to the Vercel Preview (Staging) environment.
- **Production:** Creating a new **GitHub Release** automatically triggers a deployment to the Vercel Production environment.

## Required Secrets Setup

To enable this automated deployment pipeline, you must configure the following secrets in your GitHub repository.

### 1. Generate Vercel Credentials

1.  **Vercel Token (`VERCEL_TOKEN`):**
    - Go to your Vercel account settings: https://vercel.com/account/tokens
    - Create a new token and copy its value.
2.  **Organization ID (`VERCEL_ORG_ID`):**
    - Go to your Vercel team/account settings.
    - Find the Organization ID (usually under Settings -> General).
3.  **Project ID (`VERCEL_PROJECT_ID`):**
    - You must first link your local repository to Vercel.
    - Run `npx vercel link` in your local terminal.
    - Follow the prompts to link the project.
    - Open the newly generated `.vercel/project.json` file.
    - Copy the `projectId` value.

### 2. Add Secrets to GitHub

1.  Navigate to your GitHub repository: `https://github.com/MyDudeTheUser/Delivery-Dashboard`
2.  Go to **Settings** -> **Secrets and variables** -> **Actions**.
3.  Click **New repository secret**.
4.  Add the following three secrets with the values you gathered above:
    - `VERCEL_TOKEN`
    - `VERCEL_ORG_ID`
    - `VERCEL_PROJECT_ID`

Once these secrets are saved, your GitHub Actions workflow will successfully authenticate and deploy to Vercel!

## Custom Domain & SSL Configuration

By default, Vercel assigns a `.vercel.app` subdomain to your project. For a production application, you should configure a custom domain. Vercel automatically provisions and renews SSL certificates (via Let's Encrypt) for any custom domain added to your project.

### 1. Add the Domain in Vercel

1. Log in to your Vercel dashboard and navigate to your project.
2. Go to **Settings** -> **Domains**.
3. Enter your custom domain (e.g., `dashboard.yourcompany.com`) and click **Add**.
4. Vercel will provide you with DNS records (typically a `CNAME` or `A` record) that you need to configure with your domain registrar.

### 2. Configure DNS at Your Registrar

1. Log in to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare, Route53).
2. Navigate to the DNS management settings for your domain.
3. Add the record provided by Vercel:
   - **For a subdomain (e.g., `dashboard.yourcompany.com`):** Create a `CNAME` record pointing to `cname.vercel-dns.com`.
   - **For an apex domain (e.g., `yourcompany.com`):** Create an `A` record pointing to `76.76.21.21`.
4. Save the DNS settings.

### 3. Verify SSL and Propagation

- DNS propagation can take anywhere from a few minutes to 24 hours.
- Once Vercel detects the correct DNS configuration, it will automatically generate and attach an SSL certificate.
- The Domain status in the Vercel dashboard will change to a green checkmark, indicating the domain is active and secured.
