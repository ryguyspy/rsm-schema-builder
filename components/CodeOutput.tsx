
import React, { useState } from 'react';
import { GeneratedSchema } from '../types';
import { Copy, Check, Terminal, FileCode, ExternalLink, ShieldCheck, Download } from 'lucide-react';

interface CodeOutputProps {
  result: GeneratedSchema;
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  // Safely parse and re-stringify to ensure pretty printing
  let prettyJson = '';
  try {
    const parsed = typeof result.jsonLd === 'string' ? JSON.parse(result.jsonLd) : result.jsonLd;
    prettyJson = JSON.stringify(parsed, null, 2);
  } catch (e) {
    prettyJson = result.jsonLd;
  }

  const fullSnippet = `<script type="application/ld+json">\n${prettyJson}\n</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullSnippet], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema-markup.jsonld';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider mb-4 border border-green-100">
          Generation Successful
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Schema is Ready!</h3>
        <p className="text-slate-600 leading-relaxed">{result.explanation}</p>
      </div>

      <div className="relative group mb-8">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleDownload}
            title="Download as .jsonld"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-600 shadow-xl"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-indigo-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Snippet
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2 ml-2 text-slate-500">
           <Terminal className="w-4 h-4" />
           <span className="text-xs font-mono uppercase tracking-widest">JSON-LD Snippet</span>
        </div>

        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">HTML Code Snippet</span>
          </div>
          <pre className="p-6 overflow-x-auto text-sm leading-relaxed text-indigo-300 font-mono scrollbar-thin scrollbar-thumb-slate-700 max-h-[400px]">
            <code>{fullSnippet}</code>
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Validate</h4>
          </div>
          <div className="flex flex-col gap-2">
            <a 
              href="https://search.google.com/test/rich-results" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors group"
            >
              <span>Google Rich Results</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
            </a>
            <a 
              href="https://validator.schema.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors group"
            >
              <span>Schema Validator</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
            </a>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileCode className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-wide">Install</h4>
          </div>
          <p className="text-[11px] text-indigo-800 leading-tight">
            Copy the snippet and paste it into your site's <code className="font-mono bg-indigo-200/50 px-1 rounded">&lt;head&gt;</code> section. In Wix, use the "Custom Code" settings in the Dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};
