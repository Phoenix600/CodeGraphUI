import React from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Maximize2, 
  Minimize2,
  ChevronDown,
  Settings2,
  Terminal,
  Sun,
  Moon,
  Type,
  Expand
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function EditorArea() {
  const [language] = React.useState('java');
  const [editorTheme, setEditorTheme] = React.useState('vs-dark');
  const [editorFontSize, setEditorFontSize] = React.useState(14);
  const [isZenMode, setIsZenMode] = React.useState(false);
  const [code, setCode] = React.useState({
    java: `class Outer1 {
    int x1 = 10;
    static int x2 = 1000;

    public void method1() {
        System.out.println("Non-Static Method Of Outer");
    }

    public static void method2() {
        System.out.println("Static Method Of Outer");
    }

    // Non-Static Inner Class
    class Inner1 {
        int y1 = 20;
        static int y2 = 2000;

        public void method3() {
            System.out.println("Non-Static Method-3 Inner Class");
            System.out.println(x1);
            method1();
            System.out.println(x2);
            method2();
        }

        public static void method4() {
            System.out.println("Static Method-4 Inner Class");
            System.out.println(x2);
            method2();
            System.out.println(y2);
        }
    }
}

public class Example1 {
    public static void main(String[] args) {
        // The Object Of Inner Class Is Bound To The Object Of Outer Class
        Outer1 instance1 = new Outer1();
        Outer1.Inner1 instance2 = instance1.new Inner1();
        System.out.println(instance2.y1);
        instance2.method3();

        // Another Syntax For Creating An Object Of Inner Class
        Outer1.Inner1 instance3 = new Outer1().new Inner1();
    }
}`,
    cpp: `#include <iostream>
using namespace std;

class Outer1 {
public:
    int x1 = 10;
    static int x2;

    void method1() {
        cout << "Non-Static Method Of Outer" << endl;
    }

    static void method2() {
        cout << "Static Method Of Outer" << endl;
    }

    // In C++, nested classes don't have automatic access to outer members
    // unless passed a reference or pointer.
    class Inner1 {
    public:
        int y1 = 20;
        static int y2;

        void method3(Outer1& outer) {
            cout << "Non-Static Method-3 Inner Class" << endl;
            cout << outer.x1 << endl;
            outer.method1();
            cout << Outer1::x2 << endl;
            Outer1::method2();
        }
    };
};

int Outer1::x2 = 1000;
int Outer1::Inner1::y2 = 2000;

int main() {
    Outer1 outer;
    Outer1::Inner1 inner;
    inner.method3(outer);
    return 0;
}`,
    python: `class Outer1:
    x2 = 1000

    def __init__(self):
        self.x1 = 10

    def method1(self):
        print("Non-Static Method Of Outer")

    @staticmethod
    def method2():
        print("Static Method Of Outer")

    class Inner1:
        y2 = 2000

        def __init__(self, outer_instance):
            self.outer = outer_instance
            self.y1 = 20

        def method3(self):
            print("Non-Static Method-3 Inner Class")
            print(self.outer.x1)
            self.outer.method1()
            print(Outer1.x2)
            Outer1.method2()

if __name__ == "__main__":
    outer = Outer1()
    inner = Outer1.Inner1(outer)
    inner.method3()
`
  });

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(prev => ({ ...prev, java: value }));
    }
  };

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

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0F0F0F]">
      {/* Editor Header */}
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-[#141414]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-zinc-800 rounded text-xs font-bold text-orange-500">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            Java
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Font Size Controls */}
          <div className="flex items-center bg-zinc-800/50 border border-zinc-800 rounded px-2 py-1 gap-2">
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
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Toggle Theme"
          >
            {editorTheme === 'vs-dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button className="p-1.5 text-zinc-500 hover:text-zinc-300"><Copy size={16} /></button>
          <button className="p-1.5 text-zinc-500 hover:text-zinc-300"><RotateCcw size={16} /></button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded transition-colors">
            Try... <Play size={14} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden relative group">
        <Editor
          height="100%"
          language={language}
          theme={editorTheme}
          value={code[language as keyof typeof code]}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: editorFontSize,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 20 },
          }}
        />
        <button 
          onClick={() => setIsZenMode(true)}
          className="absolute bottom-4 right-4 p-2 bg-zinc-800/50 text-zinc-400 rounded hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100 z-10"
          title="Zen Mode"
        >
          <Expand size={16} />
        </button>
      </div>

      {/* Zen Mode Overlay */}
      {isZenMode && (
        <div className="fixed inset-0 z-[200] bg-[#0F0F0F] flex flex-col">
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
              language={language}
              theme={editorTheme}
              value={code[language as keyof typeof code]}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: true },
                fontSize: editorFontSize + 2,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 32 },
              }}
            />
          </div>
        </div>
      )}

      {/* Test Cases Area */}
      <div className="h-1/3 border-t border-zinc-800 flex flex-col bg-[#141414]">
        <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs font-bold text-orange-500 border-b-2 border-orange-500 h-full px-2">
              <Terminal size={14} /> Test Cases
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-zinc-500 hover:text-zinc-300"><Settings2 size={16} /></button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <button className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs font-medium">Case 1</button>
            <button className="px-3 py-1 text-zinc-500 hover:bg-zinc-800 rounded text-xs font-medium">Case 2</button>
            <button className="p-1 text-zinc-600 hover:text-zinc-400"><RotateCcw size={14} /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">nums</label>
              <div className="bg-zinc-900 border border-zinc-800 rounded p-3 text-sm font-mono text-zinc-300">
                [7, 4, 1, 5, 3]
              </div>
            </div>
          </div>
        </div>

        <div className="h-12 border-t border-zinc-800 flex items-center justify-end px-4 gap-2">
          <button className="px-4 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200">Console</button>
          <button className="px-6 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded">Run</button>
          <button className="px-6 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded">Submit</button>
        </div>
      </div>
    </div>
  );
}
