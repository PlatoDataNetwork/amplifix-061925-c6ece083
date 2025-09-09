
import { Button } from "@/components/ui/button";
import { User, Calendar, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedPost = () => {
  return (
    <section className="mb-16">
      <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#06B6D4]/10 p-8 rounded-2xl border border-[#8A3FFC]/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#8A3FFC] text-white px-3 py-1 rounded-full text-sm">Featured</span>
              <span className="text-gray-400 text-sm">Technology</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Introducing AmplifiX 2.0: Next-Gen AI Intelligence</h2>
            <p className="text-gray-300 mb-6">
              We're excited to announce the launch of AmplifiX 2.0, featuring enhanced AI capabilities, 
              improved analytics, and revolutionary intelligence features that set new standards for corporate communications.
            </p>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">AmplifiX</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Sept 1, 2025</span>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]" asChild>
              <Link to="/blog/amplifi-x-2-0-article">
                Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="bg-[#121218] p-8 rounded-xl border border-gray-800 h-64 flex items-center justify-center">
            <Shield className="h-24 w-24 text-[#8A3FFC]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPost;
