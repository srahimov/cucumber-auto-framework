import { Before, After, setDefaultTimeout } from '@cucumber/cucumber'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

setDefaultTimeout(30 * 1000)

declare module '@cucumber/cucumber' {
  interface World {
    apiResponse: Record<string, unknown>
    testData: Record<string, unknown>
  }
}

Before(async function () {
  if (!fs.existsSync('reports')) fs.mkdirSync('reports', { recursive: true })
  this.apiResponse = {}
  this.testData = {}
})

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    console.error(`[FAILED] ${scenario.pickle.name}`)
    console.error('[Response]', JSON.stringify(this.apiResponse, null, 2))
  }
})
