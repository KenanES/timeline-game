/**
 * Environment configuration for TimeLines game
 * This file helps manage different environments (development, staging, production)
 */

const environments = {
  development: {
    name: 'Development',
    url: 'http://localhost:3000',
    apiUrl: '/api',
    isProduction: false,
    showDebugInfo: true,
  },
  preview: {
    name: 'Preview/Staging',
    url: 'https://timelines-game-git-development-yourusername.vercel.app',
    apiUrl: '/api',
    isProduction: false,
    showDebugInfo: true,
  },
  production: {
    name: 'Production',
    url: 'https://playtimelines.com',
    apiUrl: '/api',
    isProduction: true,
    showDebugInfo: false,
  },
};

// This will be replaced by actual environment variables in Vercel
const currentEnv = process.env.NEXT_PUBLIC_APP_ENV || 'development';

// Export the current environment configuration
module.exports = {
  ...environments[currentEnv],
  currentEnv,
};
