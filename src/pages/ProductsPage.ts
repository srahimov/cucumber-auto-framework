import { Page } from 'playwright'
import { BasePage } from './BasePage'

export class ProductsPage extends BasePage {
  // Selectors
  private readonly productsHeading = '.title'
  private readonly productsList = '.features_items'
  private readonly searchInput = '#search_product'
  private readonly searchButton = '#submit_search'
  private readonly searchResultsHeading = 'h2.title:has-text("Searched Products")'
  private readonly productCard = '.product-image-wrapper'
  private readonly viewProductLink = 'a[href*="product_details"]'
  private readonly productName = '.productinfo p'
  private readonly addToCartBtn = '.productinfo a.btn'

  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    await this.navigateTo('https://automationexercise.com/products')
  }

  async isProductsPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.productsList)
  }

  async searchProduct(productName: string): Promise<void> {
    await this.fillInput(this.searchInput, productName)
    await this.click(this.searchButton)
  }

  async isSearchResultsVisible(): Promise<boolean> {
    return await this.isVisible(this.searchResultsHeading)
  }

  async getProductCount(): Promise<number> {
    const products = await this.page.$$(this.productCard)
    return products.length
  }

  async getFirstProductName(): Promise<string> {
    return await this.getText(`${this.productCard}:first-child ${this.productName}`)
  }

  async clickFirstProduct(): Promise<void> {
    await this.click(`${this.viewProductLink}:first-child`)
  }

  async addFirstProductToCart(): Promise<void> {
    await this.page.hover(`${this.productCard}:first-child`)
    await this.click(`${this.productCard}:first-child ${this.addToCartBtn}`)
  }
}
