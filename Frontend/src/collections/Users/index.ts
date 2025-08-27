import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // bas ye lagana kafi hai 🚀
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'email', 'createdAt', 'updatedAt'],
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },
    // email aur password Payload khud handle karega
    // is liye unko dobara likhne ki zarurat nahi hai
  ],
}
