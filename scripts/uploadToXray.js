const axios = require('axios')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const XRAY_CLIENT_ID = process.env.XRAY_CLIENT_ID
const XRAY_CLIENT_SECRET = process.env.XRAY_CLIENT_SECRET
const XRAY_PROJECT_KEY = process.env.XRAY_PROJECT_KEY || 'EXG'
const XRAY_TEST_PLAN_KEY = process.env.XRAY_TEST_PLAN_KEY || 'EXG-9'
const REPORT_PATH = path.join(__dirname, '../reports/cucumber-report.json')

async function getXrayToken() {
  console.log('[Xray] Authenticating with Xray Cloud...')
  const response = await axios.post(
    'https://xray.cloud.getxray.app/api/v2/authenticate',
    {
      client_id: XRAY_CLIENT_ID,
      client_secret: XRAY_CLIENT_SECRET
    },
    { headers: { 'Content-Type': 'application/json' } }
  )
  return response.data.replace(/"/g, '')
}

async function uploadCucumberReport(token) {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error('[Xray] ERROR: Report not found at', REPORT_PATH)
    process.exit(1)
  }

  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'))
  console.log(`[Xray] Uploading to project: ${XRAY_PROJECT_KEY}, Test Plan: ${XRAY_TEST_PLAN_KEY}`)

  const response = await axios.post(
    'https://xray.cloud.getxray.app/api/v2/import/execution/cucumber',
    report,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        projectKey: XRAY_PROJECT_KEY,
        testPlanKey: XRAY_TEST_PLAN_KEY
      }
    }
  )

  console.log('[Xray] Upload successful!')
  console.log('[Xray] Test Execution Key:', response.data.key)
  console.log(`[Xray] View results: https://your-instance.atlassian.net/browse/${response.data.key}`)
  return response.data
}

async function main() {
  try {
    const token = await getXrayToken()
    await uploadCucumberReport(token)
    process.exit(0)
  } catch (error) {
    console.error('[Xray] Upload failed:', error.response?.data ?? error.message)
    process.exit(1)
  }
}

main()
