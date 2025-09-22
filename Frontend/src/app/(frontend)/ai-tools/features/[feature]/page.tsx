'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { AI_TOOLS_FEATURES, AIToolFeatures } from '@/constants'
import Link from 'next/link'
import {
  FiExternalLink,
  FiHeart,
  FiStar,
  FiFilter,
  FiUsers,
  FiTarget,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface AITool {
  _id: number
  name: string
  overview: string
  image_url: string
  thumbnail_url: string
  category: string
  click_count: number
  link: string
  views: number
  rating: number
  pricing: string
  tags: string
  description: string
  created_at: string
  is_approved: boolean
  developer: string
  submitted_by: string | null
}

interface ProductTool {
  _id: number
  name: string
  link: string
  image_url: string
  thumbnail_url: string
  description: string
  overview: string
  tags: string
  created_at: string
  is_approved: boolean
  click_count: number
  views: number
  developer: string | null
  category: string
  submitted_by: string | null
  key_features?: string
  what_you_can_do_with?: string
  benefits?: string
  pricing_plans?: string
  tips_best_practices?: string
  final_take?: string
}

interface PaginationData {
  currentPage: number
  totalPages: number
  totalTools: number
  toolsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
}

// Favorites Hook
const useFavorites = () => {
  const [favorites, setFavorites] = useState<AITool[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favoriteTools')
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites))
        } catch (error) {
          console.error('Error parsing saved favorites:', error)
          localStorage.removeItem('favoriteTools')
        }
      }
    }
  }, [])

  const addToFavorites = (tool: any) => {
    const updatedFavorites = [...favorites, tool]
    setFavorites(updatedFavorites)
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteTools', JSON.stringify(updatedFavorites))
    }

    toast.success(`${tool.name || 'Tool'} added to favorites!`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#7d42fb',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '10px 15px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    })
  }

  const removeFromFavorites = (toolId: number) => {
    const toolToRemove = favorites.find((tool) => tool._id === toolId)

    const updatedFavorites = favorites.filter((tool) => tool._id !== toolId)
    setFavorites(updatedFavorites)
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteTools', JSON.stringify(updatedFavorites))
    }

    toast.success(`${toolToRemove?.name || 'Tool'} removed from favorites!`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#7d42fb',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '10px 15px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    })
  }

  const isFavorite = (toolId: number) => {
    return favorites.some((tool) => tool._id === toolId)
  }

  const toggleFavorite = (tool: { _id: number }) => {
    if (isFavorite(tool._id)) {
      removeFromFavorites(tool._id)
    } else {
      addToFavorites(tool)
    }
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  }
}

// Heart Button Component
interface HeartButtonProps {
  tool: any
  isFavorite: boolean
  onToggle: (tool: any) => void
}

const HeartButton: React.FC<HeartButtonProps> = ({ tool, isFavorite, onToggle }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)
    onToggle(tool)

    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
        isAnimating ? 'animate-pulse' : ''
      } ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? <FaHeart size={18} className="drop-shadow-sm" /> : <FiHeart size={18} />}
    </button>
  )
}

