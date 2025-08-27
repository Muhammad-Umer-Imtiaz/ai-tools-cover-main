'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiCalendar, FiClock, FiArrowLeft, FiUser } from 'react-icons/fi';
import { FaBlog } from 'react-icons/fa';

interface BlogPost {
  _id: string;
  title: string;
  content: any;
  image_url: string;
  publishedAt: string;
  _status: string;
  author?: string;
}

const Page = () => {
  const params = useParams<{ id: string }>();
  const blogId = params?.id as string;
  const router = useRouter();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogPost = async (id: string) => {
      try {
        const cachedPosts = sessionStorage.getItem("posts");
        if (cachedPosts) {
          const posts = JSON.parse(cachedPosts);
          const foundPost = posts.find((post: BlogPost) => post._id === id);
          if (foundPost) {
            setBlog(foundPost);
            setLoading(false);
            return;
          }
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/posts/${id}`,
          { cache: 'no-store' }
        );

        if (!res.ok) throw new Error(`Blog post not found: ${res.status}`);
        const data = await res.json();
        setBlog(data.data || data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (blogId) fetchBlogPost(blogId);
  }, [blogId]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const getReadingTime = (content: any) => {
    try {
      let wordCount = 0;
      const traverse = (node: any) => {
        if (node.text) wordCount += node.text.split(' ').length;
        if (node.children) node.children.forEach(traverse);
      };
      traverse(content?.root);
      return Math.max(1, Math.ceil(wordCount / 200));
    } catch {
      return 3;
    }
  };

  const renderContent = (content: any) => {
    if (!content?.root?.children) {
      return <p className="text-gray-600">Content not available</p>;
    }

    return content.root.children.map((node: any, index: number) => {
      switch (node.type) {
        case 'paragraph':
          return (
            <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">
              {node.children?.map((child: any, childIndex: number) => {
                if (child.bold) return <strong key={childIndex}>{child.text}</strong>;
                if (child.italic) return <em key={childIndex}>{child.text}</em>;
                if (child.underline) return <u key={childIndex}>{child.text}</u>;
                return child.text;
              })}
            </p>
          );
        case 'heading': {
          const level = node.level || 2;
          const headingText = node.children?.map((child: any) => child.text).join('');
          const baseClasses = "font-bold mb-4 mt-8 text-gray-900";
          
          if (level === 1) {
            return (
              <h1 key={index} className={`${baseClasses} text-4xl`}>
                {headingText}
              </h1>
            );
          } else if (level === 2) {
            return (
              <h2 key={index} className={`${baseClasses} text-3xl`}>
                {headingText}
              </h2>
            );
          } else if (level === 3) {
            return (
              <h3 key={index} className={`${baseClasses} text-2xl`}>
                {headingText}
              </h3>
            );
          } else if (level === 4) {
            return (
              <h4 key={index} className={`${baseClasses} text-xl`}>
                {headingText}
              </h4>
            );
          } else if (level === 5) {
            return (
              <h5 key={index} className={`${baseClasses} text-lg`}>
                {headingText}
              </h5>
            );
          } else {
            return (
              <h6 key={index} className={`${baseClasses} text-base`}>
                {headingText}
              </h6>
            );
          }
        }
        case 'list': {
          const ListTag = node.format === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index} className="list-inside list-disc mb-6 ml-4 text-gray-700">
              {node.children?.map((listItem: any, listIndex: number) => (
                <li key={listIndex}>
                  {listItem.children?.map((child: any) => child.text).join('')}
                </li>
              ))}
            </ListTag>
          );
        }
        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-purple-500 pl-6 py-4 mb-6 bg-purple-50 italic text-gray-700 rounded-r-lg">
              {node.children?.map((child: any) => child.text).join('')}
            </blockquote>
          );
        case 'code':
          return (
            <pre key={index} className="bg-gray-900 text-green-400 p-4 rounded-xl mb-6 overflow-x-auto shadow-lg">
              <code>{node.children?.map((child: any) => child.text).join('')}</code>
            </pre>
          );
        default:
          return (
            <div key={index} className="mb-4 text-gray-700">
              {node.children?.map((child: any) => child.text).join('') || ''}
            </div>
          );
      }
    });
  };

  const handleBackToBlogs = () => router.push('/blogs');

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested article could not be found.'}</p>
          <button
            onClick={handleBackToBlogs}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Articles
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={handleBackToBlogs}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <FiArrowLeft /> Back to Articles
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={blog.image_url} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
              {blog._status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Article Header */}
          <header className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7d42fb, #a855f7)' }}
              >
                <FaBlog className="text-white text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} /> {formatDate(blog.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock size={14} /> {getReadingTime(blog.content)} min read
                  </span>
                  {blog.author && (
                    <span className="flex items-center gap-1">
                      <FiUser size={14} /> {blog.author}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <h1 
              className="text-3xl lg:text-4xl font-bold mb-4 leading-snug"
              style={{
                background: 'linear-gradient(135deg, #7d42fb, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {blog.title}
            </h1>
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            {renderContent(blog.content)}
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Published on {formatDate(blog.publishedAt)}</span>
              </div>
              <button
                onClick={handleBackToBlogs}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <FiArrowLeft size={16} /> Back to Articles
              </button>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
};

export default Page;