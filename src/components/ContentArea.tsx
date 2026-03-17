import React from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileText, 
  BookOpen, 
  History, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  ThumbsUp,
  Share2,
  Flag,
  Maximize2,
  Minimize2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sun,
  Moon,
  Type,
  Expand,
  Clock,
  Database,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import { cn } from '../lib/utils';

export default function ContentArea() {
  const [activeTab, setActiveTab] = React.useState('Description');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [quizAnswer, setQuizAnswer] = React.useState<string | null>(null);
  const [editorTheme, setEditorTheme] = React.useState('vs-dark');
  const [editorFontSize, setEditorFontSize] = React.useState(12);
  const [isZenMode, setIsZenMode] = React.useState(false);
  const [selectedSubmission, setSelectedSubmission] = React.useState<any | null>(null);
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

  // Handle Zen Mode ESC key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isZenMode]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="w-[45%] flex flex-col h-screen border-r border-zinc-800 bg-[#0F0F0F]">
      {/* Tabs Header */}
      <div className="h-12 border-b border-zinc-800 flex items-center px-2 bg-[#141414] shrink-0">
        <Tab icon={<FileText size={14} />} label="Description" active={activeTab === 'Description'} onClick={() => setActiveTab('Description')} />
        <Tab icon={<BookOpen size={14} />} label="Editorial" active={activeTab === 'Editorial'} onClick={() => setActiveTab('Editorial')} />
        <Tab icon={<History size={14} />} label="Submission" active={activeTab === 'Submission'} onClick={() => setActiveTab('Submission')} />
      </div>

      {/* Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          {activeTab === 'Description' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-zinc-100">Accessing Outer Class Members</h1>
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold rounded border border-yellow-500/20">Medium</span>
                <button className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-bold rounded border border-zinc-700 transition-colors">
                  Hints
                </button>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  In Java, a non-static nested class (also known as an inner class) has a special relationship with its outer class. 
                  Specifically, it can access all members (fields and methods) of the outer class, including those declared as <code className="text-orange-500 bg-orange-500/10 px-1 rounded">private</code>.
                </p>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  Given an outer class <code className="text-zinc-300">Outer</code> with a private integer field <code className="text-zinc-300">x</code>, 
                  implement a method <code className="text-zinc-300">calculate(int factor)</code> inside a non-static inner class <code className="text-zinc-300">Inner</code> 
                  that returns the product of <code className="text-zinc-300">x</code> and the given <code className="text-zinc-300">factor</code>.
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-200 mb-3">Example 1</h3>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-2">
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold text-zinc-300 min-w-[80px]">Input:</span>
                        <span className="text-zinc-400 font-mono">x = 10, factor = 5</span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold text-zinc-300 min-w-[80px]">Output:</span>
                        <span className="text-zinc-400 font-mono">50</span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold text-zinc-300 min-w-[80px]">Explanation:</span>
                        <span className="text-zinc-400">The inner class accesses the private field <code className="text-zinc-500">x</code> (10) and multiplies it by the factor (5). Result: 10 * 5 = 50.</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-zinc-200 mb-3">Example 2</h3>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-2">
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold text-zinc-300 min-w-[80px]">Input:</span>
                        <span className="text-zinc-400 font-mono">x = -2, factor = 10</span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold text-zinc-300 min-w-[80px]">Output:</span>
                        <span className="text-zinc-400 font-mono">-20</span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold text-zinc-300 min-w-[80px]">Explanation:</span>
                        <span className="text-zinc-400">Accessing negative values works exactly the same way. -2 * 10 = -20.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-800/50">
                  <h3 className="text-sm font-bold text-zinc-200 mb-4">Now your turn!</h3>
                  <div className="pl-4 border-l-2 border-zinc-800 space-y-6">
                    <div className="space-y-1">
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold text-zinc-300 min-w-[80px]">Input:</span>
                        <span className="text-zinc-400 font-mono">x = 5, factor = -3</span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold text-zinc-300 min-w-[80px]">Output:</span>
                        <span className="text-orange-500 font-bold">Pick your answer</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      {['-15', '15'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setQuizAnswer(option)}
                          className={cn(
                            "flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 min-w-[180px] group",
                            quizAnswer === option 
                              ? "bg-orange-500/10 border-orange-500/50 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]" 
                              : "bg-zinc-900/30 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                            quizAnswer === option ? "border-orange-500" : "border-zinc-700 group-hover:border-zinc-500"
                          )}>
                            {quizAnswer === option && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 bg-orange-500 rounded-full" 
                              />
                            )}
                          </div>
                          <span className="font-bold text-sm tracking-tight">{option}</span>
                        </button>
                      ))}
                    </div>
                    
                    <AnimatePresence>
                      {quizAnswer && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className={cn(
                            "flex items-center gap-2 text-xs font-bold uppercase tracking-widest",
                            quizAnswer === '-15' ? "text-emerald-500" : "text-red-500"
                          )}
                        >
                          {quizAnswer === '-15' ? (
                            <>
                              <CheckCircle2 size={14} />
                              Correct! 5 * -3 = -15
                            </>
                          ) : (
                            <>
                              <AlertCircle size={14} />
                              Incorrect. Try again!
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-zinc-800/50">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Constraints</h3>
                  <ul className="list-disc list-inside text-zinc-500 text-xs space-y-2">
                    <li>The outer class must contain a private field <code className="text-zinc-600 font-mono">x</code>.</li>
                    <li>The inner class must be non-static.</li>
                    <li><code className="text-zinc-600 font-mono">-10^4 &lt;= x, factor &lt;= 10^4</code></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

      {activeTab === 'Editorial' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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

                {/* Presentation Controls */}
                {numPages && (
                  <div className={cn(
                    "absolute z-50 flex items-center gap-4 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl transition-all duration-300",
                    isFullscreen 
                      ? "bottom-8 left-1/2 -translate-x-1/2 px-6 py-3" 
                      : "bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 opacity-0 group-hover:opacity-100"
                  )}>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={isFullscreen ? 24 : 18} />
                    </button>
                    <div className="flex items-center gap-2 min-w-[60px] justify-center">
                      <span className={cn("font-bold text-white", isFullscreen ? "text-sm" : "text-xs")}>{currentPage}</span>
                      <span className="text-[10px] font-medium text-zinc-500">/</span>
                      <span className={cn("font-bold text-zinc-400", isFullscreen ? "text-sm" : "text-xs")}>{numPages}</span>
                    </div>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))}
                      disabled={currentPage === numPages}
                      className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={isFullscreen ? 24 : 18} />
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

              <div className="mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Page:</span>
                    <div className="flex items-center gap-1">
                      <AnimatePresence mode="wait">
                        <motion.span 
                          key={currentPage}
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -5, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs font-bold text-zinc-200"
                        >
                          {currentPage}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-zinc-600 mx-0.5 text-xs">/</span> 
                      <span className="text-xs font-bold text-zinc-200">{numPages || '--'}</span>
                    </div>
                  </div>
                </div>
                
                {numPages && (
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentPage / numPages) * 100}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                      />
                      {/* Subtle animated shine effect */}
                      <motion.div 
                        animate={{ 
                          left: ["-100%", "200%"] 
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "linear",
                          repeatDelay: 1
                        }}
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={currentPage}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest min-w-[32px] text-right"
                      >
                        {Math.round((currentPage / numPages) * 100)}%
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="mt-4 bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2 flex items-center justify-between">
                <p className="text-[10px] text-zinc-500 italic flex items-center gap-1">
                  <Maximize2 size={10} /> Tip: Use Arrow keys or Spacebar to navigate in presentation mode.
                </p>
              </div>
            </section>

            {/* 3. Solution */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                  <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                  Solution Code
                </h2>
                
                <div className="flex items-center gap-2">
                  {/* Font Size Controls */}
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 gap-2">
                    <Type size={12} className="text-zinc-500" />
                    <button 
                      onClick={() => setEditorFontSize(prev => Math.max(8, prev - 1))}
                      className="text-zinc-400 hover:text-zinc-200 text-xs font-bold px-1"
                    >-</button>
                    <span className="text-[10px] font-bold text-zinc-300 min-w-[20px] text-center">{editorFontSize}</span>
                    <button 
                      onClick={() => setEditorFontSize(prev => Math.min(32, prev + 1))}
                      className="text-zinc-400 hover:text-zinc-200 text-xs font-bold px-1"
                    >+</button>
                  </div>

                  {/* Theme Toggle */}
                  <button 
                    onClick={() => setEditorTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark')}
                    className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Toggle Theme"
                  >
                    {editorTheme === 'vs-dark' ? <Sun size={14} /> : <Moon size={14} />}
                  </button>

                  {/* Zen Mode Toggle */}
                  <button 
                    onClick={() => setIsZenMode(true)}
                    className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Zen Mode"
                  >
                    <Expand size={14} />
                  </button>
                </div>
              </div>

              <div className="bg-[#141414] border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex border-b border-zinc-800 bg-zinc-900/50">
                  {['Java'].map((lang) => (
                    <button key={lang} className={cn(
                      "px-6 py-2.5 text-xs font-bold transition-all relative",
                      "text-orange-500 bg-zinc-800/50"
                    )}>
                      {lang}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                    </button>
                  ))}
                </div>
                <div className="p-0 h-[300px]">
                  <Editor
                    height="100%"
                    defaultLanguage="java"
                    theme={editorTheme}
                    value={`public class Example1 {
    public static void main(String[] args) {
        Outer1 instance1 = new Outer1();
        Outer1.Inner1 instance2 = instance1.new Inner1();
        instance2.method3();
    }
}`}
                    options={{
                      minimap: { enabled: false },
                      fontSize: editorFontSize,
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
      )}

      {activeTab === 'Submission' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {!selectedSubmission ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-100">Past Submissions</h2>
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  3 Accepted
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 1, status: 'Accepted', runtime: '2ms', memory: '42.5MB', date: 'Mar 17, 2026', language: 'Java', runtimePercent: '98.5%', memoryPercent: '82.1%', code: 'class Solution {\n    public int accessX(Outer o) {\n        return o.x;\n    }\n}' },
                  { id: 2, status: 'Wrong Answer', runtime: 'N/A', memory: 'N/A', date: 'Mar 16, 2026', language: 'Java', runtimePercent: '0%', memoryPercent: '0%', code: 'class Solution {\n    public int accessX(Outer o) {\n        return 0;\n    }\n}' },
                  { id: 3, status: 'Accepted', runtime: '3ms', memory: '43.1MB', date: 'Mar 15, 2026', language: 'Java', runtimePercent: '92.3%', memoryPercent: '75.4%', code: 'class Solution {\n    public int accessX(Outer o) {\n        return o.x;\n    }\n}' },
                  { id: 4, status: 'Time Limit Exceeded', runtime: 'N/A', memory: 'N/A', date: 'Mar 14, 2026', language: 'Java', runtimePercent: '0%', memoryPercent: '0%', code: 'class Solution {\n    public int accessX(Outer o) {\n        while(true);\n    }\n}' },
                  { id: 5, status: 'Accepted', runtime: '5ms', memory: '44.2MB', date: 'Mar 12, 2026', language: 'Java', runtimePercent: '85.1%', memoryPercent: '68.2%', code: 'class Solution {\n    public int accessX(Outer o) {\n        return o.x;\n    }\n}' },
                ].map((sub, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedSubmission(sub)}
                    className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 hover:border-zinc-700/50 hover:bg-zinc-900/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          sub.status === 'Accepted' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : 
                          sub.status === 'Wrong Answer' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                        )}></div>
                        <span className={cn(
                          "text-sm font-bold tracking-tight",
                          sub.status === 'Accepted' ? "text-emerald-500" : 
                          sub.status === 'Wrong Answer' ? "text-red-500" : "text-orange-500"
                        )}>
                          {sub.status}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-zinc-800/50 rounded-md border border-zinc-700/30">
                          {sub.language}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">{sub.date}</span>
                    </div>

                    {sub.status === 'Accepted' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-500 flex items-center gap-1.5">
                              <Clock size={10} /> Runtime
                            </span>
                            <span className="text-emerald-500 font-bold">{sub.runtimePercent}</span>
                          </div>
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/50 w-[98%]"></div>
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">{sub.runtime}</div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-500 flex items-center gap-1.5">
                              <Database size={10} /> Memory
                            </span>
                            <span className="text-emerald-500 font-bold">{sub.memoryPercent}</span>
                          </div>
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/50 w-[82%]"></div>
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">{sub.memory}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 italic">
                        <AlertCircle size={10} />
                        {sub.status === 'Wrong Answer' ? 'Failed at test case 42/150' : 'Execution timed out after 2000ms'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-xs font-bold mb-6 transition-colors group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Submissions
              </button>

              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      selectedSubmission.status === 'Accepted' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                      selectedSubmission.status === 'Wrong Answer' ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    )}>
                      {selectedSubmission.status}
                    </div>
                    <span className="text-xs text-zinc-500">{selectedSubmission.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Language:</span>
                    <span className="text-xs font-bold text-zinc-300">{selectedSubmission.language}</span>
                  </div>
                </div>

                {selectedSubmission.status === 'Accepted' && (
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest mb-2">
                        <Clock size={12} /> Runtime
                      </div>
                      <div className="text-2xl font-bold text-emerald-500 mb-1">{selectedSubmission.runtime}</div>
                      <div className="text-[10px] text-zinc-500">Beats <span className="text-zinc-300 font-bold">{selectedSubmission.runtimePercent}</span> of users</div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest mb-2">
                        <Database size={12} /> Memory
                      </div>
                      <div className="text-2xl font-bold text-emerald-500 mb-1">{selectedSubmission.memory}</div>
                      <div className="text-[10px] text-zinc-500">Beats <span className="text-zinc-300 font-bold">{selectedSubmission.memoryPercent}</span> of users</div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Submitted Code</h3>
                  <div className="bg-[#141414] border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="p-0 h-[300px]">
                      <Editor
                        height="100%"
                        defaultLanguage="java"
                        theme={editorTheme}
                        value={selectedSubmission.code}
                        options={{
                          minimap: { enabled: false },
                          fontSize: editorFontSize,
                          lineNumbers: 'on',
                          scrollBeyondLastLine: false,
                          readOnly: true,
                          padding: { top: 16 },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zen Mode Overlay */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0F0F0F] flex flex-col"
          >
            <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#141414]">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-bold text-zinc-200">Zen Mode</h2>
                <div className="h-4 w-px bg-zinc-800"></div>
                <span className="text-xs text-zinc-500 italic">Press ESC to exit</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 gap-3">
                  <Type size={14} className="text-zinc-500" />
                  <button onClick={() => setEditorFontSize(prev => Math.max(8, prev - 1))} className="text-zinc-400 hover:text-zinc-200 font-bold">-</button>
                  <span className="text-xs font-bold text-zinc-300 min-w-[24px] text-center">{editorFontSize}</span>
                  <button onClick={() => setEditorFontSize(prev => Math.min(32, prev + 1))} className="text-zinc-400 hover:text-zinc-200 font-bold">+</button>
                </div>

                <button 
                  onClick={() => setEditorTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark')}
                  className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {editorTheme === 'vs-dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <button 
                  onClick={() => setIsZenMode(false)}
                  className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
                >
                  <Minimize2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="java"
                theme={editorTheme}
                value={`public class Example1 {
    public static void main(String[] args) {
        Outer1 instance1 = new Outer1();
        Outer1.Inner1 instance2 = instance1.new Inner1();
        instance2.method3();
    }
}`}
                options={{
                  minimap: { enabled: true },
                  fontSize: editorFontSize + 2,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  readOnly: true,
                  padding: { top: 32 },
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        "flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors relative h-full",
        active ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
      )}
    >
      {icon}
      {label}
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
}
