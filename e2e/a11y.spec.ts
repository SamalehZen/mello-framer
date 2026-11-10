import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('accessibility', () => {
  test('has no detectable a11y violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })
})
