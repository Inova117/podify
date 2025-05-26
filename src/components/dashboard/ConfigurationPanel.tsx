
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ConfigurationPanel = () => {
  const [settings, setSettings] = useState({
    autoShare: false,
    emailNotifications: true,
    darkMode: true,
    defaultContentLength: 'medium',
    preferredTone: 'professional'
  });
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration & Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
              <TabsTrigger value="general" className="text-white data-[state=active]:bg-white/20">
                <User className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="content" className="text-white data-[state=active]:bg-white/20">
                <Palette className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-white/20">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="text-white data-[state=active]:bg-white/20">
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Display Name</Label>
                      <Input 
                        placeholder="Your name"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Email</Label>
                      <Input 
                        placeholder="your@email.com"
                        type="email"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Interface Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Dark Mode</Label>
                      <p className="text-white/60 text-sm">Use dark theme across the application</p>
                    </div>
                    <Switch 
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Content Generation Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Default Content Length</Label>
                    <select 
                      className="w-full mt-2 p-2 bg-white/10 border border-white/20 rounded-md text-white"
                      value={settings.defaultContentLength}
                      onChange={(e) => setSettings(prev => ({ ...prev, defaultContentLength: e.target.value }))}
                    >
                      <option value="short">Short (1-2 paragraphs)</option>
                      <option value="medium">Medium (3-4 paragraphs)</option>
                      <option value="long">Long (5+ paragraphs)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-white">Preferred Tone</Label>
                    <select 
                      className="w-full mt-2 p-2 bg-white/10 border border-white/20 rounded-md text-white"
                      value={settings.preferredTone}
                      onChange={(e) => setSettings(prev => ({ ...prev, preferredTone: e.target.value }))}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="energetic">Energetic</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Auto-Share Generated Content</Label>
                      <p className="text-white/60 text-sm">Automatically create shareable links for all content</p>
                    </div>
                    <Switch 
                      checked={settings.autoShare}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoShare: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Content Generation Complete</Label>
                      <p className="text-white/60 text-sm">Get notified when your content is ready</p>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Weekly Summary</Label>
                      <p className="text-white/60 text-sm">Weekly report of your content creation activity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Product Updates</Label>
                      <p className="text-white/60 text-sm">Stay informed about new features and improvements</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Data & Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Data Retention</h4>
                    <p className="text-white/60 text-sm mb-4">
                      Your uploaded audio files and generated content are stored securely. You can delete them at any time from your content library.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Export Your Data</h4>
                    <p className="text-white/60 text-sm mb-4">
                      Download all your generated content and data in a portable format.
                    </p>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Export Data
                    </Button>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2 text-red-300">Danger Zone</h4>
                    <p className="text-white/60 text-sm mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
