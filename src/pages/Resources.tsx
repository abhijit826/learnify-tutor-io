
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, FileText, ExternalLink } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      title: "Algebra Fundamentals",
      type: "Video Course",
      description: "Master the basics of algebra with our comprehensive video series",
      icon: <Video className="w-6 h-6" />,
      link: "#"
    },
    {
      title: "Geometry Handbook",
      type: "PDF Guide",
      description: "Complete guide to geometric concepts and problem-solving techniques",
      icon: <FileText className="w-6 h-6" />,
      link: "#"
    },
    {
      title: "Calculus Practice Problems",
      type: "Interactive",
      description: "Collection of calculus problems with step-by-step solutions",
      icon: <BookOpen className="w-6 h-6" />,
      link: "#"
    }
  ];

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

        <div className="grid gap-8 md:grid-cols-3">
          {resources.map((resource, index) => (
            <Card key={index} className="glass-card p-6 hover-transform">
              <div className="flex items-center mb-4 text-gray-700">
                {resource.icon}
                <span className="ml-2 text-sm font-medium text-gray-500">
                  {resource.type}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">
                {resource.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {resource.description}
              </p>
              
              <Button className="w-full" variant="outline">
                Access Resource
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Links</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {["Textbooks", "Video Lectures", "Practice Tests", "Formula Sheets"].map((link) => (
              <Button
                key={link}
                variant="outline"
                className="hover-transform"
              >
                {link}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
