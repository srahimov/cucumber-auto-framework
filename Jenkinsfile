pipeline {
    agent any

    environment {
        CI                  = 'true'
        BASE_URL            = 'https://automationexercise.com'
        API_BASE_URL        = 'https://automationexercise.com/api'
        // Credentials stored in Jenkins Credentials Manager
        TEST_USER_EMAIL     = credentials('TEST_USER_EMAIL')
        TEST_USER_PASSWORD  = credentials('TEST_USER_PASSWORD')
        XRAY_CLIENT_ID      = credentials('XRAY_CLIENT_ID')
        XRAY_CLIENT_SECRET  = credentials('XRAY_CLIENT_SECRET')
        XRAY_PROJECT_KEY    = 'QA'
        XRAY_TEST_PLAN_KEY  = 'QA-1'
        NODE_VERSION        = '20'
    }

    tools {
        nodejs "${NODE_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Running branch: ${env.BRANCH_NAME}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('Run API Tests') {
            steps {
                sh 'npm run test:api'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'reports/cucumber-report.json',
                                     allowEmptyArchive: true
                }
            }
        }

        stage('Run UI Tests') {
            steps {
                sh 'npm run test:ui'
            }
            post {
                failure {
                    archiveArtifacts artifacts: 'reports/screenshots/**/*',
                                     allowEmptyArchive: true
                }
                always {
                    archiveArtifacts artifacts: 'reports/cucumber-report.json',
                                     allowEmptyArchive: true
                    archiveArtifacts artifacts: 'reports/cucumber-report.html',
                                     allowEmptyArchive: true
                }
            }
        }

        stage('Upload Results to Xray') {
            steps {
                sh 'node scripts/uploadToXray.js'
            }
        }
    }

    post {
        always {
            echo "Pipeline complete. Status: ${currentBuild.result}"
            // Publish HTML report inside Jenkins
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'cucumber-report.html',
                reportName: 'Cucumber Test Report'
            ])
        }
        success {
            echo "All tests passed. Results uploaded to Xray."
        }
        failure {
            echo "Tests failed. Check reports and screenshots."
        }
    }
}
