'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { FiSearch, FiCalendar, FiEye, FiClock } from 'react-icons/fi'
import { FaBlog, FaFire } from 'react-icons/fa'
import debounce from 'lodash/debounce' // Assuming lodash is installed; if not, implement a simple debounce

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('')
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounced search setter
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value)
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSetSearchTerm(value)
  }

  // Fetch posts from API (with caching enabled for subsequent loads)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setError(null)
        // Check cache first
        if (typeof window !== 'undefined') {
          const cached = sessionStorage.getItem('posts')
          if (cached) {
            const parsed = JSON.parse(cached)
            if (Array.isArray(parsed)) {
              setBlogs(parsed)
              setLoading(false)
              return // Use cache if valid
            }
          }
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/posts`, {
          next: { revalidate: 3600 }, // ISR-like revalidation every hour
        })
        console.log(res)
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)

        const data = await res.json()
        console.log('API full response:', data)

        const posts = data.posts || data.data || data || []
        if (Array.isArray(posts)) {
          setBlogs(posts)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('posts', JSON.stringify(posts))
          }
        } else {
          console.error('Unexpected response shape:', data)
          setBlogs([])
          setError('Unexpected data format received from server')
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch posts')
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Memoized excerpt function
  const getExcerpt = useCallback((content: any) => {
    try {
      // Handle different content structures
      if (typeof content === 'string') {
        return content.slice(0, 150) + (content.length > 150 ? '...' : '')
      }

      const firstParagraph = content?.root?.children?.find(
        (child: any) => child.type === 'paragraph' || child.children?.some((c: any) => c.text),
      )

      if (firstParagraph?.children) {
        const text = firstParagraph.children
          .map((child: any) => child.text || '')
          .join('')
          .slice(0, 150)
        return text + (text.length === 150 ? '...' : '')
      }

      return 'Read this amazing blog post to learn more...'
    } catch {
      return 'Read this amazing blog post to learn more...'
    }
  }, [])

  // Memoized date formatter
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Date unavailable'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'Date unavailable'
    }
  }, [])

  // Memoized reading time function
  const getReadingTime = useCallback((content: any) => {
    try {
      let wordCount = 0

      if (typeof content === 'string') {
        wordCount = content.split(' ').length
      } else {
        const traverse = (node: any) => {
          if (node.text) wordCount += node.text.split(' ').length
          if (node.children) node.children.forEach(traverse)
        }
        traverse(content?.root)
      }

      return Math.max(1, Math.ceil(wordCount / 200))
    } catch {
      return 3
    }
  }, [])

  // Memoized filtered blogs
  const filteredBlogs = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return blogs

    const searchLower = debouncedSearchTerm.toLowerCase().trim()
    return blogs.filter((blog) => {
      const titleMatch = blog.title?.toLowerCase().includes(searchLower) || false
      const contentMatch = getExcerpt(blog.content).toLowerCase().includes(searchLower)

      return titleMatch || contentMatch
    })
  }, [blogs, debouncedSearchTerm, getExcerpt])

  // Memoized blog cards data (pre-compute excerpts, dates, etc.)
  const processedBlogs = useMemo(() => {
    return filteredBlogs.map((blog) => ({
      ...blog,
      excerpt: getExcerpt(blog.content),
      formattedDate: formatDate(blog.publishedAt || blog.createdAt),
      readingTime: getReadingTime(blog.content),
    }))
  }, [filteredBlogs, getExcerpt, formatDate, getReadingTime])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">Error loading blogs</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6" style={{ color: '#7d42fb' }}>
          <FaFire className="animate-pulse" />
          <span className="text-sm font-medium">Latest Articles</span>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7d42fb, #a855f7)' }}
            >
              <FaBlog className="text-white text-2xl" />
            </div>
            <h1
              className="text-4xl lg:text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #7d42fb, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Our Blog
            </h1>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 mb-10">
          <div className="flex items-center relative">
            <FiSearch className="absolute left-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          {debouncedSearchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              {processedBlogs.length} article{processedBlogs.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {/* Blog Grid */}
        {processedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedBlogs.map((blog, index) => (
              <article
                key={blog._id || blog.id || index}
                className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:scale-105"
              >
                <div className="relative h-48">
                  <img
                    src={blog.heroImage?.cloudinary_url}
                    alt={blog.title || 'Blog post'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading={index > 3 ? 'lazy' : 'eager'} // Lazy load non-visible images
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      {blog._status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">
                    {blog.title || 'Untitled Post'}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {blog.formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock size={12} /> {blog.readingTime} min read
                      </span>
                    </div>
                  </div>
                  <Link href={`/blogs/${blog._id || blog.id}`} className="block">
                    <button
                      className="w-full text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300"
                      style={{ background: 'linear-gradient(135deg, #7d42fb, #a855f7)' }}
                    >
                      <FiEye size={16} /> Read Article
                    </button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          // No blogs at all
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <p className="text-gray-600 text-lg mb-2">No articles available</p>
            <p className="text-gray-500">Check back later for new content!</p>
          </div>
        ) : (
          // No blogs match search
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg mb-2">No articles found matching "{debouncedSearchTerm}"</p>
            <p className="text-gray-500 mb-4">Try adjusting your search terms</p>
            <button
              onClick={() => {
                setSearchTerm('')
                debouncedSetSearchTerm('')
              }}
              className="text-purple-600 hover:text-purple-700 underline font-medium"
            >
              Show all articles
            </button>
          </div>
        )}
      </div>
    </main>
  )
}