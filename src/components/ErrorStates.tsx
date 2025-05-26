
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Upload, Wifi, Server } from "lucide-react";

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
          title: "Upload Failed",
          description: message || "There was a problem uploading your file. Please check the file format and try again.",
          primaryAction: "Try Again",
          secondaryAction: "Choose Different File"
        };
      case 'api':
        return {
          icon: Server,
          title: "Processing Error",
          description: message || "We encountered an issue while processing your podcast. Our team has been notified.",
          primaryAction: "Retry Processing",
          secondaryAction: "Upload New File"
        };
      case 'network':
        return {
          icon: Wifi,
          title: "Connection Error",
          description: message || "Unable to connect to our servers. Please check your internet connection and try again.",
          primaryAction: "Retry",
          secondaryAction: "Cancel"
        };
      case 'processing':
        return {
          icon: AlertTriangle,
          title: "Processing Failed",
          description: message || "We couldn't generate content from your podcast. This might be due to audio quality or length issues.",
          primaryAction: "Try Again",
          secondaryAction: "Upload Different File"
        };
      case 'not-found':
        return {
          icon: AlertTriangle,
          title: "Content Not Found",
          description: message || "The shared content you're looking for doesn't exist or has expired.",
          primaryAction: "Go Home",
          secondaryAction: null
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4">
          <Icon className="w-8 h-8 text-red-400" />
        </div>
        <CardTitle className="text-white text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-white/70 mb-6">{config.description}</p>
        
        <div className="space-y-3">
          <Button 
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {config.primaryAction}
          </Button>
          
          {config.secondaryAction && onReset && (
            <Button 
              onClick={onReset}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
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
    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="ml-4">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
