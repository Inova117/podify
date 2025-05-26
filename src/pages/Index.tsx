
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { AudioUpload } from "@/components/AudioUpload";
import { FAQ } from "@/components/FAQ";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
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
