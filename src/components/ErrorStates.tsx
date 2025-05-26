
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Upload, Wifi, Server, Heart } from "lucide-react";

interface ErrorStatesProps {
  type: 'upload' | 'api' | 'network' | 'processing' | 'not-found';
  message?: string;
  onRetry?: () => void;
  onReset?: () => void;
}

export const ErrorStates = ({ type, message, onRetry, onReset }: ErrorStatesProps) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'upload':
        return {
          icon: Upload,
          title: "Oops! Upload Didn't Work",
          description: message || "Don't worry, this happens sometimes! Please check your file format (MP3, WAV, M4A) and make sure it's under 100MB, then give it another try.",
          primaryAction: "Try Uploading Again",
          secondaryAction: "Choose a Different File",
          color: "from-orange-500 to-red-500"
        };
      case 'api':
        return {
          icon: Server,
          title: "Processing Hiccup",
          description: message || "Our AI got a bit confused processing your podcast. No worries though — our team has been automatically notified and we'll get this sorted quickly!",
          primaryAction: "Retry Processing",
          secondaryAction: "Upload New Episode",
          color: "from-red-500 to-pink-500"
        };
      case 'network':
        return {
          icon: Wifi,
          title: "Connection Trouble",
          description: message || "Looks like there's a hiccup with your internet connection. Check your connection and we'll get you back to creating amazing content!",
          primaryAction: "Try Again",
          secondaryAction: "Cancel",
          color: "from-yellow-500 to-orange-500"
        };
      case 'processing':
        return {
          icon: AlertTriangle,
          title: "Processing Challenge",
          description: message || "We couldn't generate content from this audio file. This might be due to audio quality, length, or format issues. Try a different file or improve audio quality.",
          primaryAction: "Try Again",
          secondaryAction: "Upload Different Episode",
          color: "from-purple-500 to-red-500"
        };
      case 'not-found':
        return {
          icon: Heart,
          title: "Content Not Available",
          description: message || "The shared content you're looking for seems to have expired or doesn't exist. No problem — you can always create fresh content!",
          primaryAction: "Create New Content",
          secondaryAction: null,
          color: "from-blue-500 to-purple-500"
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md mx-auto animate-fade-in hover:bg-white/15 transition-all duration-300">
      <CardHeader>
        <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${config.color} bg-opacity-20 rounded-full mx-auto mb-4 animate-pulse`}>
          <Icon className="w-8 h-8 text-red-400" />
        </div>
        <CardTitle className="text-white text-center text-xl font-bold">{config.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-white/70 mb-8 leading-relaxed">{config.description}</p>
        
        <div className="space-y-3">
          <Button 
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {config.primaryAction}
          </Button>
          
          {config.secondaryAction && onReset && (
            <Button 
              onClick={onReset}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10 transition-all duration-300 hover:border-white/50"
            >
              {config.secondaryAction}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const InlineErrorAlert = ({ message, onRetry }: { message: string; onRetry?: () => void }) => {
  return (
    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 animate-fade-in">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-semibold">Something went wrong</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm">{message}</span>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="ml-4 hover:bg-white/10 transition-all duration-200">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
