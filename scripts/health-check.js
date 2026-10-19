#!/usr/bin/env node

/**
 * Production Health Check Script
 * Verifies that all services are running correctly
 */

const http = require('http');
const https = require('https');

const checks = [
  {
    name: 'Frontend',
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    expectedStatus: 200,
  },
  {
    name: 'API',
    url: process.env.API_URL || 'http://localhost:8000',
    expectedStatus: 200,
  },
  {
    name: 'API Docs',
    url: (process.env.API_URL || 'http://localhost:8000') + '/docs',
    expectedStatus: 200,
  },
];

function checkUrl(check) {
  return new Promise((resolve) => {
    const lib = check.url.startsWith('https') ? https : http;

    const req = lib.get(check.url, (res) => {
      const success = res.statusCode === check.expectedStatus;
      resolve({
        ...check,
        status: res.statusCode,
        success,
        message: success ? 'OK' : `Expected ${check.expectedStatus}, got ${res.statusCode}`,
      });
    });

    req.on('error', (error) => {
      resolve({
        ...check,
        status: 0,
        success: false,
        message: error.message,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        ...check,
        status: 0,
        success: false,
        message: 'Timeout',
      });
    });
  });
}

async function runHealthChecks() {
  console.log('🏥 Running health checks...\n');

  const results = await Promise.all(checks.map(checkUrl));

  let allPassed = true;

  results.forEach((result) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Status: ${result.status || 'No response'}`);
    console.log(`   Message: ${result.message}`);
    console.log('');

    if (!result.success) {
      allPassed = false;
    }
  });

  if (allPassed) {
    console.log('🎉 All health checks passed!');
    process.exit(0);
  } else {
    console.log('❌ Some health checks failed');
    process.exit(1);
  }
}

runHealthChecks().catch((error) => {
  console.error('Error running health checks:', error);
  process.exit(1);
});
