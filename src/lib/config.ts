// lib/config.ts

// Define environment types for Solana and the app
export type SolanaEnvironment = 'devnet' | 'mainnet-beta' | 'testnet';
export type AppEnvironment = 'dev' | 'qa' | 'prd';

interface SolanaConfig {
  solanaEnvironment: SolanaEnvironment;
  solanaEndpoint: string;
}

interface AppConfig {
  appEnvironment: AppEnvironment;
  apiUrl: string;
  featureToggle: boolean;
}

// Combine all configurations
interface Config {
  solana: SolanaConfig;
  app: AppConfig;
}

// Get Helius API key from environment variables
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || '';

// Solana configuration options, including Helius RPC
const SOLANA_CONFIGS: Record<SolanaEnvironment, SolanaConfig> = {
  devnet: {
    solanaEnvironment: 'devnet',
    solanaEndpoint: 'https://api.devnet.solana.com',
  },
  'mainnet-beta': {
    solanaEnvironment: 'mainnet-beta',
    solanaEndpoint: HELIUS_API_KEY 
      ? `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}` 
      : 'https://api.mainnet-beta.solana.com',
  },
  testnet: {
    solanaEnvironment: 'testnet',
    solanaEndpoint: 'https://api.testnet.solana.com',
  },
};

// Application configuration options
const APP_CONFIGS: Record<AppEnvironment, AppConfig> = {
  dev: {
    appEnvironment: 'dev',
    apiUrl: 'https://dev-api.myapp.com',
    featureToggle: true,
  },
  qa: {
    appEnvironment: 'qa',
    apiUrl: 'https://qa-api.myapp.com',
    featureToggle: false,
  },
  prd: {
    appEnvironment: 'prd',
    apiUrl: 'https://api.myapp.com',
    featureToggle: false,
  },
};

// Default environments
let currentSolanaEnv: SolanaEnvironment = 'devnet';
let currentAppEnv: AppEnvironment = 'dev';

// Switch Solana environment
export const setSolanaEnvironment = (env: SolanaEnvironment) => {
  if (!SOLANA_CONFIGS[env]) {
    throw new Error(`Invalid Solana environment: ${env}`);
  }
  currentSolanaEnv = env;
};

// Switch App environment
export const setAppEnvironment = (env: AppEnvironment) => {
  if (!APP_CONFIGS[env]) {
    throw new Error(`Invalid App environment: ${env}`);
  }
  currentAppEnv = env;
};

// Get the current Solana configuration
export const getSolanaConfig = (): SolanaConfig => SOLANA_CONFIGS[currentSolanaEnv];

// Get the current App configuration
export const getAppConfig = (): AppConfig => APP_CONFIGS[currentAppEnv];

// Get specific values for convenience
export const getSolanaEndpoint = (): string => getSolanaConfig().solanaEndpoint;
export const getApiUrl = (): string => getAppConfig().apiUrl;
export const isFeatureToggleEnabled = (): boolean => getAppConfig().featureToggle;
