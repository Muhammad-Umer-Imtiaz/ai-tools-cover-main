'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiExternalLink } from 'react-icons/fi'

interface Tool {
  _id: string
  name: string
  link: string
  image_url: string
  thumbnail_url: string
  category: string
  pricing: string
  tags: string
  overview: string
}

const FeaturedProduct: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedTools = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/featuredtools`)
        const data = await res.json()
        console.log('Data from Featured Tools', data)
        if (data.success) {
          setTools(data.tools)
        }
      } catch (err) {
        console.error('Error fetching featured tools:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedTools()
  }, [])
  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (loading) {
    return (
      <main className="px-4 md:px-16">
        <h1 className="font-bold text-4xl mt-14 mb-10 px-4 text-black">Featured Tools</h1>
        <p className="px-4">Loading...</p>
      </main>
    )
  }

  return (
    <main className="">
      <h1 className="font-bold text-4xl mt-14 mb-10 px-4 text-black">Featured Tools</h1>
      <section className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-0">
        {tools.map((tool) => (
          <Link key={tool._id} href={`/tool/${createSlug(tool.name)}`}>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 group hover:-translate-y-1 w-full max-w-sm mx-auto h-[280px] sm:h-[320px] lg:h-[340px] flex flex-col">
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#7d42fb]/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <Image
                      src={tool.image_url}
                      alt={tool.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm lg:text-base xl:text-lg text-gray-900 group-hover:text-[#7d42fb] transition-colors truncate">
                      {tool.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Tool Description */}
              <div className="flex-1 flex flex-col min-h-0">
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-shrink-0">
                  {tool.overview}
                </p>

                {/* Tool Tags */}
                <div className="flex flex-wrap gap-1 mb-3 sm:mb-4 flex-shrink-0">
                  {tool.tags
                    ?.split('#') // split on "#"
                    .filter((tag) => tag.trim() !== '') // remove empties
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                {/* Pricing */}
                {tool.pricing && (
                  <div className="mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
                    <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {tool.pricing}
                    </span>
                  </div>
                )}

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100 flex-shrink-0 mt-auto">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      window.open(tool.link, '_blank', 'noopener,noreferrer')
                    }}
                    className="flex items-center gap-1 sm:gap-2 text-[#7d42fb] font-medium hover:text-[#6b35e0] transition-colors text-xs sm:text-sm"
                  >
                    Try Now <FiExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default FeaturedProduct
