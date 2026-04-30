# Automation Framework
## Vitest + Playwright + Cucumber + Xray Integration
### Target: automationexercise.com (UI + API)

---

## Tech Stack
| Tool | Purpose |
|---|---|
| Playwright | UI browser automation |
| Cucumber | BDD Gherkin scenario runner |
| Vitest | Unit/integration test runner |
| Axios/Supertest | API testing |
| Xray (Jira) | Test management & reporting |
| GitHub Actions | CI pipeline |
| Jenkins | Alternative CI pipeline |

---

## Project Structure
```
automation-framework/
├── src/
│   ├── pages/           # Playwright Page Objects
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   └── ProductsPage.ts
│   ├── api/             # API layer
│   │   ├── BaseAPI.ts
│   │   └── AccountAPI.ts
│   ├── support/
│   │   └── hooks.ts     # Cucumber lifecycle hooks
│   └── step-definitions/
│       ├── ui.steps.ts
│       └── api.steps.ts
├── features/
│   ├── ui/
│   │   ├── login.feature
│   │   └── products.feature
│   └── api/
│       ├── account.feature
│       └── products-api.feature
├── scripts/
│   └── uploadToXray.js  # Xray REST API upload
├── .github/workflows/
│   └── test.yml
├── Jenkinsfile
├── cucumber.js
├── vitest.config.ts
└── .env
```

---

## Local Setup

### 1. Clone and install
```bash
git clone https://github.com/your-org/automation-framework.git
cd automation-framework
npm install
npx playwright install chromium
```

### 2. Configure environment
Copy `.env` and fill in your values:
```bash
cp .env .env.local
```

```env
BASE_URL=https://automationexercise.com
API_BASE_URL=https://automationexercise.com/api
TEST_USER_EMAIL=your_registered_email@test.com
TEST_USER_PASSWORD=YourPassword123!
XRAY_CLIENT_ID=your_xray_client_id
XRAY_CLIENT_SECRET=your_xray_client_secret
XRAY_PROJECT_KEY=QA
XRAY_TEST_PLAN_KEY=QA-1
```

> NOTE: You must register an account on automationexercise.com
> and use those credentials in TEST_USER_EMAIL / TEST_USER_PASSWORD

### 3. Run tests locally
```bash
# Run all UI tests
npm run test:ui

# Run all API tests
npm run test:api

# Run everything
npm run test:all

# Upload report to Xray
npm run report:upload
```

---

## Xray Setup (Step by Step)

### Step 1: Install Xray in your Jira account
1. Go to your Jira instance
2. Click Apps → Find new apps
3. Search for "Xray Test Management"
4. Install it (free trial available)

### Step 2: Create a Test Plan in Xray
1. In Jira, create a new issue
2. Issue type → Test Plan
3. Name it "Automation Exercise Test Plan"
4. Note the issue key (e.g. QA-1) — this is your XRAY_TEST_PLAN_KEY

### Step 3: Get Xray API credentials
1. Go to: https://xray.cloud.getxray.app/
2. Click your profile → API Keys
3. Generate a new Client ID and Client Secret
4. Copy these into your .env file

### Step 4: Tag your Gherkin scenarios
Each scenario in your feature files has an Xray tag:
```gherkin
@XRAY-101 @smoke
Scenario: Successful login with valid credentials
```
The @XRAY-101 tag maps this scenario to Test issue XRAY-101 in Jira.
Create matching Test issues in your Jira project with these keys.

### Step 5: Upload results manually
```bash
npm run report:upload
```
This runs `scripts/uploadToXray.js` which:
1. Authenticates with Xray Cloud API
2. Reads `reports/cucumber-report.json`
3. POSTs it to Xray's import endpoint
4. Xray creates a Test Execution in Jira and links results

### Step 6: Verify in Jira
1. Go to your Jira project
2. Open the Test Plan you created
3. You should see a new Test Execution with PASS/FAIL status per scenario

---

## CI Setup

### GitHub Actions
1. Go to your GitHub repo → Settings → Secrets and Variables → Actions
2. Add these secrets:
   - TEST_USER_EMAIL
   - TEST_USER_PASSWORD
   - XRAY_CLIENT_ID
   - XRAY_CLIENT_SECRET
   - XRAY_PROJECT_KEY
   - XRAY_TEST_PLAN_KEY
3. Push to main or develop — pipeline triggers automatically
4. View results under Actions tab

### Jenkins
1. Install plugins: NodeJS Plugin, HTML Publisher Plugin
2. Go to Manage Jenkins → Credentials → Add:
   - TEST_USER_EMAIL (Secret text)
   - TEST_USER_PASSWORD (Secret text)
   - XRAY_CLIENT_ID (Secret text)
   - XRAY_CLIENT_SECRET (Secret text)
3. Create new Pipeline job → point to your repo → Jenkinsfile auto-detected
4. Build Now

---

## Xray REST API Endpoint Reference

| Action | Method | Endpoint |
|---|---|---|
| Authenticate | POST | https://xray.cloud.getxray.app/api/v2/authenticate |
| Upload Cucumber JSON | POST | https://xray.cloud.getxray.app/api/v2/import/execution/cucumber |
| Upload JUnit XML | POST | https://xray.cloud.getxray.app/api/v2/import/execution/junit |

---

## Complete Flow Diagram

```
Developer pushes code
        ↓
GitHub Actions / Jenkins triggers
        ↓
npm run test:ui  →  Playwright drives browser  →  Gherkin steps execute
npm run test:api →  Axios hits real endpoints  →  Gherkin steps execute
        ↓
Cucumber generates reports/cucumber-report.json
        ↓
scripts/uploadToXray.js POSTs JSON to Xray Cloud API
        ↓
Xray creates Test Execution in Jira
        ↓
Business Analyst sees PASS/FAIL in Jira — no code access needed
```
