import type { CollectionConfig } from 'payload'
import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Validate Cloudinary configuration
const validateCloudinaryConfig = (): boolean => {
  const { cloud_name, api_key, api_secret } = cloudinary.config()
  
  console.log('Cloudinary Config Check:', { 
    cloud_name, 
    api_key: api_key ? 'SET' : 'NOT SET', 
    api_secret: api_secret ? 'SET' : 'NOT SET' 
  })
  
  if (!cloud_name || !api_key || !api_secret) {
    console.warn('Cloudinary configuration incomplete. Images will be stored locally.')
    return false
  }
  
  return true
}

const isCloudinaryConfigured = validateCloudinaryConfig()

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

// Image MIME types that should be uploaded to Cloudinary
const IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/jfif',
  'image/jpg',
  'image/gif',
]

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Removed staticURL as it doesn't exist in UploadConfig type
    staticDir: path.resolve(__dirname, '../../public/uploads'),
    mimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/jfif',
      'image/jpg',
      'image/gif',
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
    { name: 'cloudinary_url', type: 'text', required: false, admin: { readOnly: true } },
    { name: 'cloudinary_public_id', type: 'text', required: false, admin: { readOnly: true } },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          // Handle image upload to Cloudinary
          if (IMAGE_MIME_TYPES.includes(doc.mimeType)) {
            if (!isCloudinaryConfigured) {
              console.log('Cloudinary not configured, keeping image locally')
              return
            }

            const filePath = path.join(
              path.resolve(__dirname, '../../public/uploads'),
              doc.filename
            )

            if (!fs.existsSync(filePath)) {
              console.warn(`File not found: ${filePath}`)
              return
            }

            try {
              console.log(`Uploading image to Cloudinary: ${doc.filename}`)
              
              const uploadResult = await cloudinary.uploader.upload(filePath, {
                folder: 'blog-images',
                public_id: `${Date.now()}_${path.parse(doc.filename).name}`,
                resource_type: 'auto',
                overwrite: false,
                timeout: 30000,
                use_filename: false,
                unique_filename: true,
              })

              console.log(`Image uploaded to Cloudinary: ${uploadResult.secure_url}`)

              // Use setTimeout to avoid immediate update conflicts
              setTimeout(async () => {
                try {
                  await req.payload.update({
  collection: 'media',
  id: doc.id,
  data: {
    cloudinary_url: String(uploadResult.secure_url),
    cloudinary_public_id: String(uploadResult.public_id),
  },
} as any)
                  console.log(`Updated media document with Cloudinary URL`)
                  
                  // Delete local file after successful database update
                  try {
                    if (fs.existsSync(filePath)) {
                      fs.unlinkSync(filePath)
                      console.log(`Local file deleted: ${doc.filename}`)
                    }
                  } catch (deleteError) {
                    console.warn(`Could not delete local file: ${doc.filename}`, (deleteError as Error).message)
                  }
                } catch (updateError) {
                  console.error(`Failed to update media document:`, (updateError as Error).message)
                }
              }, 2000)

            } catch (cloudinaryError) {
              console.error(`Cloudinary upload failed for ${doc.filename}:`)
              console.error(`Error message: ${(cloudinaryError as any).message}`)
              console.error(`Error code: ${(cloudinaryError as any).http_code || 'N/A'}`)
              console.log(`Image will remain stored locally: ${doc.filename}`)
            }

            return
          }

          // Handle CSV processing
          if (doc.mimeType !== 'text/csv') return

          const filePath = path.join(
            path.resolve(__dirname, '../../public/uploads'),
            doc.filename
          )
          const fileContent = fs.readFileSync(filePath, 'utf8')

          console.log(`Processing CSV file: ${doc.filename}`)

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
                console.error('CSV parse error:', err)
                return
              }

              console.log(`Parsed ${records.length} records from CSV`)

              const missingFields = REQUIRED_FIELDS.filter(
                (f) => !(f in (records[0] || {}))
              )
              if (missingFields.length > 0) {
                console.warn('Missing fields in CSV:', missingFields)
              }

              let successCount = 0
              let errorCount = 0

              for (const record of records) {
                try {
                  const rawPricing =
                    record['pricing_(raw)'] ?? record.pricing_raw ?? record.pricing

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

                  await req.payload.create({
                    collection: 'tools',
                    data: toolData as any,
                  })

                  successCount++
                } catch (insertError) {
                  console.error(
                    `Failed to insert tool: ${record.tool_name} (${record.category})`,
                    insertError
                  )
                  errorCount++
                }
              }

              console.log(`CSV import completed! Success: ${successCount}, Errors: ${errorCount}`)

              try {
                fs.unlinkSync(filePath)
                console.log(`CSV file deleted: ${doc.filename}`)
              } catch (deleteError) {
                console.warn(`Could not delete CSV file: ${doc.filename}`, (deleteError as Error).message)
              }
            }
          )
        } catch (outerErr) {
          console.error('afterChange hook error:', outerErr)
        }
      },
    ],
  },
}