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

  if (loading) {
    return (
      <main className="px-4 md:px-16">
        <h1 className="font-bold text-4xl mb-10 px-4 text-black">Featured Tools</h1>
        <p className="px-4">Loading...</p>
      </main>
    )
  }

  return (
    <main className="px-4 md:px-16">
      <h1 className="font-bold text-4xl mb-10 px-4 text-black">Featured Tools</h1>
      <section className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {tools.map((product) => (
          <Link key={product._id} href={`/products/${product._id}`}>
            <article
              className="w-full max-w-sm h-[500px] border rounded-3xl mx-auto transition-all"
              style={{
                borderColor: '#cbd7ea',
                boxShadow: '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 2px 0 #24417a14, 2px 2px 9px 0 #290058'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d'
              }}
            >
              <Image
                src={product.thumbnail_url}
                alt={`Featured product: ${product.name}`}
                width={410}
                height={240}
                className="rounded-t-3xl"
              />
              <div className="flex justify-between px-4 mt-5">
                <div className="flex items-center gap-2">
                  <Image
                    src={product.image_url}
                    alt={`${product.name} logo`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <h3 className="font-bold text-black">{product.name}</h3>
                </div>
                <span className="text-[#7d42fb] mt-3">
                  <FiExternalLink size={28} />
                </span>
              </div>
              <p className="px-4 mt-5 text-[#46526a] font-semibold line-clamp-4">
                {product.overview}
              </p>
              <div className="flex gap-3 mt-5 px-4 items-center">
                <span className="bg-[#ecf2ff] px-5 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default FeaturedProduct
