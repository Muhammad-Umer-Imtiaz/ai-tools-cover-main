import { NextResponse } from 'next/server'
import { categories } from '@/constants'

export async function GET() {
  // ✅ Apna base URL set karo
  // Production me NEXT_PUBLIC_BASE_URL use hoga, warna localhost
  const baseUrl = 'https://aitoolscover.com'

  // ✅ Sitemap ke liye current date
  const currentDate = new Date().toISOString()

  // ✅ Tools ke naam ko URL-friendly slug me convert karne ka helper function
  const createSlug = (name: string): string =>
    name
      .toLowerCase() // sab lowercase me
      .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric ko `-` me badalna
      .replace(/^-+|-+$/g, '') // starting/ending `-` hata dena

  // ✅ Categories ke liye clean slug function (e.g. "Writing & Editing" -> "writing-editing")
  const createCategorySlug = (label: string): string =>
    label
      .replace(/&/g, '') // ampersand remove
      .replace(/[^\w\s-]/g, '') // special characters remove
      .replace(/\s+/g, '-') // spaces ko `-` me convert
      .replace(/-+/g, '-') // multiple `-` ko ek karna
      .replace(/^-+|-+$/g, '') // start/end hyphen remove
      .toLowerCase() // lowercase me convert

  // ✅ Categories se sitemap URLs generate karna
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

  // ✅ Tools ke URLs yaha store honge
  let toolsUrls = ''

  try {
    console.log('Fetching all tools for sitemap...')

    // ✅ Backend API se tools fetch karna
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/get-all-tools`)

    if (!res.ok) {
      // Agar API response fail ho jaye
      console.error(`Failed to fetch tools: ${res.status}`)
    } else {
      const data = await res.json()
      console.log(`Found ${data.total_results} tools`)

      // ✅ API se aaye tools ko sitemap URLs me convert karna
      const Tools = (data.tool || data.results || [])
        .map((tool: { name: string; createdAt?: string | number | Date }) => {
          // Agar tool ke paas date nahi hai to current date use karna
          const toolDate = tool.createdAt ? new Date(tool.createdAt).toISOString() : currentDate

          return `<url>
            <loc>${baseUrl}/tool/${createSlug(tool.name)}</loc>
            <lastmod>${toolDate}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
          </url>`
        })
        .join('')

      toolsUrls += Tools
    }
  } catch (error: any) {
    // ✅ Agar API call hi fail ho jaye
    console.error('Error fetching tools for sitemap:', error?.message || error)
  }

  // ✅ Static pages ke liye URLs
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

  // ✅ Final Sitemap (static + category + tools sab combine ho gaye)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${categoryUrls}
    ${toolsUrls}
  </urlset>`

  // ✅ Response return karna with correct header
  return new NextResponse(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
