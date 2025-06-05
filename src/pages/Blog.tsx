
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import Footer from "@/components/Footer";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Blockchain Communication",
      excerpt: "Exploring how blockchain technology is revolutionizing secure messaging and digital privacy.",
      author: "Sarah Chen",
      date: "December 5, 2024",
      readTime: "5 min read",
      category: "Technology",
      image: "blog1"
    },
    {
      id: 2,
      title: "Understanding End-to-End Encryption",
      excerpt: "A comprehensive guide to how MoltenArc protects your messages with military-grade encryption.",
      author: "Dr. Alex Rodriguez",
      date: "December 1, 2024",
      readTime: "8 min read",
      category: "Security",
      image: "blog2"
    },
    {
      id: 3,
      title: "Solana vs Arbitrum: Choosing Your Blockchain",
      excerpt: "Comparing the benefits of different blockchain networks for secure messaging applications.",
      author: "Michael Zhang",
      date: "November 28, 2024",
      readTime: "6 min read",
      category: "Blockchain",
      image: "blog3"
    }
  ];

  const categories = ["All", "Technology", "Security", "Blockchain", "Privacy", "Updates"];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <nav className="container mx-auto flex items-center justify-between py-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8A3FFC] to-[#06B6D4] flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-xl font-bold">MoltenArc Blog</h1>
        </div>
      </nav>

      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#3B82F6]/10 text-[#8A3FFC] rounded-full px-6 py-2 border border-[#8A3FFC]/20">
              Latest Insights
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            MoltenArc <span className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest in blockchain technology, security insights, and product updates from the MoltenArc team.
          </p>
        </div>

        {/* Featured Post */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#06B6D4]/10 p-8 rounded-2xl border border-[#8A3FFC]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#8A3FFC] text-white px-3 py-1 rounded-full text-sm">Featured</span>
                  <span className="text-gray-400 text-sm">Technology</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Introducing MoltenArc 2.0: Next-Gen Security</h2>
                <p className="text-gray-300 mb-6">
                  We're excited to announce the launch of MoltenArc 2.0, featuring enhanced blockchain integration, 
                  improved user experience, and revolutionary security features that set new standards for digital privacy.
                </p>
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">MoltenArc Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">December 10, 2024</span>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">
                  Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="bg-[#121218] p-8 rounded-xl border border-gray-800 h-64 flex items-center justify-center">
                <Shield className="h-24 w-24 text-[#8A3FFC]" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-[#121218] rounded-xl border border-gray-800 overflow-hidden hover:border-[#8A3FFC]/30 transition-colors">
                <div className="bg-[#0A0A0A] h-48 flex items-center justify-center">
                  {post.category === "Security" && <Shield className="h-16 w-16 text-[#8A3FFC]" />}
                  {post.category === "Technology" && <Zap className="h-16 w-16 text-[#8A3FFC]" />}
                  {post.category === "Blockchain" && <Globe className="h-16 w-16 text-[#8A3FFC]" />}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#8A3FFC]/20 text-[#8A3FFC] px-2 py-1 rounded text-sm">{post.category}</span>
                    <span className="text-gray-400 text-sm">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{post.author}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{post.date}</span>
                  </div>
                  <Button variant="link" className="text-[#8A3FFC] mt-4 p-0">
                    Read more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mb-16">
          <div className="bg-[#121218] p-8 rounded-xl border border-gray-800 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss important updates about blockchain security, 
              new features, and industry insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#8A3FFC] focus:outline-none"
              />
              <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] px-8">
                Subscribe
              </Button>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              No spam, unsubscribe anytime. Read our privacy policy.
            </p>
          </div>
        </section>

        {/* Popular Tags */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Tags</h2>
          <div className="flex flex-wrap gap-3">
            {["Blockchain", "Encryption", "Privacy", "Security", "Solana", "Arbitrum", "Web3", "Crypto", "Technology", "API"].map((tag) => (
              <span key={tag} className="bg-[#121218] border border-gray-800 px-4 py-2 rounded-full text-gray-300 hover:border-[#8A3FFC]/30 cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
