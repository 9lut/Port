'use client';

import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface DevIcon {
  name: string;
  label: string;
  variants: string[];
}

// Curated list of popular devicons
const DEVICONS: DevIcon[] = [
  { name: 'html5', label: 'HTML5', variants: ['original', 'original-wordmark', 'plain'] },
  { name: 'css3', label: 'CSS3', variants: ['original', 'original-wordmark', 'plain'] },
  { name: 'javascript', label: 'JavaScript', variants: ['original', 'plain'] },
  { name: 'typescript', label: 'TypeScript', variants: ['original', 'plain'] },
  { name: 'react', label: 'React', variants: ['original', 'original-wordmark'] },
  { name: 'nextjs', label: 'Next.js', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'vuejs', label: 'Vue.js', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'nuxtjs', label: 'Nuxt.js', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'angular', label: 'Angular', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'svelte', label: 'Svelte', variants: ['original', 'plain'] },
  { name: 'nodejs', label: 'Node.js', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'express', label: 'Express', variants: ['original', 'original-wordmark'] },
  { name: 'nestjs', label: 'NestJS', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'python', label: 'Python', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'django', label: 'Django', variants: ['plain', 'plain-wordmark'] },
  { name: 'fastapi', label: 'FastAPI', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'flask', label: 'Flask', variants: ['original', 'original-wordmark'] },
  { name: 'java', label: 'Java', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'spring', label: 'Spring', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'go', label: 'Go', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'rust', label: 'Rust', variants: ['original', 'plain'] },
  { name: 'cplusplus', label: 'C++', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'csharp', label: 'C#', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'ruby', label: 'Ruby', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'rails', label: 'Ruby on Rails', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'php', label: 'PHP', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'laravel', label: 'Laravel', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'kotlin', label: 'Kotlin', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'swift', label: 'Swift', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'dart', label: 'Dart', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'flutter', label: 'Flutter', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'mysql', label: 'MySQL', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'postgresql', label: 'PostgreSQL', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'mongodb', label: 'MongoDB', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'redis', label: 'Redis', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'sqlite', label: 'SQLite', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'firebase', label: 'Firebase', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'supabase', label: 'Supabase', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'docker', label: 'Docker', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'kubernetes', label: 'Kubernetes', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'git', label: 'Git', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'github', label: 'GitHub', variants: ['original', 'original-wordmark'] },
  { name: 'gitlab', label: 'GitLab', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'bitbucket', label: 'Bitbucket', variants: ['original', 'original-wordmark'] },
  { name: 'linux', label: 'Linux', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'ubuntu', label: 'Ubuntu', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'debian', label: 'Debian', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'nginx', label: 'Nginx', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'apache', label: 'Apache', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'aws', label: 'AWS', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'googlecloud', label: 'Google Cloud', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'azure', label: 'Azure', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'heroku', label: 'Heroku', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'vercel', label: 'Vercel', variants: ['original', 'original-wordmark'] },
  { name: 'webpack', label: 'Webpack', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'vite', label: 'Vite', variants: ['original'] },
  { name: 'babel', label: 'Babel', variants: ['original', 'original-wordmark'] },
  { name: 'jest', label: 'Jest', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'mocha', label: 'Mocha', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'graphql', label: 'GraphQL', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'tailwindcss', label: 'Tailwind CSS', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'bootstrap', label: 'Bootstrap', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'sass', label: 'Sass', variants: ['original', 'original-wordmark'] },
  { name: 'less', label: 'Less', variants: ['plain', 'plain-wordmark'] },
  { name: 'figma', label: 'Figma', variants: ['original', 'original-wordmark'] },
  { name: 'xcode', label: 'Xcode', variants: ['original', 'original-wordmark'] },
  { name: 'vscode', label: 'VS Code', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'vim', label: 'Vim', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'tensorflow', label: 'TensorFlow', variants: ['original', 'original-wordmark'] },
  { name: 'pytorch', label: 'PyTorch', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'numpy', label: 'NumPy', variants: ['original', 'original-wordmark'] },
  { name: 'pandas', label: 'Pandas', variants: ['original', 'original-wordmark'] },
  { name: 'anaconda', label: 'Anaconda', variants: ['original', 'original-wordmark'] },
  { name: 'jupyter', label: 'Jupyter', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'electron', label: 'Electron', variants: ['original', 'original-wordmark'] },
  { name: 'threejs', label: 'Three.js', variants: ['original', 'original-wordmark'] },
  { name: 'opencv', label: 'OpenCV', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'trello', label: 'Trello', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'jira', label: 'Jira', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'slack', label: 'Slack', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'photoshop', label: 'Photoshop', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
  { name: 'illustrator', label: 'Illustrator', variants: ['original', 'original-wordmark', 'plain', 'plain-wordmark'] },
];



function parseIconUrl(url: string): { name: string; variant: string } | null {
  const match = url.match(/icons\/([^/]+)\/([^/]+)-([^.]+)\.svg$/);
  if (!match) return null;
  return { name: match[1], variant: match[3] };
}

interface DevIconPickerProps {
  value: string;
  onChange: (url: string) => void;
  skillName?: string; // when provided, auto-match icon from name
}

// Normalize a string for fuzzy matching (remove dots, spaces, dashes, lowercase)
function normalize(s: string): string {
  return s.toLowerCase().replace(/[.\s\-_]/g, '');
}

// Find the best matching devicon for a given skill name
export function findMatchingIcon(name: string): { icon: DevIcon; variant: string } | null {
  if (!name.trim()) return null;
  const n = normalize(name);
  // Exact match on name field first
  let match = DEVICONS.find((d) => normalize(d.name) === n || normalize(d.label) === n);
  // Partial match fallback
  if (!match) {
    match = DEVICONS.find(
      (d) => normalize(d.name).includes(n) || n.includes(normalize(d.name)) ||
             normalize(d.label).includes(n) || n.includes(normalize(d.label))
    );
  }
  if (!match) return null;
  // Prefer 'original' variant, else first available
  const variant = match.variants.includes('original') ? 'original' : match.variants[0];
  return { icon: match, variant };
}

export function getIconUrl(name: string, variant: string): string {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;
}

export default function DevIconPicker({ value, onChange, skillName }: DevIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<{ name: string; variant: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse existing value on mount/change
  useEffect(() => {
    if (value) {
      const parsed = parseIconUrl(value);
      setSelectedIcon(parsed);
    } else {
      setSelectedIcon(null);
    }
  }, [value]);

  // Auto-match icon when skillName changes (only if no icon selected yet)
  useEffect(() => {
    if (!skillName || value) return;
    const matched = findMatchingIcon(skillName);
    if (matched) {
      const url = getIconUrl(matched.icon.name, matched.variant);
      onChange(url);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillName]);

  // Pre-fill search with skill name when opening
  const handleOpen = () => {
    if (!isOpen && skillName && !search) {
      setSearch(skillName);
    }
    setIsOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = search.trim()
    ? DEVICONS.filter(
        (d) =>
          d.label.toLowerCase().includes(search.toLowerCase()) ||
          d.name.toLowerCase().includes(search.toLowerCase())
      )
    : DEVICONS;

  const handleSelect = (icon: DevIcon, variant: string) => {
    const url = getIconUrl(icon.name, variant);
    onChange(url);
    setSelectedIcon({ name: icon.name, variant });
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange('');
    setSelectedIcon(null);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      >
        {selectedIcon ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getIconUrl(selectedIcon.name, selectedIcon.variant)}
              alt={selectedIcon.name}
              className="w-7 h-7 object-contain flex-shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="flex-1 text-left text-sm text-gray-800 font-medium">
              {DEVICONS.find((d) => d.name === selectedIcon.name)?.label ?? selectedIcon.name}{' '}
              <span className="text-gray-400 font-normal">({selectedIcon.variant})</span>
            </span>
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </span>
          </>
        ) : (
          <>
            <span className="flex-1 text-left text-sm text-gray-400">Select an icon from devicons...</span>
            <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {filtered.length} icon{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Icon grid */}
          <div className="overflow-y-auto max-h-72 p-3">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No icons found</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((icon) => (
                  <div key={icon.name}>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                      {icon.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {icon.variants.map((variant) => {
                        const url = getIconUrl(icon.name, variant);
                        const isSelected =
                          selectedIcon?.name === icon.name && selectedIcon?.variant === variant;
                        return (
                          <button
                            key={variant}
                            type="button"
                            onClick={() => handleSelect(icon, variant)}
                            title={`${icon.label} - ${variant}`}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-150 hover:border-blue-400 hover:bg-blue-50 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-transparent bg-gray-50'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`${icon.name}-${variant}`}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).closest('button')?.remove();
                              }}
                            />
                            <span className="text-xs text-gray-500 max-w-[70px] truncate text-center">
                              {variant}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add custom URL fallback */}
          <div className="border-t border-gray-100 p-3">
            <p className="text-xs text-gray-400 mb-2">Or paste a custom image URL:</p>
            <input
              type="url"
              placeholder="https://example.com/icon.svg"
              defaultValue={value && !parseIconUrl(value) ? value : ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
