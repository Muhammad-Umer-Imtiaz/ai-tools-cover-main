import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CATEGORIES = [
  'productivity',
  'text-generators',
  'business-tools',
  'image-tools',
  'video-tools',
  'automation-tools',
  'art-generators',
  'audio-generators',
  'code-tools',
]

const FEATURES = [
  'personal-assistant',
  'research',
  'spreadsheets',
  'presentations',
  'search-engine',
  'translation',
  'email-assistants',
  'website-builders',
  'marketing',
  'finance',
  'project-management',
  'social-media',
  'education',
  'e-commerce',
  'seo',
  'customer-support',
  'human-resources',
  'sales-assistant',
  'stock-trading',
  'legal',
  'teachers',
  'startup-tools',
  'real-estate',
  'blockchain',
  'nft',
  'web3',
  'video-enhancer',
  'video-editing',
  'video-generators',
  'text-to-video',
  'prompt-generators',
  'writing-generators',
  'email-generators',
  'paraphrasing',
  'copywriting',
  'storyteller',
  'summarizer',
  'design-generators',
  'image-generators',
  'image-editing',
  'text-to-image',
  'workflows',
  'ai-agents',
  'cartoon-generators',
  'portrait-generators',
  'avatar-generators',
  'logo-generator',
  '3d-art',
  'audio-editing',
  'text-to-speech',
  'transcriber',
  'music',
  'code-assistant',
  'low-code-no-code',
  'sql',
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log('🔥 Middleware triggered:', pathname)

  if (pathname.startsWith('/ai-tools/')) {
    const slug = pathname.split('/ai-tools/')[1]
    console.log('👉 Extracted slug:', slug)

    if (!slug || slug.includes('/')) {
      console.log('⚠️ Invalid or nested slug, allowing request...')
      return NextResponse.next()
    }

    if (FEATURES.includes(slug)) {
      console.log(`✅ Matched FEATURE: ${slug} → rewriting to /ai-tools/features/${slug}`)
      return NextResponse.rewrite(new URL(`/ai-tools/features/${slug}`, request.url))
    }

    if (CATEGORIES.includes(slug)) {
      console.log(`✅ Matched CATEGORY: ${slug} → serving normally`)
      return NextResponse.next()
    }

    console.log(`❌ Slug "${slug}" not found in FEATURES or CATEGORIES`)
  }

  console.log('➡️ No match, passing request through...')
  return NextResponse.next()
}

export const config = {
  matcher: '/ai-tools/:path*',
}
