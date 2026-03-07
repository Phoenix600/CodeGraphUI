import React from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileText, 
  BookOpen, 
  History, 
  MessageSquare, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  ThumbsUp,
  Share2,
  Flag,
  Maximize2,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import { cn } from '../lib/utils';

export default function ContentArea() {
  const [activeTab, setActiveTab] = React.useState('Editorial');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const pdfContainerRef = React.useRef<HTMLDivElement>(null);

  const LOCAL_PDF_PATH = "/assets/presentation.pdf";
  const VIEW_LINK = "https://drive.google.com/file/d/14COt45IkqKQWXKaO_aLFIqUTJVXd4a1i/view";
  const CACHE_NAME = "pdf-cache-v1";

  // Extract ID from Google Drive View Link
  const extractId = (url: string) => {
    const match = url.match(/\/d\/(.+?)\//);
    return match ? match[1] : null;
  };

  const GOOGLE_DRIVE_ID = extractId(VIEW_LINK);
  const DIRECT_DOWNLOAD_URL = `https://drive.usercontent.google.com/u/0/uc?id=${GOOGLE_DRIVE_ID}&export=download`;
  const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(DIRECT_DOWNLOAD_URL)}`;

  // Suppress ResizeObserver loop limit exceeded error
  React.useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
          e.message === 'ResizeObserver loop limit exceeded') {
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Handle Container Resize
  React.useEffect(() => {
    if (!pdfContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!entries || entries.length === 0) return;
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
    });

    observer.observe(pdfContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch and Cache PDF
  React.useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // 1. Try to fetch from local assets first
        const localResponse = await fetch(LOCAL_PDF_PATH);
        if (localResponse.ok) {
          const blob = await localResponse.blob();
          setPdfUrl(URL.createObjectURL(blob));
          setLoading(false);
          return;
        }

        // 2. Fallback to Cache
        const cachedResponse = await cache.match(DIRECT_DOWNLOAD_URL);
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          setPdfUrl(URL.createObjectURL(blob));
        } else {
          // 3. Fallback to Google Drive via Proxy
          if (!GOOGLE_DRIVE_ID) throw new Error("Invalid Source");
          
          const response = await fetch(PROXY_URL);
          if (!response.ok) throw new Error("Fetch Failed");

          const blob = await response.blob();
          if (blob.type === 'text/html') throw new Error("Invalid Content");

          const cacheResponse = new Response(blob, { headers: { 'Content-Type': 'application/pdf' } });
          await cache.put(DIRECT_DOWNLOAD_URL, cacheResponse);
          setPdfUrl(URL.createObjectURL(blob));
        }
      } catch (err) {
        console.error("PDF Load Error:", err);
        setError("Unable to load the presentation. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [GOOGLE_DRIVE_ID]);

  // Keyboard Navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentPage(prev => Math.min(prev + 1, numPages || prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentPage(prev => Math.max(prev - 1, 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, numPages]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!pdfContainerRef.current) return;

    if (!document.fullscreenElement) {
      pdfContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Sync state with native fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="w-[45%] flex flex-col h-screen border-r border-zinc-800 bg-[#0F0F0F]">
      {/* Tabs Header */}
      <div className="h-12 border-b border-zinc-800 flex items-center px-2 bg-[#141414] shrink-0">
        <Tab icon={<FileText size={14} />} label="Description" active={activeTab === 'Description'} onClick={() => setActiveTab('Description')} />
        <Tab icon={<BookOpen size={14} />} label="Editorial" active={activeTab === 'Editorial'} onClick={() => setActiveTab('Editorial')} />
        <Tab icon={<History size={14} />} label="Submissions" active={activeTab === 'Submissions'} onClick={() => setActiveTab('Submissions')} />
        <Tab icon={<MessageSquare size={14} />} label="Discussion" active={activeTab === 'Discussion'} onClick={() => setActiveTab('Discussion')} />
      </div>

      {/* Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-zinc-100">Nested Classes in Java</h1>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase">
                Study view
                <div className="w-8 h-4 bg-zinc-700 rounded-full relative">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-zinc-400 rounded-full"></div>
                </div>
              </span>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 mb-8">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/roaefAKS7oY?start=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          </div>

          {/* Text Content */}
          <div className="prose prose-invert max-w-none">
            {/* 1. Intuition */}
            <section className="mb-10">
              <h2 className="text-lg font-bold text-zinc-200 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                Intuition
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Nested classes allow you to logically group classes that are only used in one place, 
                increase encapsulation, and create more readable and maintainable code. 
                A non-static nested class (Inner Class) has access to other members of the enclosing class, 
                even if they are declared private.
              </p>
            </section>

            {/* 2. PDF Player Section */}
            <section className="mb-10">
              <h2 className="text-lg font-bold text-zinc-200 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                Presentation Viewer
              </h2>
              
              <div ref={pdfContainerRef} className={cn(
                "relative group bg-[#0F0F0F] rounded-xl overflow-hidden border border-zinc-800 transition-all duration-500",
                isFullscreen ? "fixed inset-0 z-[100] rounded-none border-none flex flex-col items-center justify-center" : "aspect-video"
              )}>
                {/* Minimal PDF Toolbar */}
                <div className={cn(
                  "absolute z-50 flex items-center gap-2 transition-all duration-300",
                  isFullscreen ? "top-6 right-6" : "top-4 right-4 opacity-0 group-hover:opacity-100"
                )}>
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2.5 bg-black/60 backdrop-blur-xl text-zinc-400 hover:text-white hover:bg-black/80 rounded-full transition-all border border-white/10 shadow-2xl"
                    title={isFullscreen ? "Exit Presentation (ESC)" : "Start Presentation"}
                  >
                    {isFullscreen ? <X size={20} /> : <Maximize2 size={20} />}
                  </button>
                </div>

                {/* Presentation Controls (Only in Fullscreen) */}
                {isFullscreen && numPages && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-2 min-w-[80px] justify-center">
                      <span className="text-sm font-bold text-white">{currentPage}</span>
                      <span className="text-xs font-medium text-zinc-500">/</span>
                      <span className="text-sm font-bold text-zinc-400">{numPages}</span>
                    </div>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))}
                      disabled={currentPage === numPages}
                      className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
                
                {/* PDF Content Area */}
                <div className={cn(
                  "flex-1 relative flex items-center justify-center w-full h-full overflow-hidden",
                  isFullscreen ? "bg-black" : "bg-zinc-900"
                )}>
                  {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-sm z-30">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
                      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">Initializing Presentation...</p>
                    </div>
                  ) : error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-red-500/50 mb-4" />
                      <h3 className="text-zinc-200 font-bold mb-2">Presentation Error</h3>
                      <p className="text-zinc-500 text-xs max-w-xs mb-6">{error}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold rounded uppercase tracking-wider transition-all border border-zinc-700"
                      >
                        Retry Loading
                      </button>
                    </div>
                  ) : pdfUrl ? (
                    <div className="w-full h-full flex items-center justify-center overflow-auto custom-scrollbar">
                      <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-6 h-6 text-orange-500 animate-spin mb-2" />
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Rendering...</span>
                          </div>
                        }
                        className="flex flex-col items-center"
                      >
                        <Page 
                          pageNumber={currentPage} 
                          width={isFullscreen ? undefined : containerWidth - 40}
                          height={isFullscreen ? window.innerHeight - 120 : undefined}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="shadow-2xl"
                        />
                      </Document>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2 flex items-center justify-between">
                <p className="text-[10px] text-zinc-500 italic flex items-center gap-1">
                  <Maximize2 size={10} /> Tip: Use the native PDF controls to zoom and navigate. Press ESC to exit fullscreen.
                </p>
              </div>
            </section>

            {/* 3. Solution */}
            <section className="mb-10">
              <h2 className="text-lg font-bold text-zinc-200 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                Solution Code
              </h2>
              <div className="bg-[#141414] border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex border-b border-zinc-800 bg-zinc-900/50">
                  {['C++', 'Java', 'Python'].map((lang) => (
                    <button key={lang} className={cn(
                      "px-6 py-2.5 text-xs font-bold transition-all relative",
                      lang === 'Java' ? "text-orange-500 bg-zinc-800/50" : "text-zinc-500 hover:text-zinc-300"
                    )}>
                      {lang}
                      {lang === 'Java' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>}
                    </button>
                  ))}
                </div>
                <div className="p-0 h-[300px]">
                  <Editor
                    height="100%"
                    defaultLanguage="java"
                    theme="vs-dark"
                    value={`public class Example1 {
    public static void main(String[] args) {
        Outer1 instance1 = new Outer1();
        Outer1.Inner1 instance2 = instance1.new Inner1();
        instance2.method3();
    }
}`}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 12,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      readOnly: true,
                      padding: { top: 16 },
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>


      {/* Footer Actions */}
      <div className="h-12 border-t border-zinc-800 flex items-center justify-between px-4 bg-[#141414] shrink-0">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs">
            <ThumbsUp size={14} /> 33
          </button>
          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs">
            <MessageSquare size={14} />
          </button>
          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs">
            <Share2 size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-zinc-500 hover:text-zinc-300"><Flag size={14} /></button>
          <div className="h-4 w-px bg-zinc-800 mx-1"></div>
          <div className="flex items-center gap-1">
            <button className="p-1 text-zinc-500 hover:text-zinc-300"><ChevronLeft size={16} /></button>
            <button className="p-1 text-zinc-500 hover:text-zinc-300"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors relative",
        active ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
      )}
    >
      {icon}
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>}
    </button>
  );
}
