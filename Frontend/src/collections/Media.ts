import type { CollectionConfig } from 'payload'
import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse'

// Normalize CSV headers
const normalizeFieldName = (fieldName: string): string =>
  fieldName.toLowerCase().trim().replace(/\s+/g, '_')

const REQUIRED_FIELDS = [
  'tool_name',
  'category',
  'tags',
  'rating',
  'pricing_(raw)',
  'overview',
  'what_you_can_do_with',
  'key_features',
  'benefits',
  'pricing_plans',
  'tips_&_best_practices',
  'faqs',
  'final_take',
  'tool_url',
  'thumnail_url',
  'logo_url',
]

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: path.resolve(__dirname, '../../public/uploads'),
    mimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/jfif',
      'application/pdf',
      'text/csv',
    ],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: { useAsTitle: 'filename' },
  fields: [
    { name: 'alt', type: 'text', required: false },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          // Only process CSV files
          if (doc.mimeType !== 'text/csv') return

          const filePath = path.join(
            path.resolve(__dirname, '../../public/uploads'),
            doc.filename
          )
          const fileContent = fs.readFileSync(filePath, 'utf8')

          // Process CSV asynchronously, don't block Media save
          parse(
            fileContent,
            {
              columns: (header) => header.map(normalizeFieldName),
              skip_empty_lines: true,
              relax_column_count: true,
              relax_quotes: true,
              bom: true,
            },
            async (err, records: any[]) => {
              if (err) {
                console.error('❌ CSV parse error:', err)
                return
              }

              console.log(`📂 Parsed ${records.length} records`)

              // Header validation
              const missingFields = REQUIRED_FIELDS.filter(
                (f) => !(f in (records[0] || {}))
              )
              if (missingFields.length > 0) {
                console.warn('⚠️ Missing fields in CSV:', missingFields)
              }

              for (const record of records) {
                try {
                  const rawPricing =
                    record['pricing_(raw)'] ?? record.pricing_raw ?? record.pricing

                  const toolData: any = {
                    name: record.tool_name,
                    link: record.tool_url,
                    image_url: record.logo_url,
                    thumbnail_url: record.thumnail_url,
                    tags: record.tags,
                    overview: record.overview,
                    what_you_can_do_with: record.what_you_can_do_with,
                    key_features: record.key_features || ' ',
                    benefits: record.benefits,
                    tips_best_practices:
                      record['tips_&_best_practices'] ?? record.tips_best_practices,
                    faqs: record.faqs,
                    pricing_plans: record.pricing_plans,
                    final_take: record.final_take,
                    category: record.category,
                    pricing: rawPricing,
                    is_approved: true,
                    click_count: Number.parseInt(record.click_count) || 0,
                    views: Number.parseInt(record.views) || 0,
                    rating: Number.parseFloat(record.rating) || 0,
                  }

                  // Remove empty/null values
                  Object.keys(toolData).forEach((k) => {
                    if (toolData[k] === null || toolData[k] === undefined || toolData[k] === '') {
                      delete toolData[k]
                    }
                  })

                  // Create tool document
                  await req.payload.create({
                    collection: 'tools',
                    data: toolData,
                  })
                } catch (insertError) {
                  console.error(
                    `❌ Failed to insert tool: ${record.tool_name} (${record.category})`,
                    insertError
                  )
                }
              }

              console.log('🎉 CSV import completed!')
            }
          )
        } catch (outerErr) {
          console.error('❌ afterChange hook error:', outerErr)
        }
      },
    ],
  },
}
