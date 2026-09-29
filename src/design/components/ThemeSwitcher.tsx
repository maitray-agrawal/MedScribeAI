import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, Sun, Moon, FileText, Mountain } from 'lucide-react';

export type VaidhyaTheme = 'primary' | 'dark' | 'monochrome' | 'sandstone';

interface ThemeOption {
  id: VaidhyaTheme;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    bg: string;
    surface: string;
    accent: string;
  };
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'primary',
    label: 'Primary',
    subtitle: 'Ivory & Forest Green',
    icon: Sun,
    colors: { bg: '#FDF7EC', surface: '#FAF4E8', accent: '#166534' },
  },
  {
    id: 'dark',
    label: 'Dark',
    subtitle: 'Deep Ink & Forest',
    icon: Moon,
    colors: { bg: '#15100B', surface: '#221B14', accent: '#22C55E' },
  },
  {
    id: 'monochrome',
    label: 'Monochrome',
    subtitle: 'Carbon & Print Ready',
    icon: FileText,
    colors: { bg: '#F8F9FA', surface: '#FFFFFF', accent: '#18181B' },
  },
  {
    id: 'sandstone',
    label: 'Sandstone',
    subtitle: 'Warm Earth & Copper',
    icon: Mountain,
    colors: { bg: '#EADCC8', surface: '#FAF4E9', accent: '#B87333' },
  },
];

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [currentTheme, setCurrentTheme] = useState<VaidhyaTheme>('primary');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or document
  useEffect(() => {
    try {
      const saved = (localStorage.getItem('vaidhya-theme') as VaidhyaTheme) || 'primary';
      if (['primary', 'dark', 'monochrome', 'sandstone'].includes(saved)) {
        setCurrentTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch {}
  }, []);

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTheme = (theme: VaidhyaTheme) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem('vaidhya-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch {}
    setIsOpen(false);
  };

  const activeOption = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        id="btn-theme-switcher"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="vx-btn-outline text-xs px-2.5 py-1.5 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--vx-focus)]"
        title="Select Application Theme"
        aria-label="Theme selector"
        aria-expanded={isOpen}
      >
        <span
          className="w-3 h-3 rounded-full border border-[var(--vx-border-strong)] shrink-0"
          style={{ backgroundColor: activeOption.colors.accent }}
        />
        <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
          {activeOption.label}
        </span>
        <Palette className="w-3.5 h-3.5 text-[var(--vx-text-muted)]" />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-56 vx-card-elevated p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-2.5 py-1.5 border-b border-[var(--vx-border)] mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[var(--vx-text-subtle)] uppercase block font-semibold">
              Sovereign Themes
            </span>
          </div>

          <div className="space-y-0.5">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = currentTheme === theme.id;
              const IconComp = theme.icon;

              return (
                <button
                  key={theme.id}
                  id={`theme-opt-${theme.id}`}
                  type="button"
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-[var(--vx-radius-sm)] flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--vx-primary-soft)] text-[var(--vx-primary)] font-semibold'
                      : 'hover:bg-[var(--vx-surface-muted)] text-[var(--vx-text)] font-normal'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Mini Swatch */}
                    <div
                      className="w-4 h-4 rounded-full border border-[var(--vx-border-strong)] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: theme.colors.bg }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>

                    <div>
                      <span className="font-sans block text-[13px] leading-tight font-medium">
                        {theme.label}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--vx-text-muted)] block leading-tight">
                        {theme.subtitle}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[var(--vx-primary)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
