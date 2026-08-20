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

  test('should filter alerts by severity', async ({ page }) => {
    // Wait for the mock data to load
    await expect(page.getByText('CPU usage high')).toBeVisible({ timeout: 10000 });
    
    // Initially both High and Medium alerts should be visible (mock data has 1 of each)
    await expect(page.getByText('CPU usage high')).toBeVisible(); // High
    await expect(page.getByText('Memory warning')).toBeVisible(); // Medium
    
    // Open the filter dropdown
    await page.getByLabel('Filter alerts by severity').click();
    
    // Select "High"
    await page.getByRole('option', { name: 'High' }).click();
    
    // Verify only High alert is visible
    await expect(page.getByText('CPU usage high')).toBeVisible();
    await expect(page.getByText('Memory warning')).not.toBeVisible();
    
    // Open the filter dropdown again
    await page.getByLabel('Filter alerts by severity').click();
    
    // Select "Low"
    await page.getByRole('option', { name: 'Low' }).click();
    
    // Verify empty state message is shown
    await expect(page.getByText('No alerts found for this severity.')).toBeVisible();
  });

  test('should navigate to the About page', async ({ page }) => {
    // Click the About link in the navigation bar
    await page.getByRole('link', { name: 'About' }).click();

    // Verify we are on the About page
    await expect(page.getByRole('heading', { name: 'About This Project' })).toBeVisible();
  });
});
