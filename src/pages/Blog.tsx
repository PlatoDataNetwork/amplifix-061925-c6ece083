
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";
import FeaturedPost from "@/components/FeaturedPost";
import BlogPostCard from "@/components/BlogPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import RSSFeed from "@/components/RSSFeed";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI-Powered Corporate Intelligence",
      excerpt: "Exploring how artificial intelligence is revolutionizing investor relations and corporate communications.",
      author: "Sarah Chen",
      date: "December 5, 2024",
      readTime: "5 min read",
      category: "Technology",
      image: "blog1"
    },
    {
      id: 2,
      title: "Advanced Analytics for Better Decision Making",
      excerpt: "A comprehensive guide to how AmplifiX empowers companies with data-driven insights.",
      author: "Dr. Alex Rodriguez",
      date: "December 1, 2024",
      readTime: "8 min read",
      category: "Analytics",
      image: "blog2"
    },
    {
      id: 3,
      title: "Maximizing Investor Engagement Through AI",
      excerpt: "Best practices for leveraging artificial intelligence to enhance investor relations and communications.",
      author: "Michael Zhang",
      date: "November 28, 2024",
      readTime: "6 min read",
      category: "Technology",
      image: "blog3"
    }
  ];

  const categories = ["All", "Technology", "Analytics", "Security", "Insights", "Updates"];
  const popularTags = ["AI", "Analytics", "Investor Relations", "Corporate Communications", "Intelligence", "Automation", "Data", "Insights", "Technology", "Innovation"];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <MainHeader />

      <div className="pt-24 container mx-auto py-8 md:py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#3B82F6]/10 text-[#8A3FFC] rounded-full px-4 md:px-6 py-2 border border-[#8A3FFC]/20 text-sm md:text-base">
              Latest Intelligence
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            AmplifiX <span className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] bg-clip-text text-transparent">Intel</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Stay updated with the latest in AI intelligence, corporate communications insights, and product updates from the AmplifiX team.
          </p>
        </div>

        <FeaturedPost />

        {/* Categories */}
        <section className="mb-8 md:mb-12">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={category === "All" ? "bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-xs md:text-sm" : "text-xs md:text-sm"}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <NewsletterSignup />

        {/* Popular Tags */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6">Popular Tags</h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {popularTags.map((tag) => (
              <span key={tag} className="bg-[#121218] border border-gray-800 px-3 py-2 rounded-full text-gray-300 hover:border-[#8A3FFC]/30 cursor-pointer transition-colors text-xs md:text-sm">
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
