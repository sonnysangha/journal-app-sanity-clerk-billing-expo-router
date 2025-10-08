import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

if (!process.env.EXPO_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('EXPO_PUBLIC_SANITY_PROJECT_ID is not set')
}
if (!process.env.EXPO_PUBLIC_SANITY_DATASET) {
  throw new Error('EXPO_PUBLIC_SANITY_DATASET is not set')
}

export default defineConfig({
  name: 'default',
  title: 'Journal.ai',

  projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.EXPO_PUBLIC_SANITY_DATASET,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
