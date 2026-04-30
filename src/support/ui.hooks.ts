import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber'
import { Browser, BrowserContext, Page, chromium } from 'playwright'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

setDefaultTimeout(30 * 1000)

let browser: Browser
let context: BrowserContext

declare module '@cucumber/cucumber' {
  interface World {
    page: Page
    context: BrowserContext
    browser: Browser
    apiResponse: Record<string, unknown>
    testData: Record<string, unknown>
  }
}

BeforeAll(async function () {
  if (!fs.existsSync('reports')) fs.mkdirSync('reports', { recursive: true })
  if (!fs.existsSync('reports/screenshots')) fs.mkdirSync('reports/screenshots', { recursive: true })

  browser = await chromium.launch({
    headless: true,
    slowMo: 0
  })
})

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

AfterAll(async function () {
  await browser?.close()
})
