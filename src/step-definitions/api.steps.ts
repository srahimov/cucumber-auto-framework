import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { AccountAPI } from '../api/AccountAPI'
import * as dotenv from 'dotenv'

dotenv.config()

const accountAPI = new AccountAPI()

// ─── ACCOUNT API STEPS ────────────────────────────────────────────────────────

Given('I have valid user credentials', function () {
  this.testData.email = process.env.TEST_USER_EMAIL ?? ''
  this.testData.password = process.env.TEST_USER_PASSWORD ?? ''
  console.log(`[Test] Using email: ${this.testData.email}`)
})

Given('I have invalid user credentials', function () {
  this.testData.email = 'invalid_user_notfound@test.com'
  this.testData.password = 'wrongpassword123'
})

When('I send a POST request to verify login', async function () {
  const response = await accountAPI.verifyLogin(
    this.testData.email as string,
    this.testData.password as string
  )
  const parsed = accountAPI.parseResponse(response.data)
  this.apiResponse = {
    status: response.status,
    body: parsed,
    responseCode: Number(parsed.responseCode),
    message: parsed.message
  }
  console.log(`[Test] responseCode: ${this.apiResponse.responseCode}`)
  console.log(`[Test] message: ${this.apiResponse.message}`)
})

// ─── PRODUCTS API STEPS ───────────────────────────────────────────────────────

When('I send a GET request to the products list endpoint', async function () {
  const response = await accountAPI.getProductsList()
  const parsed = accountAPI.parseResponse(response.data)
  this.apiResponse = {
    status: response.status,
    body: parsed,
    responseCode: Number(parsed.responseCode)
  }
})

When('I send a POST request to search for product {string}', async function (searchTerm: string) {
  const response = await accountAPI.searchProduct(searchTerm)
  const parsed = accountAPI.parseResponse(response.data)
  this.apiResponse = {
    status: response.status,
    body: parsed,
    responseCode: Number(parsed.responseCode)
  }
})

// ─── SHARED ASSERTION STEPS ───────────────────────────────────────────────────

Then('the API response code should be {int}', function (expectedCode: number) {
  expect(this.apiResponse.responseCode).toBe(expectedCode)
})

Then('the response message should be {string}', function (expectedMessage: string) {
  const body = this.apiResponse.body as Record<string, unknown>
  expect(body.message).toBe(expectedMessage)
})

Then('the response should contain a list of products', function () {
  const body = this.apiResponse.body as Record<string, unknown>
  const products = body.products as unknown[]
  expect(Array.isArray(products)).toBe(true)
  expect(products.length).toBeGreaterThan(0)
})

Then('each product should have a name and price', function () {
  const body = this.apiResponse.body as Record<string, unknown>
  const products = body.products as Record<string, unknown>[]
  products.forEach((product) => {
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('price')
  })
})

Then('the search results should not be empty', function () {
  const body = this.apiResponse.body as Record<string, unknown>
  const products = body.products as unknown[]
  expect(Array.isArray(products)).toBe(true)
  expect(products.length).toBeGreaterThan(0)
})
