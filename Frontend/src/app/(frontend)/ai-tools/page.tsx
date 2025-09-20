/* eslint-disable react/no-unescaped-entities */

'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AI_TOOLS_CATEGORIES, AIToolCategory } from '@/constants'
const AIToolsGrid: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const router = useRouter()
  const handleCategoryClick = (categoryId: string) => {
    // Create category slug for navigation
    const categorySlug = categoryId.toLowerCase().replace(/\s+/g, '-')
    console.log(`Navigating to category: ${categorySlug}`)
    // Navigate to the dynamic category page
    router.push(`/ai-tools/${categorySlug}`)
  }
  const handleFeatureClick = (categoryId: string, feature: string, event: React.MouseEvent) => {
    // Prevent event bubbling to category click
    event.stopPropagation()
    // Create feature slug for navigation
    const featureSlug = feature
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    console.log(`Navigating to feature: ${featureSlug}`)
    // Navigate to the specific feature page
    router.push(`/ai-tools/${featureSlug}`)
  }
  const renderToolCard = (category: AIToolCategory) => {
    const isHovered = hoveredCard === category.id
    return (
      <div
        key={category.id}
        className={`
          relative group cursor-pointer
          bg-white rounded-2xl p-0
          shadow-sm border border-gray-100
          transition-all duration-300 ease-out
          hover:shadow-2xl hover:shadow-[#7D42FB]/20 hover:border-[#7D42FB]/30
          hover:-translate-y-2
          overflow-hidden
        `}
        style={{
          borderColor: '#CBD7EA',
          boxShadow: '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d',
        }}
        onMouseEnter={(e) => {
          setHoveredCard(category.id)
          e.currentTarget.style.boxShadow = '0 0 2px 0 #24417a14, 2px 2px 9px 0 #290058'
        }}
        onMouseLeave={(e) => {
          setHoveredCard(null)
          e.currentTarget.style.boxShadow = '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d'
        }}
        onClick={() => handleCategoryClick(category.id)}
      >
        {/* Image Section */}
        <div className="relative w-full h-48 bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 overflow-hidden">
          <Image
            src={category.image}
            alt={category.title}
            width={300}
            height={200}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          {/* Purple gradient overlay on hover */}
          <div
            className={`
            absolute inset-0
            bg-gradient-to-t from-[#7D42FB]/10 via-transparent to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          `}
          />
        </div>
        {/* Content Section */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#7D42FB] transition-colors duration-300">
            {category.title}
          </h3>
          {/* Features List */}
          <div className="space-y-1">
            {category.features.slice(0, 5).map((feature, featureIndex) => (
              <div
                key={featureIndex}
                className={`
                  flex items-center text-sm text-gray-600
                  cursor-pointer hover:text-[#7D42FB]
                  transition-colors duration-200
                  py-1 px-2 rounded-md hover:bg-[#7D42FB]/5
                `}
                onClick={(e) => handleFeatureClick(category.id, feature, e)}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-[#7D42FB] transition-colors duration-300 mr-3 flex-shrink-0" />
                <span className="hover:underline truncate">{feature}</span>
              </div>
            ))}
            {category.features.length > 5 && (
              <div className="text-xs text-gray-500 mt-2 text-center">
                +{category.features.length - 5} more features
              </div>
            )}
          </div>
        </div>
        {/* Inner hover overlay effect */}
        <div
          className={`
          absolute inset-0
          bg-gradient-to-t from-[#7D42FB]/5 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          pointer-events-none
          rounded-2xl
        `}
        />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative w-full bg-[#ECF2FF] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Browse AI Tools by <span className="text-[#7D42FB]">Category</span>
            </h1>
            <p className="text-[#272729] text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              Discover the best AI tools organized by category. Each section shows the top tools to
              help you find exactly what you need for your projects.
            </p>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Image src="/hero1.png" alt="decoration" width={80} height={70} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Image src="/hero5.png" alt="decoration" width={100} height={60} />
        </div>
      </section>
      {/* Grid Container - More compact with max-width container */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {AI_TOOLS_CATEGORIES.map((category) => renderToolCard(category))}
        </div>
      </section>
    </div>
  )
}
export default AIToolsGrid

// ----------------------------------------------------------------------- //
