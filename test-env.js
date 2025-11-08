/* eslint-disable @typescript-eslint/no-require-imports */
// Test environment variables
require('dotenv').config({ path: '.env.local' })

console.log('\n🔍 Environment Variables Check\n')
console.log('='.repeat(50))

// Check all required variables
const required = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
  NEXT_PUBLIC_BOT_USERNAME: process.env.NEXT_PUBLIC_BOT_USERNAME,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
}

let allGood = true

for (const [key, value] of Object.entries(required)) {
  const status = value ? '✅' : '❌'
  const display = value
    ? key.includes('TOKEN') || key.includes('KEY')
      ? `${value.slice(0, 10)}...${value.slice(-10)}`
      : value
    : 'MISSING'

  console.log(`${status} ${key}: ${display}`)

  if (!value) allGood = false
}

console.log('='.repeat(50))

// Token validation
if (process.env.TELEGRAM_BOT_TOKEN) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  console.log(`\n📊 Token Info:`)
  console.log(`   Length: ${token.length} chars (expected ~45)`)
  console.log(
    `   Format: ${token.includes(':') ? '✅ Contains ":"' : '❌ Missing ":"'}`
  )
  console.log(`   Starts with digits: ${/^\d+:/.test(token) ? '✅' : '❌'}`)

  // Check if both tokens match
  if (process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN) {
    const match = token === process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
    console.log(`   Both tokens match: ${match ? '✅' : '❌ MISMATCH!'}`)
  }
}

console.log('\n' + '='.repeat(50))
console.log(
  allGood ? '\n✅ All variables are set!' : '\n❌ Some variables are missing!'
)
console.log('='.repeat(50) + '\n')

process.exit(allGood ? 0 : 1)
