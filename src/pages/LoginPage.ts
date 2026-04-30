import { Page } from 'playwright'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  // Selectors
  private readonly loginEmailInput = 'input[data-qa="login-email"]'
  private readonly loginPasswordInput = 'input[data-qa="login-password"]'
  private readonly loginButton = 'button[data-qa="login-button"]'
  private readonly signupNameInput = 'input[data-qa="signup-name"]'
  private readonly signupEmailInput = 'input[data-qa="signup-email"]'
  private readonly signupButton = 'button[data-qa="signup-button"]'
  private readonly errorMessage = 'p:has-text("Your email or password is incorrect")'
  private readonly loggedInText = 'a:has-text("Logged in as")'

  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    await this.navigateTo('https://automationexercise.com/login')
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.loginEmailInput, email)
    await this.fillInput(this.loginPasswordInput, password)
    await this.click(this.loginButton)
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.loggedInText)
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage)
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage)
  }

  async getLoggedInUsername(): Promise<string> {
    const text = await this.getText(this.loggedInText)
    // Text is "Logged in as Steve" — extract just the name
    return text.replace('Logged in as ', '').trim()
  }
}
