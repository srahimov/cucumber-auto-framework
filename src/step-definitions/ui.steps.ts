import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { ProductsPage } from '../pages/ProductsPage'
import * as dotenv from 'dotenv'

dotenv.config()

// ─── LOGIN STEPS ──────────────────────────────────────────────────────────────

Given('I am on the login page', async function () {
  const loginPage = new LoginPage(this.page)
  await loginPage.goto()
})

When('I enter valid email and password', async function () {
  const loginPage = new LoginPage(this.page)
  await loginPage.login(
    process.env.TEST_USER_EMAIL ?? '',
    process.env.TEST_USER_PASSWORD ?? ''
  )
})

When('I enter email {string} and password {string}', async function (email: string, password: string) {
  const loginPage = new LoginPage(this.page)
  await loginPage.login(email, password)
})

When('I click the login button', async function () {
  // Login button is already clicked inside loginPage.login()
  // This step exists for BDD readability — no extra action needed
})

Then('I should be logged in successfully', async function () {
  const loginPage = new LoginPage(this.page)
  const isLoggedIn = await loginPage.isLoggedIn()
  expect(isLoggedIn).toBe(true)
})

Then('I should see my username in the header', async function () {
  const loginPage = new LoginPage(this.page)
  const username = await loginPage.getLoggedInUsername()
  expect(username.length).toBeGreaterThan(0)
})

Then('I should see an error message {string}', async function (expectedError: string) {
  const loginPage = new LoginPage(this.page)
  const isErrorVisible = await loginPage.isErrorVisible()
  expect(isErrorVisible).toBe(true)
})

// ─── PRODUCTS STEPS ───────────────────────────────────────────────────────────

Given('I am on the products page', async function () {
  const productsPage = new ProductsPage(this.page)
  await productsPage.goto()
})

Then('the products page should be loaded', async function () {
  const productsPage = new ProductsPage(this.page)
  const isLoaded = await productsPage.isProductsPageLoaded()
  expect(isLoaded).toBe(true)
})

Then('I should see at least one product listed', async function () {
  const productsPage = new ProductsPage(this.page)
  const count = await productsPage.getProductCount()
  expect(count).toBeGreaterThan(0)
})

When('I search for the product {string}', async function (productName: string) {
  const productsPage = new ProductsPage(this.page)
  await productsPage.searchProduct(productName)
})

Then('I should see the search results heading', async function () {
  const productsPage = new ProductsPage(this.page)
  const isVisible = await productsPage.isSearchResultsVisible()
  expect(isVisible).toBe(true)
})

Then('the search results should contain products', async function () {
  const productsPage = new ProductsPage(this.page)
  const count = await productsPage.getProductCount()
  expect(count).toBeGreaterThan(0)
})
