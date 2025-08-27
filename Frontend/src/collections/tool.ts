// collections/Tools.ts - Simplified Tools Collection (remove CSV processing from hooks)
import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Tools: CollectionConfig = {
  slug: 'tools',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'is_approved','pricing', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'is_approved',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'link',
      type: 'text',
      required: true,
    },
    {
      name: 'image_url',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'text',

      admin: {
        description: 'Enter Category',
      },
    },
    {
      name: 'thumbnail_url',
      type: 'text',
      required: true,
    },
    {
      name: 'pricing',
      type: 'text',

      admin: {
        description: 'Enter Pricing eg free paid Freemium',
      },
    },

    {
      name: 'tags',
      type: 'text',
      admin: {
        description: 'Enter tags separated by # (e.g., #translator#legal#education)',
      },
    },
    {
      name: 'overview',
      type: 'textarea',
      admin: {
        description: 'Brief overview of the tool',
      },
    },
    {
      name: 'what_you_can_do_with',
      type: 'textarea',
      admin: {
        description: 'What users can do with this tool',
      },
    },
    {
      name: 'key_features',
      type: 'textarea',
      required: true,
    },
    {
      name: 'benefits',
      type: 'textarea',
      admin: {
        description: 'Benefits of using this tool',
      },
    },
    {
      name: 'pricing_plans',
      type: 'textarea',
      admin: {
        description: 'Detailed pricing information',
      },
    },
    {
      name: 'tips_best_practices',
      type: 'textarea',
      admin: {
        description: 'Tips and best practices for using the tool',
      },
    },
    {
      name: 'faqs',
      type: 'textarea',
      admin: {
        description: 'Frequently asked questions',
      },
    },
    {
      name: 'final_take',
      type: 'textarea',
      admin: {
        description: 'Final thoughts or recommendation',
      },
    },

    {
      name: 'rating',
      type: 'text',
      admin: {
        description:
          'Rating format: "Rated X out of 5(Y)" where X is rating and Y is number of reviews',
      },
    },
    {
      name: 'click_count',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
    },

    ...slugField(),
  ],
}

// pages/api/tools/bulk-upload.js - Improved CSV Upload API
