import 'dotenv/config'
import { sequelize } from '../lib/sequelize.js'

async function reset() {
  try {
    console.log('⚠️  This will DROP and RECREATE all tables. Proceeding...')
    await sequelize.authenticate()
    console.log('✅ Connected to database')

    // Drop all tables
    console.log('🗑️  Dropping all tables...')
    await sequelize.drop({ cascade: true })

    // Re-sync models
    console.log('🔄 Recreating tables...')
    await sequelize.sync({ force: true })

    console.log('✅ Database reset complete. All tables recreated empty.')
    process.exit(0)
  } catch (e: any) {
    console.error('❌ Reset failed:', e.message)
    process.exit(1)
  }
}

reset()
