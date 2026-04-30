import { AxiosResponse } from 'axios'
import { BaseAPI } from './BaseAPI'

export class AccountAPI extends BaseAPI {
  constructor() {
    super()
  }

  // POST /api/verifyLogin — verify user credentials
  async verifyLogin(email: string, password: string): Promise<AxiosResponse> {
    return this.postForm('/verifyLogin', { email, password })
  }

  // POST /api/createAccount — create a new user account
  async createAccount(userData: {
    name: string
    email: string
    password: string
    title: string
    birth_date: string
    birth_month: string
    birth_year: string
    firstname: string
    lastname: string
    company: string
    address1: string
    address2: string
    country: string
    state: string
    city: string
    zipcode: string
    mobile_number: string
  }): Promise<AxiosResponse> {
    return this.postForm('/createAccount', userData)
  }

  // DELETE /api/deleteAccount — delete an account
  async deleteAccount(email: string, password: string): Promise<AxiosResponse> {
    return this.client.delete('/deleteAccount', {
      params: { email, password }
    })
  }

  // PUT /api/updateAccount — update user account
  async updateAccount(userData: {
    name: string
    email: string
    password: string
    title: string
    birth_date: string
    birth_month: string
    birth_year: string
    firstname: string
    lastname: string
    company: string
    address1: string
    country: string
    state: string
    city: string
    zipcode: string
    mobile_number: string
  }): Promise<AxiosResponse> {
    return this.postForm('/updateAccount', userData)
  }

  // GET /api/getUserDetailByEmail — get user details
  async getUserDetailByEmail(email: string): Promise<AxiosResponse> {
    return this.get('/getUserDetailByEmail', { email })
  }

  // GET /api/productsList — get all products
  async getProductsList(): Promise<AxiosResponse> {
    return this.get('/productsList')
  }

  // GET /api/brandsList — get all brands
  async getBrandsList(): Promise<AxiosResponse> {
    return this.get('/brandsList')
  }

  // POST /api/searchProduct — search for a product
  async searchProduct(searchParam: string): Promise<AxiosResponse> {
    return this.postForm('/searchProduct', { search_product: searchParam })
  }
}
