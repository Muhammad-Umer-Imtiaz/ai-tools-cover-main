import { NextResponse } from 'next/server'
import { categories } from '@/constants'

export async function GET() {
  const baseUrl = 'https://aitoolscover.com'
  const currentDate = new Date().toISOString()

  // Helper to create URL-friendly slugs for tools
  const createSlug = (name: string): string =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  // Helper to create category slugs
  const createCategorySlug = (label: string): string =>
    label
      .replace(/&/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()

  // Generate category URLs
  const categoryUrls = categories
    .map(
      (category) => `<url>
        <loc>${baseUrl}/category/${createCategorySlug(category.label)}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>`,
    )
    .join('')

  let toolsUrls = ''

  try {
    console.log('Fetching all tools for sitemap...')

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/get-all-tools`)

    if (!res.ok) {
      console.error(`Failed to fetch tools: ${res.status}`)
    } else {
      const data = await res.json()
      const allTools = data.tool || data.results || []

      if (allTools.length === 0) console.log('No tools found for sitemap')

      // Filter out tools without a valid name
      const validTools = allTools.filter(
        (tool: { name?: string }) => tool.name && tool.name.trim() !== '',
      )

      toolsUrls = validTools
        .map((tool: { name: string; createdAt?: string | number | Date }) => {
          const toolDate = tool.createdAt ? new Date(tool.createdAt).toISOString() : currentDate
          return `<url>
            <loc>${baseUrl}/tool/${createSlug(tool.name)}</loc>
            <lastmod>${toolDate}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
          </url>`
        })
        .join('')

      console.log(`Found ${validTools.length} valid tools for sitemap`)
    }
  } catch (error: any) {
    console.error('Error fetching tools for sitemap:', error?.message || error)
  }

  // Static pages
  const staticUrls = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/category', priority: '0.7', changefreq: 'weekly' },
    { path: '/ai-agents', priority: '0.7', changefreq: 'weekly' },
    { path: '/ai-tools', priority: '0.7', changefreq: 'weekly' },
    { path: '/gpts', priority: '0.7', changefreq: 'weekly' },
    { path: '/prompts', priority: '0.7', changefreq: 'weekly' },
    { path: '/top-picks', priority: '0.7', changefreq: 'weekly' },
    { path: '/login', priority: '0.7', changefreq: 'monthly' },
    { path: '/signup', priority: '0.7', changefreq: 'monthly' },
    { path: '/favorites', priority: '0.7', changefreq: 'weekly' },
    { path: '/submit', priority: '0.7', changefreq: 'monthly' },
    { path: '/privacy-policy', priority: '0.7', changefreq: 'yearly' },
    { path: '/terms', priority: '0.7', changefreq: 'yearly' },
  ]
    .map(
      ({ path, priority, changefreq }) => `<url>
        <loc>${baseUrl}${path}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
      </url>`,
    )
    .join('')

  // Combine all URLs
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${categoryUrls}
    ${toolsUrls}
  </urlset>`

  return new NextResponse(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
