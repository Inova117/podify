
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { AudioUpload } from "@/components/AudioUpload";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LayoutDashboard } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        {/* Auth Navigation */}
        <div className="relative z-10 flex justify-end p-6">
          {user ? (
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = '/auth'}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Hero />
          <Benefits />
          <FAQ />
          <AudioUpload />
          
          {/* Footer */}
          <footer className="py-12 text-center text-white/60 border-t border-white/10">
            <p className="text-sm">© 2024 AI Podcast Repurposer. Transform your audio into viral content that your audience will love.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
