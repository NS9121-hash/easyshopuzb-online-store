#!/usr/bin/env node

/**
 * Database Setup Helper Script
 * Connects to Supabase and executes the SQL setup script
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

console.log('Connecting to Supabase...')
const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('Reading setup script...')
const setupScript = fs.readFileSync(path.join(path.dirname(import.meta.url), 'setup-database.sql'), 'utf-8')

console.log('Executing setup script...')
const { error } = await supabase.rpc('exec_raw_sql', {
  sql: setupScript
})

if (error) {
  console.error('Error executing setup script:', error)
  process.exit(1)
}

console.log('✓ Database setup completed successfully!')
console.log('\nTables created:')
console.log('  - products')
console.log('  - orders')
console.log('\nNext steps:')
console.log('1. Run: pnpm dev')
console.log('2. Open http://localhost:3000')
console.log('3. Configure your Telegram bots')
