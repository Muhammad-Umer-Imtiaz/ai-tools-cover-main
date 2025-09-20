/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* ✅ Fixed version by overriding OPTIONS to avoid type error */

import config from '@payload-config'
import { GRAPHQL_POST } from '@payloadcms/next/routes'
import { NextRequest } from 'next/server'

// ✅ GraphQL POST handler (Payload wala hi use karna hoga)
export const POST = GRAPHQL_POST(config)

// ✅ OPTIONS ko manually define kiya (Payload ka REST_OPTIONS hata diya)
export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204 })
}
