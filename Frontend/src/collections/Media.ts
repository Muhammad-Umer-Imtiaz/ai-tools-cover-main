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
  'thumbnail_url',
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
    staticDir: '/tmp/uploads', // ephemeral runtime dir
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
            ;(async () => {
              try {
                if (!isCloudinaryConfigured) {
                  console.log('Cloudinary not configured, keeping image locally')
                  return
                }

                const filePath = path.join('/tmp/uploads', doc.filename)

                if (!fs.existsSync(filePath)) {
                  console.warn(`File not found: ${filePath}`)
                  return
                }

                console.log(`Uploading image to Cloudinary: ${doc.filename}`)

                const uploadResult = await cloudinary.uploader.upload(filePath, {
                  folder: 'blog-images',
                  public_id: `${Date.now()}_${path.parse(doc.filename).name}`,
                  resource_type: 'auto',
                  overwrite: false,
                  timeout: 60000, // Increased timeout to 60 seconds
                  use_filename: false,
                  unique_filename: true,
                  transformation: [
                    { width: 1200, height: 1200, crop: 'limit' }, // limit max width/height
                    { quality: 'auto', fetch_format: 'auto' }, // automatic quality & format
                  ],
                })

                console.log('Image upload successful', uploadResult)
                console.log(`Image uploaded to Cloudinary: ${uploadResult.secure_url}`)
                console.log(`Image public ID: ${uploadResult.public_id}`)

                const updatedDoc = await req.payload.update({
                  collection: 'media',
                  id: doc.id,
                  data: {
                    cloudinary_url: uploadResult.secure_url,
                    cloudinary_public_id: uploadResult.public_id,
                  },
                } as any)

                console.log(`Updated media document with Cloudinary URL: ${doc.id}`, updatedDoc)

                // Delete local file after successful database update
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath)
                  console.log(`Local file deleted: ${doc.filename}`)
                }
              } catch (error: any) {
                console.error(`Error processing image ${doc.filename}:`, error.message)
                if (error.http_code) {
                  console.error(`Cloudinary HTTP code: ${error.http_code}`)
                }
                console.log(`Image will remain stored locally: ${doc.filename}`)
              }
            })()

            return
          }
        } catch (outerErr) {
          console.error('afterChange hook error:', outerErr)
        }
      },
    ],
  },
}
