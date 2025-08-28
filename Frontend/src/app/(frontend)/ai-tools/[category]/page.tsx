'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  FiExternalLink,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  FaHeart,
  FaBrain,
  FaRobot,
  FaCalendarAlt,
  FaFileAlt,
  FaPuzzlePiece,
  FaChartBar,
} from 'react-icons/fa';
import { AI_TOOLS_CATEGORIES } from '@/constants';
import toast from 'react-hot-toast';

interface Tool {
  _id: number;
  name: string;
  description: string;
  image_url?: string;
  thumbnail_url: string;
  category: string;
  click_count: number;
  link?: string;
  views?: string;
}

const useFavorites = () => {
  const [favorites, setFavorites] = useState<Tool[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favoriteTools');
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch {
          localStorage.removeItem('favoriteTools');
        }
      }
    }
  }, []);

  const addToFavorites = (tool: Tool) => {
    const updated = [...favorites, tool];
    setFavorites(updated);
    localStorage.setItem('favoriteTools', JSON.stringify(updated));
    toast.success(`${tool.name} added to favorites!`);
  };

  const removeFromFavorites = (toolId: number) => {
    const toolToRemove = favorites.find(t => t._id === toolId);
    const updated = favorites.filter(t => t._id !== toolId);
    setFavorites(updated);
    localStorage.setItem('favoriteTools', JSON.stringify(updated));
    toast.success(`${toolToRemove?.name} removed from favorites!`);
  };

  const isFavorite = (toolId: number) => favorites.some(t => t._id === toolId);

  const toggleFavorite = (tool: Tool) =>
    isFavorite(tool._id) ? removeFromFavorites(tool._id) : addToFavorites(tool);

  return { favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite };
};

interface HeartButtonProps {
  tool: Tool;
  isFavorite: boolean;
  onToggle: (tool: Tool) => void;
}

const HeartButton: React.FC<HeartButtonProps> = ({ tool, isFavorite, onToggle }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    onToggle(tool);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 bg-white/80 shadow-sm hover:shadow-md ${
        isAnimating ? 'animate-pulse' : ''
      } ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? <FaHeart size={18} /> : <FiHeart size={18} />}
    </button>
  );
};

interface ToolsSliderProps {
  tools: Tool[];
}

const ToolsSlider: React.FC<ToolsSliderProps> = ({ tools }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();
  const itemsPerPage = 3;
  const totalPages = Math.ceil(tools.length / itemsPerPage);

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % totalPages);
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + totalPages) % totalPages);

  const getCurrentTools = () =>
    tools.slice(currentIndex * itemsPerPage, currentIndex * itemsPerPage + itemsPerPage);

  const storeProductData = (tool: Tool) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`product_${tool._id}`, JSON.stringify(tool));
    }
  };

  const createSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  return (
    <div className="relative">
      {totalPages > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full ${
              currentIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-[#7d42fb]'
            }`}
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === totalPages - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full ${
              currentIndex === totalPages - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-[#7d42fb]'
            }`}
          >
            <FiChevronRight size={20} />
          </button>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {getCurrentTools().map(tool => (
          <Link key={tool._id} href={`/ai-tools/${createSlug(tool.name)}`} onClick={() => storeProductData(tool)}>
            <div className="bg-white rounded-2xl shadow-lg p-6 relative group cursor-pointer">
              <div className="absolute top-3 right-3">
                <HeartButton tool={tool} isFavorite={isFavorite(tool._id)} onToggle={toggleFavorite} />
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {tool.image_url ? (
                    <img src={tool.image_url} alt={tool.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="w-full h-full bg-[#7d42fb] rounded-xl flex items-center justify-center text-white font-bold text-xs">
                      AI
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate flex items-center gap-1">
                    {tool.name} <FiExternalLink size={14} className="text-[#7d42fb]" />
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{tool.category}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 overflow-hidden line-clamp-4">{tool.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                <span>👁️ {tool.views || '2.1k'} views</span>
                <span>🔗 {tool.click_count || 150} clicks</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// AICategoryGuide component (cleaned & typed)
interface CategoryData {
  title: string;
  detailedDescription: string;
  keyFeatures: string[];
  targetUsers: string[];
  useCases: string[];
  selectionCriteria: string[];
}

const AICategoryGuide: React.FC<{ categoryData: CategoryData }> = ({ categoryData }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const icons = [FaBrain, FaRobot, FaCalendarAlt, FaFileAlt, FaPuzzlePiece, FaChartBar];

  return (
    <section className="bg-gradient-to-br from-[#ecf2ff] via-white to-[#f8faff] py-5">
      <div className="max-w-6xl mx-auto px-6 mt-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Is an <span className="text-[#7d42fb]">{categoryData.title}?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{categoryData.detailedDescription}</p>
        </div>
      </div>
    </section>
  );
};

// Main CategoryPage
const CategoryPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const slug = path.split('/ai-tools/')[1];
    if (slug) {
      const cat = AI_TOOLS_CATEGORIES.find(c => c.id.toLowerCase().replace(/\s+/g, '-') === slug);
      if (cat) setCategoryData(cat as CategoryData);
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!categoryData) return <div className="min-h-screen flex items-center justify-center">Category Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <AICategoryGuide categoryData={categoryData} />
      </section>
    </div>
  );
};

export default CategoryPage;
