import React, { useState } from 'react';
import { 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  Cpu, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ProjectCodeSnippet } from '../types';
import { soundFx } from '../utils/soundEffects';

interface ProjectCodePreviewProps {
  snippet: ProjectCodeSnippet;
  projectTitle: string;
}

/**
 * Highlights a single line of Python code with themed tokens.
 */
function renderHighlightedLine(line: string, index: number) {
  // 1. Comment line
  const trimmed = line.trim();
  if (trimmed.startsWith('#')) {
    return (
      <span key={index} className="text-slate-500 italic">
        {line}
      </span>
    );
  }

  // 2. Docstring
  if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
    return (
      <span key={index} className="text-emerald-400/90 italic">
        {line}
      </span>
    );
  }

  // Split by inline comment if any (preserve indentation)
  let codePart = line;
  let commentPart = '';
  const commentIdx = line.indexOf('#');
  if (commentIdx !== -1) {
    codePart = line.substring(0, commentIdx);
    commentPart = line.substring(commentIdx);
  }

  // Token regex for Python keywords, decorators, strings, numbers, and identifiers
  const tokenRegex = /("""[\s\S]*?"""|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[a-zA-Z_]\w*|\b(?:import|from|as|class|def|return|async|await|if|else|elif|for|in|with|and|or|not|is|self|True|False|None)\b|\b(?:torch|nn|nn\.Module|Tensor|FastAPI|UploadFile|File|Image|PIL|XGBClassifier|Sequential|Linear|ReLU|LSTM|T|Compose|int|float|str|dict|bool|bytes|list)\b|\b\d+(?:\.\d+)?\b|[a-zA-Z_]\w*(?=\()|[^\s\w]+|\s+|\w+)/g;

  const tokens: React.ReactNode[] = [];
  let match: RegExpExecArray | null;
  let key = 0;

  const pythonKeywords = new Set([
    'import', 'from', 'as', 'class', 'def', 'return', 'async', 'await', 
    'if', 'else', 'elif', 'for', 'in', 'with', 'and', 'or', 'not', 'is', 'self', 'True', 'False', 'None'
  ]);

  const pythonTypes = new Set([
    'torch', 'nn', 'nn.Module', 'Tensor', 'FastAPI', 'UploadFile', 'File', 
    'Image', 'PIL', 'XGBClassifier', 'Sequential', 'Linear', 'ReLU', 'LSTM', 
    'T', 'Compose', 'int', 'float', 'str', 'dict', 'bool', 'bytes', 'list'
  ]);

  while ((match = tokenRegex.exec(codePart)) !== null) {
    const token = match[0];
    key++;

    if (token.startsWith('"') || token.startsWith("'")) {
      tokens.push(<span key={key} className="text-emerald-300">{token}</span>);
    } else if (token.startsWith('@')) {
      tokens.push(<span key={key} className="text-amber-400 font-semibold">{token}</span>);
    } else if (pythonKeywords.has(token)) {
      tokens.push(<span key={key} className="text-cyan-400 font-semibold">{token}</span>);
    } else if (pythonTypes.has(token)) {
      tokens.push(<span key={key} className="text-sky-300 font-medium">{token}</span>);
    } else if (/^\d+(?:\.\d+)?$/.test(token)) {
      tokens.push(<span key={key} className="text-amber-300">{token}</span>);
    } else {
      tokens.push(<span key={key} className="text-slate-200">{token}</span>);
    }
  }

  return (
    <span key={index}>
      {tokens}
      {commentPart && <span className="text-slate-500 italic">{commentPart}</span>}
    </span>
  );
}

export const ProjectCodePreview: React.FC<ProjectCodePreviewProps> = ({ snippet, projectTitle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = snippet.code.trim().split('\n');

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playSuccess();
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const toggleExpand = () => {
    soundFx.playChirp(isExpanded ? 550 : 750);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-4 rounded-xl border border-cyan-950 bg-[#060a14] overflow-hidden transition-all duration-300">
      {/* Expand/Collapse Header Bar */}
      <button
        onClick={toggleExpand}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-slate-950 via-[#0a1124] to-slate-950 hover:bg-cyan-950/40 border-b border-cyan-950 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {isExpanded ? 'Hide Model Architecture Code' : 'Expand Core Model Architecture'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-code bg-cyan-950/80 border border-cyan-500/20 text-cyan-300">
                {snippet.language}
              </span>
            </div>
            <p className="text-[11px] font-mono-code text-slate-400 truncate">
              {snippet.architectureHighlight}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-mono-code text-cyan-400/80 hidden sm:inline">
            {lines.length} lines
          </span>
          <div className="p-1 rounded bg-slate-900 border border-cyan-950 text-slate-400 group-hover:text-cyan-300 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expandable Code Container */}
      {isExpanded && (
        <div className="animate-in fade-in duration-200 divide-y divide-cyan-950">
          {/* File Tab Header */}
          <div className="px-4 py-2 bg-[#080d1a] flex items-center justify-between gap-2 text-xs font-mono-code">
            <div className="flex items-center gap-2 text-slate-300">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">{snippet.filename}</span>
              <span className="text-slate-500 text-[10px]">({snippet.language})</span>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[11px] font-mono-code transition-colors cursor-pointer"
              title="Copy code snippet to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax-Highlighted Code Body */}
          <div className="relative p-3 sm:p-4 bg-[#050811] overflow-x-auto max-h-[380px] overflow-y-auto">
            <pre className="font-mono-code text-xs leading-relaxed flex">
              {/* Line Numbers Column */}
              <div 
                className="select-none pr-3 sm:pr-4 mr-3 sm:mr-4 border-r border-slate-800/80 text-slate-600 text-right font-mono-code text-xs" 
                aria-hidden="true"
              >
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code Tokens Column */}
              <div className="flex-1 text-slate-200">
                {lines.map((line, i) => (
                  <div key={i} className="hover:bg-cyan-950/20 px-1 rounded transition-colors whitespace-pre">
                    {renderHighlightedLine(line, i)}
                  </div>
                ))}
              </div>
            </pre>
          </div>

          {/* Architecture Highlights Footer */}
          {snippet.highlights && snippet.highlights.length > 0 && (
            <div className="p-3 bg-[#070c18] flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono-code text-slate-500 flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                PIPELINE HIGHLIGHTS:
              </span>
              {snippet.highlights.map((h, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-slate-900 border border-cyan-950 text-cyan-400"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
