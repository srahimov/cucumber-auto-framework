import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber'
import { Browser, BrowserContext, Page, chromium } from 'playwright'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

// Increase default timeout for all steps
setDefaultTimeout(30 * 1000)

// Shared browser instance across all scenarios
let browser: Browser
let context: BrowserContext

// Custom World interface
declare module '@cucumber/cucumber' {
  interface World {
    page: Page
    context: BrowserContext
    browser: Browser
    apiResponse: Record<string, unknown>
    testData: Record<string, unknown>
  }
}

// Start browser once before all scenarios
BeforeAll(async function () {
  // Create reports directory
  if (!fs.existsSync('reports')) fs.mkdirSync('reports', { recursive: true })
  if (!fs.existsSync('reports/screenshots')) fs.mkdirSync('reports/screenshots', { recursive: true })

  browser = await chromium.launch({
    headless: process.env.CI === 'true',  // headed locally, headless in CI
    slowMo: process.env.CI === 'true' ? 0 : 50
  })
})

// Create fresh browser context per scenario — full isolation
Before(async function () {
  context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  })
  this.page = await context.newPage()
  this.context = context
  this.browser = browser
  this.apiResponse = {}
  this.testData = {}
})

// After each scenario — screenshot on failure, close context
After(async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    const screenshotName = scenario.pickle.name.replace(/\s+/g, '-').toLowerCase()
    await this.page?.screenshot({
      path: `reports/screenshots/FAILED-${screenshotName}-${Date.now()}.png`,
      fullPage: true
    })
  }
  await context?.close()
})

// Close browser after all scenarios
AfterAll(async function () {
  await browser?.close()
})
