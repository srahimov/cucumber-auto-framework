module.exports = {
  default: {
    require: ['src/support/hooks.ts', 'src/step-definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true
  },
  ui: {
    require: ['src/support/hooks.ts', 'src/step-definitions/ui.steps.ts'],
    requireModule: ['ts-node/register'],
    paths: ['features/ui/**/*.feature'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    publishQuiet: true
  },
  api: {
    require: ['src/support/hooks.ts', 'src/step-definitions/api.steps.ts'],
    requireModule: ['ts-node/register'],
    paths: ['features/api/**/*.feature'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    publishQuiet: true
  }
}
