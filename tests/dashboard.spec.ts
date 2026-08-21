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
    await expect(page.getByRole('heading', { name: 'System Health', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Alerts & Events', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Release Calendar', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sprint Status', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Enterprise Metrics', exact: true })).toBeVisible();
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


test('should ingest a supported JSON signal and record the scan locally', async ({ page }) => {
  await page.goto('/scans');

  await page.getByLabel('Scan source label').fill('SonarQube quality scan');
  await page.getByLabel('Signal JSON').fill(
    JSON.stringify({
      issues: [
        {
          project: 'checkout-service',
          severity: 'CRITICAL',
          message: 'SQL injection risk',
          creationDate: '2026-08-21T12:00:00.000Z',
        },
      ],
    }),
  );
  await page.getByRole('button', { name: 'Ingest signal' }).click();

  await expect(
    page.getByText('1 issue ingested using the SonarQube adapter.'),
  ).toBeVisible();
  await expect(page.getByRole('table', { name: 'Scan history' })).toContainText(
    'SonarQube quality scan',
  );

  await page.getByRole('link', { name: 'Dashboard' }).click();
  await expect(page.getByText('SQL injection risk')).toBeVisible();
});
