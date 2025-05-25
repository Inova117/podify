
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { AudioUpload } from "@/components/AudioUpload";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative">
          <Hero />
          <Benefits />
          <AudioUpload />
          
          {/* Footer */}
          <footer className="py-12 text-center text-white/60">
            <p>© 2024 AI Podcast Repurposer. Transform your audio into viral content.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
