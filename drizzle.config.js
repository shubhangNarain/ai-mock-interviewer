/** @type { import("drizzle-kit).Config }*/

export default {
  schema: "./app/utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_mLS4grbp7wGf@ep-lucky-water-a8bkjihy-pooler.eastus2.azure.neon.tech/ai-interview-mocker?sslmode=require',
  }
}