const FeaturePage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [featureData, setFeatureData] = useState<AIToolFeatures | null>(null)
  const [tools, setTools] = useState<AITool[]>([])
  const [sortBy, setSortBy] = useState('popularity')
  const [filterBy, setFilterBy] = useState('all')
  const [displayedProducts, setDisplayedProducts] = useState<ProductTool[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [paginationLoading, setPaginationLoading] = useState(false)

  // Initialize favorites functionality
  const { isFavorite, toggleFavorite } = useFavorites()

  const storeProductData = (product: ProductTool): void => {
    if (typeof window !== 'undefined') {
      try {
        const productData = {
          _id: product._id.toString(),
          name: product.name,
          image: product.image_url,
          thumbnail: product.thumbnail_url,
          overview: product.overview || '',
          logo: product.image_url,
          description: product.description,
          tag: product.category,
          tagIcon: '',
          link: product.link,
          key_features: product.key_features || '',
          what_you_can_do_with: product.what_you_can_do_with || '',
          benefits: product.benefits || '',
          pricing_plans: product.pricing_plans || '',
          tips_best_practices: product.tips_best_practices || '',
          final_take: product.final_take || '',
        }
        console.log(product._id)
        sessionStorage.setItem(`product_${product._id}`, JSON.stringify(productData))
      } catch (error) {
        console.error('Error storing product data:', error)
      }
    }
  }

  const apiCall = async (slug: string, page: number = 1) => {
    if (page === 1) {
      setLoading(true)
    } else {
      setPaginationLoading(true)
    }

    try {
      console.log('Trying to hit API for page:', page)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/toolfeature?q=${slug}&page=${page}&limit=12`,
      )

      if (res.ok) {
        console.log('API hit successfully')
        const data = await res.json()
        console.log(data)

        if (data?.data?.tools) {
          setTools(data.data.tools)
          setDisplayedProducts(data.data.tools)
          setPagination(data.data.pagination)

          // Store in sessionStorage (optional - you might want to modify this logic)
          const existing = JSON.parse(sessionStorage.getItem('displayedProducts') || '[]')
          const merged = [...existing, ...data.data.tools]
          const unique = merged.filter(
            (item, index, self) => index === self.findIndex((t) => t._id === item._id),
          )
          sessionStorage.setItem('displayedProducts', JSON.stringify(unique))
        }
      } else {
        console.error('Failed to fetch tools, status:', res.status)
        toast.error('Failed to load tools')
      }
    } catch (error) {
      console.error('API call failed:', error)
      toast.error('Failed to load tools')
    } finally {
      setLoading(false)
      setPaginationLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page === currentPage || paginationLoading) return

    setCurrentPage(page)
    const featureSlug = pathname ? pathname.split('/').pop() : ''
    if (featureSlug) {
      apiCall(featureSlug, page)
      // Scroll to top of tools section
      document.querySelector('#tools-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const featureSlug = pathname ? pathname.split('/').pop() : ''
    console.log('Feature Slug:', featureSlug)

    const matchedFeature = AI_TOOLS_FEATURES.find((feature) => feature.id === featureSlug)
    console.log('Matched Feature:', matchedFeature)

    if (matchedFeature) {
      setFeatureData(matchedFeature)
      setCurrentPage(1) // Reset to page 1
      if (featureSlug) {
        apiCall(featureSlug, 1)
      }
    }
  }, [pathname])

  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const getSortedAndFilteredTools = () => {
    if (!tools.length) return []

    let filteredTools = [...tools]

    // Filter by pricing
    if (filterBy !== 'all') {
      filteredTools = filteredTools.filter((tool) => {
        if (filterBy === 'free') return tool.pricing === 'Free'
        if (filterBy === 'paid') return tool.pricing !== 'Free'
        return true
      })
    }

    // Sort tools
    switch (sortBy) {
      case 'popularity':
        return filteredTools.sort((a, b) => b.click_count - a.click_count)
      case 'rating':
        return filteredTools.sort((a, b) => b.rating - a.rating)
      case 'name':
        return filteredTools.sort((a, b) => a.name.localeCompare(b.name))
      case 'newest':
        return filteredTools.sort((a, b) => b._id - a._id)
      default:
        return filteredTools
    }
  }

  // Pagination component
  const PaginationComponent = () => {
    if (!pagination || pagination.totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages = []
      const maxVisiblePages = 5
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      return pages
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage || paginationLoading}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
            pagination.hasPrevPage && !paginationLoading
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiChevronLeft size={16} />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={paginationLoading}
              className={`w-10 h-10 rounded-lg border transition-colors ${
                page === currentPage
                  ? 'bg-[#7d42fb] text-white border-[#7d42fb]'
                  : paginationLoading
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage || paginationLoading}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
            pagination.hasNextPage && !paginationLoading
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
          <FiChevronRight size={16} />
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d42fb] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feature tools...</p>
        </div>
      </div>
    )
  }

  if (!featureData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature Not Found</h1>
          <p className="text-gray-600 mb-6">The feature you're looking for doesn't exist.</p>
          <Link
            href="/ai-tools"
            className="bg-[#7d42fb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6b35e0] transition-colors"
          >
            Back to AI Tools
          </Link>
        </div>
      </div>
    )
  }

  const sortedTools = getSortedAndFilteredTools()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative w-full bg-[#ecf2ff] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-black">
                {featureData.mainHeading || `⚡ Best ${featureData.title} AI Tools`}
              </h1>
            </div>
            <p className="text-[#272729] text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              {featureData.introText ||
                `${featureData.description}. Discover the most powerful AI-powered ${featureData.title.toLowerCase()} tools to enhance your workflow, boost productivity, and achieve better results.`}
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#7d42fb]">
              Home
            </Link>
            <span>/</span>
            <Link href="/ai-tools" className="hover:text-[#7d42fb]">
              AI Tools
            </Link>
            <span>/</span>
            <span className="text-[#7d42fb] font-semibold">{featureData.title}</span>
          </nav>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Image src="/hero1.png" alt="decoration" width={80} height={70} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Image src="/hero5.png" alt="decoration" width={100} height={60} />
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools-section" className="max-w-7xl mx-auto px-6 py-16">
        {/* Filters and Sort */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                All {featureData.title} Tools
              </h2>
              <p className="text-gray-600">
                {pagination ? (
                  <>
                    Showing {(currentPage - 1) * 12 + 1}-
                    {Math.min(currentPage * 12, pagination.totalTools)} of {pagination.totalTools}{' '}
                    AI-powered {featureData.title.toLowerCase()} tools
                  </>
                ) : (
                  `${sortedTools.length} AI-powered ${featureData.title.toLowerCase()} tools to choose from`
                )}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Filter Dropdown */}
              <div className="relative text-black">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-[#7d42fb] focus:border-transparent"
                >
                  <option value="all">All Tools</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid Only</option>
                </select>
                <FiFilter
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative text-black">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-[#7d42fb] focus:border-transparent"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Alphabetical</option>
                  <option value="newest">Newest</option>
                </select>
                <FiExternalLink
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading overlay for pagination */}
        <div className="relative">
          {paginationLoading && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7d42fb] mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Loading more tools...</p>
              </div>
            </div>
          )}

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTools.map((tool) => (
              <Link
                key={tool._id}
                href={`/tool/${createSlug(tool.name)}`}
                onClick={() => storeProductData(tool)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1 relative">
                  {/* Favorites Heart Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <HeartButton
                      tool={tool}
                      isFavorite={isFavorite(tool._id)}
                      onToggle={toggleFavorite}
                    />
                  </div>

                  {/* Tool Header */}
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-[#7d42fb]/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={tool.image_url}
                          alt={tool.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-lg text-gray-900 group-hover:text-[#7d42fb] transition-colors truncate"
                          title={tool.name}
                        >
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FiStar
                                key={i}
                                size={12}
                                className={i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">4/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tool Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {tool.overview}
                  </p>

                  {/* Tool Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.tags
                      ?.split('#')
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        tool.pricing === 'Free'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tool.pricing}
                    </span>
                  </div>

                  {/* Tool Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                      href={tool.link}
                      className="flex items-center gap-2 text-[#7d42fb] font-medium hover:text-[#6b35e0] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Try Now <FiExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pagination Component */}
        <PaginationComponent />

        {/* No Results */}
        {sortedTools.length === 0 && !loading && !paginationLoading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={() => {
                setFilterBy('all')
                setSortBy('popularity')
              }}
              className="bg-[#7d42fb] text-white px-6 py-2 rounded-lg hover:bg-[#6b35e0] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Feature Content Sections */}
      {featureData.capabilities && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🚀 Key Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureData.capabilities.map((capability, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-[#7d42fb]/5 rounded-lg"
                >
                  <FiCheckCircle className="text-[#7d42fb] mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Target Audience Section */}
      {featureData.targetAudience && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              <FiUsers className="inline-block mr-2 text-[#7d42fb]" />
              Who Can Benefit?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureData.targetAudience.map((audience, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-gradient-to-br from-[#7d42fb]/5 to-[#7d42fb]/10 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{audience.icon || '👤'}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{audience.title}</h3>
                  <p className="text-gray-600 text-sm">{audience.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How to Choose Section */}
      {featureData.howToChoose && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              <FiTarget className="inline-block mr-2 text-[#7d42fb]" />
              How to Choose the Right Tool
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureData.howToChoose.map((criterion, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-[#7d42fb] transition-colors"
                >
                  <div className="text-2xl flex-shrink-0">{criterion.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize mb-1">
                      {criterion.criterion}
                    </h4>
                    <p className="text-gray-600 text-sm">{criterion.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Categories Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore More AI Tools</h3>
          <p className="text-gray-600 mb-8">
            Discover other powerful AI tools across different categories
          </p>
          <Link
            href="/ai-tools"
            className="inline-flex items-center gap-2 bg-[#7d42fb] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6b35e0] transition-colors shadow-lg hover:shadow-xl"
          >
            View All Categories
            <FiExternalLink size={16} />
          </Link>
        </div>
      </section>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default FeaturePage