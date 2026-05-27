"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

interface Suggestion {
  place_id: number;
  display_name: string;
}

interface Props {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: React.ReactNode;
  required?: boolean;
}

/** Shorten "Ujjain, Ujjain, Madhya Pradesh, 456001, India" → "Ujjain, Madhya Pradesh" */
function shortName(displayName: string): string {
  const parts = displayName.split(",").map((p) => p.trim());
  // Remove duplicates, zip codes, "India"
  const seen = new Set<string>();
  const clean = parts.filter((p) => {
    if (/^\d+$/.test(p)) return false;   // zip codes
    if (p.toLowerCase() === "india") return false;
    if (seen.has(p.toLowerCase())) return false;
    seen.add(p.toLowerCase());
    return true;
  });
  return clean.slice(0, 3).join(", ");
}

export default function LocationInput({
  id,
  value,
  onChange,
  placeholder,
  label,
  required,
}: Props) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes (e.g. URL params pre-filling)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?q=${encodeURIComponent(q)}&format=json&limit=7&countrycodes=in&addressdetails=0`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "en-IN,en" },
      });
      const data: Suggestion[] = await res.json();
      setSuggestions(data);
      setActiveIdx(-1);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 380);
  }

  function handleSelect(s: Suggestion) {
    const name = shortName(s.display_name);
    setQuery(name);
    onChange(name);
    setSuggestions([]);
    setOpen(false);
    setActiveIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          autoComplete="off"
          spellCheck={false}
          required={required}
          className="input pr-9"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 animate-spin">
            <FaSpinner />
          </span>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-ink-100 overflow-hidden max-h-56 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li key={s.place_id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()} // keep focus on input
                onClick={() => handleSelect(s)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-start gap-2.5 transition-colors ${
                  idx === activeIdx
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-800 hover:bg-ink-50"
                }`}
              >
                <FaMapMarkerAlt className="text-brand-500 mt-0.5 shrink-0 text-xs" />
                <span className="line-clamp-2 leading-snug">
                  {shortName(s.display_name)}
                  <span className="block text-xs text-ink-400 truncate">
                    {s.display_name}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
