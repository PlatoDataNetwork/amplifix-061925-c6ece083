
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BlogHeader = () => {
  return (
    <nav className="container mx-auto flex items-center justify-between py-6 border-b border-border">
      <Link to="/" className="flex items-center gap-2">
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Home</span>
      </Link>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8A3FFC] to-[#06B6D4] flex items-center justify-center">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <h1 className="text-xl font-bold">AmplifiX Intel</h1>
      </div>
    </nav>
  );
};

export default BlogHeader;
