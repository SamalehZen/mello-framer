import { expect, test, type Page } from '@playwright/test'

/**
 * Ready the page for a deterministic full-page capture: freeze time-based
 * effects, scroll through the document so lazy images start loading, then wait
 * for every image and the network to settle.
 */
async function settle(page: Page) {
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation:none!important;transition:none!important}html{scroll-behavior:auto!important}',
  })

  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })

  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true })
              img.addEventListener('error', () => resolve(), { once: true })
            }),
      ),
    ),
  )

  await page.waitForLoadState('networkidle')
}

const SECTIONS: ReadonlyArray<readonly [name: string, selector: string]> = [
  ['hero', '.hero'],
  ['products', '.products'],
  ['menu', '.menu'],
  ['mood', '.mood'],
  ['time', '.time'],
  ['philosophy', '.philosophy'],
  ['place', '.atmo'],
  ['testimonials', '.tst'],
  ['visit', '.visit'],
  ['footer', '.footer'],
]

test.describe('home', () => {
  test('renders every section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    for (const id of ['#menu', '#place', '#visit']) {
      await expect(page.locator(id)).toBeAttached()
    }
    await expect(page.locator('footer')).toBeAttached()
  })

  test('matches the visual baselines', async ({ page }) => {
    await page.goto('/')
    await settle(page)

    for (const [name, selector] of SECTIONS) {
      await expect(page.locator(selector)).toHaveScreenshot(`${name}.webp`)
    }
  })
})
