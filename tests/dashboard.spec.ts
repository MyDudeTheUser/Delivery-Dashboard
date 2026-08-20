import { test, expect } from '@playwright/test';

test.describe('Delivery Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
  });

  test('should load the dashboard and display all widgets', async ({ page }) => {
    // Verify the main header is present
    await expect(page.getByRole('heading', { name: 'Delivery Dashboard', exact: true })).toBeVisible();

    // Verify all widget headers are present
    await expect(page.getByText('System Health')).toBeVisible();
    await expect(page.getByText('Alerts & Events')).toBeVisible();
    await expect(page.getByText('Release Calendar')).toBeVisible();
    await expect(page.getByText('Sprint Status')).toBeVisible();
    await expect(page.getByText('Enterprise Metrics')).toBeVisible();
  });

  // test('should display mock data correctly', async ({ page }) => {
  //   await expect(page.getByText('Release 1.0', { exact: false })).toBeVisible({ timeout: 10000 });
  //   await expect(page.getByText('Deployments', { exact: false })).toBeVisible({ timeout: 10000 });
  // });

  test('should navigate to the About page', async ({ page }) => {
    // Click the About link in the navigation bar
    await page.getByRole('link', { name: 'About' }).click();

    // Verify we are on the About page
    await expect(page.getByRole('heading', { name: 'About This Project' })).toBeVisible();
  });
});
