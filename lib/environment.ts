/**
 * Environment utility for TimeLines game
 * Provides access to environment-specific configuration
 */

// Define environment types
type Environment = 'development' | 'preview' | 'production';

// Define environment configuration interface
interface EnvironmentConfig {
  name: string;
  url: string;
  apiUrl: string;
  isProduction: boolean;
  showDebugInfo: boolean;
}

// Environment configurations
const environments: Record<Environment, EnvironmentConfig> = {
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

// Get current environment from Next.js environment variable
const getCurrentEnvironment = (): Environment => {
  // Default to development in client-side rendering when env is not available
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_APP_ENV) {
    return 'development';
  }
  
  return (process.env.NEXT_PUBLIC_APP_ENV as Environment) || 'development';
};

// Get environment configuration
export const getEnvironment = (): EnvironmentConfig => {
  const env = getCurrentEnvironment();
  return environments[env];
};

// Export current environment
export const environment = getEnvironment();

// Helper function to check if we're in production
export const isProduction = (): boolean => environment.isProduction;

// Helper function to check if we should show debug information
export const showDebugInfo = (): boolean => environment.showDebugInfo;
