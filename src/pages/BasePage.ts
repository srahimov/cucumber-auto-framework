import { Page } from 'playwright'

export class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' })
  }

  async fillInput(selector: string, text: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' })
    await this.page.fill(selector, text)
  }

  async click(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' })
    await this.page.click(selector)
  }

  async getText(selector: string): Promise<string> {
    await this.page.waitForSelector(selector, { state: 'visible' })
    return (await this.page.textContent(selector)) ?? ''
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector)
  }

  async waitForURL(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern)
  }

  async getTitle(): Promise<string> {
    return await this.page.title()
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    })
  }
}
