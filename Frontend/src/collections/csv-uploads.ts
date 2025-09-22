import type { CollectionConfig } from 'payload'
import path from 'path'
import fs from 'fs/promises' // Use promises instead of sync
import { parse } from 'csv-parse'

// ✅ Normalize field names → lowercase, underscores
const normalizeFieldName = (fieldName: string): string => {
  return fieldName.toLowerCase().trim().replace(/\s+/g, '_')
}

// ✅ Remove special characters from a value (only keep alphanumeric + space)
const stripSpecialChars = (val: unknown): string | undefined => {
  if (val === null || val === undefined) return undefined
  return String(val)
    .replace(/[^0-9a-zA-Z ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// ✅ Required CSV headers
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

export const CSVUploads: CollectionConfig = {
  slug: 'csv-uploads',
  upload: {
    // Use /tmp directory for Vercel
    staticDir: process.env.NODE_ENV === 'production' 
      ? '/tmp/uploads' 
      : path.resolve(__dirname, '../../public/uploads'),
    mimeTypes: ['text/csv'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [{ name: 'alt', type: 'text' }],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          console.log('📄 Processing file:', doc.filename, 'MIME:', doc.mimeType)
          
          // ✅ Only process CSV files
          if (doc.mimeType !== 'text/csv') {
            console.log('⏭️ Skipping non-CSV file')
            return
          }

          // Determine file path based on environment
          const uploadDir = process.env.NODE_ENV === 'production' 
            ? '/tmp/uploads' 
            : path.resolve(__dirname, '../../public/uploads')
          
          const filePath = path.join(uploadDir, doc.filename)
          
          console.log('📂 Reading file from:', filePath)

          // Check if file exists
          try {
            await fs.access(filePath)
          } catch (accessError) {
            console.error('❌ File not accessible:', filePath, accessError)
            return
          }

          // Use async file reading
          const fileContent = await fs.readFile(filePath, 'utf8')
          console.log('📖 File content length:', fileContent.length)

          // Wrap parse in Promise for better error handling
          const parseCSV = (content: string): Promise<any[]> => {
            return new Promise((resolve, reject) => {
              parse(
                content,
                {
                  columns: (header) => {
                    console.log('🔤 Original headers:', header)
                    const normalized = header.map(normalizeFieldName)
                    console.log('🔤 Normalized headers:', normalized)
                    return normalized
                  },
                  skip_empty_lines: true,
                  relax_column_count: true,
                  relax_quotes: true,
                  bom: true,
                },
                (err, records) => {
                  if (err) reject(err)
                  else resolve(records)
                }
              )
            })
          }

          const records = await parseCSV(fileContent)
          console.log(`📂 Parsed ${records.length} records`)
          
          if (records.length === 0) {
            console.warn('⚠️ No records found in CSV')
            return
          }

          console.log('🔑 Available keys:', Object.keys(records[0] || {}))

          // ✅ Header check
          const firstRecord = records[0] || {}
          const missingFields = REQUIRED_FIELDS.filter((f) => !(f in firstRecord))
          if (missingFields.length > 0) {
            console.warn('⚠️ Missing fields in CSV:', missingFields)
          }

          // Process records with better error handling
          let successCount = 0
          let errorCount = 0

          for (const [index, record] of records.entries()) {
            try {
              console.log(`🔄 Processing record ${index + 1}/${records.length}: ${record.tool_name}`)
              
              const rawPricing = record['pricing_(raw)'] ?? record.pricing_raw ?? record.pricing

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

                // ✅ Sanitized fields
                category: stripSpecialChars(record.category),
                pricing: stripSpecialChars(rawPricing),

                // ✅ Default values
                is_approved: true,
                click_count: Number.parseInt(record.click_count) || 0,
                views: Number.parseInt(record.views) || 0,
                rating: Number.parseFloat(record.rating) || 0,
              }

              // ✅ Remove empty/null values
              Object.keys(toolData).forEach((k) => {
                if (toolData[k] === null || toolData[k] === undefined || toolData[k] === '') {
                  delete toolData[k]
                }
              })

              // Validate required fields
              if (!toolData.name) {
                console.warn(`⚠️ Skipping record ${index + 1}: missing tool_name`)
                continue
              }

              await req.payload.create({
                collection: 'tools',
                data: toolData,
              })

              successCount++
              console.log(`✅ Successfully inserted: ${toolData.name}`)

            } catch (insertError) {
              errorCount++
              console.error(
                `❌ Failed to insert tool: ${record.tool_name} (${record.category})`,
                insertError
              )
              
              // Log more details for debugging
              if (insertError instanceof Error) {
                console.error('Error details:', {
                  message: insertError.message,
                  stack: insertError.stack?.split('\n')[0]
                })
              }
            }
          }

          console.log(`🎉 CSV import completed! Success: ${successCount}, Errors: ${errorCount}`)

          // Clean up file in production (optional)
          if (process.env.NODE_ENV === 'production') {
            try {
              await fs.unlink(filePath)
              console.log('🗑️ Cleaned up temporary file')
            } catch (cleanupError) {
              console.warn('⚠️ Could not clean up file:', cleanupError)
            }
          }

        } catch (outerErr) {
          console.error('❌ afterChange hook error:', outerErr)
          
          // More detailed error logging
          if (outerErr instanceof Error) {
            console.error('Error details:', {
              message: outerErr.message,
              stack: outerErr.stack,
              name: outerErr.name
            })
          }
        }
      },
    ],
  },
}