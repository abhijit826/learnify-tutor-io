
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Video, FileText, ExternalLink, Star, Play, Download, BookmarkPlus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  type: string;
  description: string;
  icon: JSX.Element;
  link: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
  tags: string[];
  downloads?: number;
  views?: number;
}

const Resources = () => {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
  const { toast } = useToast();

  const resources: Resource[] = [
    {
      id: "1",
      title: "Algebra Fundamentals",
      type: "Video Course",
      description: "Master the basics of algebra with our comprehensive video series",
      icon: <Video className="w-6 h-6" />,
      link: "#",
      difficulty: "Beginner",
      duration: "2.5 hours",
      tags: ["algebra", "basics", "equations"],
      views: 1234
    },
    {
      id: "2",
      title: "Geometry Handbook",
      type: "PDF Guide",
      description: "Complete guide to geometric concepts and problem-solving techniques",
      icon: <FileText className="w-6 h-6" />,
      link: "#",
      difficulty: "Intermediate",
      tags: ["geometry", "shapes", "formulas"],
      downloads: 567
    },
    {
      id: "3",
      title: "Calculus Practice Problems",
      type: "Interactive",
      description: "Collection of calculus problems with step-by-step solutions",
      icon: <BookOpen className="w-6 h-6" />,
      link: "#",
      difficulty: "Advanced",
      tags: ["calculus", "practice", "derivatives"],
      views: 890
    }
  ];

  const handleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => {
      const newBookmarks = prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId];
      
      toast({
        title: prev.includes(resourceId) ? "Bookmark Removed" : "Bookmark Added",
        description: prev.includes(resourceId) 
          ? "Resource removed from your bookmarks"
          : "Resource added to your bookmarks",
        className: prev.includes(resourceId) 
          ? "bg-yellow-50 text-yellow-900"
          : "bg-green-50 text-green-900",
      });
      
      return newBookmarks;
    });
  };

  const handleResourceAction = (resource: Resource) => {
    if (resource.type === "PDF Guide") {
      toast({
        title: "Download Started",
        description: "Your PDF is being downloaded...",
        className: "bg-blue-50 text-blue-900",
      });
    } else {
      toast({
        title: "Opening Resource",
        description: "Loading your content...",
        className: "bg-green-50 text-green-900",
      });
    }
  };

  const filteredResources = resources
    .filter(r => {
      if (filter === "all") return true;
      if (filter === "bookmarked") return bookmarkedResources.includes(r.id);
      return r.difficulty.toLowerCase() === filter;
    })
    .filter(r => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
            Learning Resources
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Educational Materials
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access our curated collection of learning resources to support your mathematical journey.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 py-6"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {["all", "bookmarked", "beginner", "intermediate", "advanced"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f === "bookmarked" && <Star className="w-4 h-4 mr-2" />}
              {f}
            </Button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="glass-card p-6 hover-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-700">
                  {resource.icon}
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {resource.type}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(resource.id)}
                  className={bookmarkedResources.includes(resource.id) ? "text-yellow-500" : ""}
                >
                  <BookmarkPlus className="w-5 h-5" />
                </Button>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">
                {resource.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {resource.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  resource.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                  resource.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {resource.difficulty}
                </span>
                {resource.duration && (
                  <span className="text-sm text-gray-500 flex items-center">
                    <Play className="w-4 h-4 mr-1" />
                    {resource.duration}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                {resource.views && (
                  <span>👁️ {resource.views} views</span>
                )}
                {resource.downloads && (
                  <span>⬇️ {resource.downloads} downloads</span>
                )}
              </div>
              
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => handleResourceAction(resource)}
              >
                {resource.type === "PDF Guide" ? "Download" : "Access"} Resource
                {resource.type === "PDF Guide" ? (
                  <Download className="w-4 h-4 ml-2" />
                ) : (
                  <ExternalLink className="w-4 h-4 ml-2" />
                )}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
