#!/usr/bin/env node

/*
  Preflight verification for production deploy.
  Checks required env vars and basic Supabase/Vercel config assumptions.
*/

const requiredEnv = [
  // Vite client
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  // Supabase functions
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  // Stripe
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_PRICE_ID',
  // Optional: 'STRIPE_API_VERSION',
  // Stripe webhook (set in functions env)
  // 'STRIPE_WEBHOOK_SECRET',
  // Instacart
  'INSTACART_API_KEY',
  'INSTACART_BASE_URL',
];

let missing = [];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:\n', missing.join('\n'));
  process.exit(1);
}

console.log('✅ All required environment variables are set.');
process.exit(0);


