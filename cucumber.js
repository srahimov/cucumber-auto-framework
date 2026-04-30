module.exports = {
  default: {
    require: [
      'src/support/ui.hooks.ts',
      'src/support/api.hooks.ts',
      'src/step-definitions/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    formatOptions: { snippetInterface: 'async-await' }
  },
  ui: {
    require: [
      'src/support/ui.hooks.ts',
      'src/step-definitions/ui.steps.ts'
    ],
    requireModule: ['ts-node/register'],
    paths: ['features/ui/**/*.feature'],
    format: [
      'progress',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    formatOptions: { snippetInterface: 'async-await' }
  },
  api: {
    require: [
      'src/support/api.hooks.ts',
      'src/step-definitions/api.steps.ts'
    ],
    requireModule: ['ts-node/register'],
    paths: ['features/api/**/*.feature'],
    format: [
      'progress',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    formatOptions: { snippetInterface: 'async-await' }
  }
}
