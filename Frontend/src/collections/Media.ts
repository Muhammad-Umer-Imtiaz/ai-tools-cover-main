import type { CollectionConfig } from 'payload'
import { parse } from 'csv-parse'
import { v2 as cloudinary } from 'cloudinary'

// -------------------------
// Cloudinary Config
// -------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const isCloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET

// -------------------------
// Allowed mime types
// -------------------------
const IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/jfif',
  'image/jpg',
  'image/gif',
]

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

const normalizeFieldName = (fieldName: string): string =>
  fieldName.toLowerCase().trim().replace(/\s+/g, '_')

// -------------------------
// Media Collection
// -------------------------
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    disableLocalStorage: isCloudinaryConfigured, // ✅ Cloudinary prod me local storage band
    mimeTypes: [
      ...IMAGE_MIME_TYPES,
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
    { name: 'alt', type: 'text' },
    { name: 'cloudinary_url', type: 'text', admin: { readOnly: true } },
    { name: 'cloudinary_public_id', type: 'text', admin: { readOnly: true } },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          // -------------------------
          // Handle Image Upload
          // -------------------------
          if (IMAGE_MIME_TYPES.includes(doc.mimeType)) {
            if (!isCloudinaryConfigured) {
              console.log('⚠️ Cloudinary not configured, keeping file local')
              return
            }

            if (!doc.url) {
              console.warn('⚠️ No file URL found on document')
              return
            }

            console.log(`Uploading to Cloudinary from temp URL: ${doc.url}`)

            const uploadResult = await cloudinary.uploader.upload(doc.url, {
              folder: 'blog-images',
              public_id: `${Date.now()}_${doc.filename}`,
              resource_type: 'auto',
              overwrite: false,
            })

            console.log(`✅ Uploaded to Cloudinary: ${uploadResult.secure_url}`)

             await req.payload.update({
  collection: 'media',
  id: doc.id,
  data: {
    cloudinary_url: String(uploadResult.secure_url),
    cloudinary_public_id: String(uploadResult.public_id),
  },
} as any)

            return
          }

          // -------------------------
          // Handle CSV Import
          // -------------------------
          if (doc.mimeType === 'text/csv') {
            if (!doc.url) {
              console.warn('⚠️ No CSV URL found')
              return
            }

            console.log(`📥 Fetching CSV from: ${doc.url}`)
            const response = await fetch(doc.url)
            const fileContent = await response.text()

            parse(
              fileContent,
              {
                columns: (header: string[]) => header.map(normalizeFieldName),
                skip_empty_lines: true,
                relax_column_count: true,
                relax_quotes: true,
                bom: true,
              },
              async (err: Error | undefined, records: Record<string, any>[]) => {
                if (err) {
                  console.error('❌ CSV parse error:', err)
                  return
                }

                console.log(`Parsed ${records.length} records from CSV`)

                const missingFields = REQUIRED_FIELDS.filter(
                  (f) => !(f in (records[0] || {}))
                )
                if (missingFields.length > 0) {
                  console.warn('⚠️ Missing fields in CSV:', missingFields)
                }

                let successCount = 0
                let errorCount = 0

                for (const record of records) {
                  try {
                    const rawPricing =
                      record['pricing_(raw)'] ??
                      record.pricing_raw ??
                      record.pricing

                    const toolData: Record<string, any> = {
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
                        record['tips_&_best_practices'] ??
                        record.tips_best_practices,
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

                    // Clean empty/null values
                    Object.keys(toolData).forEach((k) => {
                      if (
                        toolData[k] === null ||
                        toolData[k] === undefined ||
                        toolData[k] === ''
                      ) {
                        delete toolData[k]
                      }
                    })

                    await req.payload.create({
                      collection: 'tools',
                      data: toolData,
                    })

                    successCount++
                  } catch (insertError) {
                    console.error(
                      `❌ Failed to insert tool: ${record.tool_name} (${record.category})`,
                      insertError
                    )
                    errorCount++
                  }
                }

                console.log(
                  `✅ CSV import completed! Success: ${successCount}, Errors: ${errorCount}`
                )
              }
            )
          }
        } catch (outerErr) {
          console.error('❌ afterChange hook error:', outerErr)
        }
      },
    ],
  },
}
