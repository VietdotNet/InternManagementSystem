import { useState, useMemo } from 'react';

export function useProgramSearch(programs) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return programs;
    const q = query.toLowerCase();
    return programs.filter(
      (p) =>
        p.programName.toLowerCase().includes(q)
    );
  }, [programs, query]);

  return { query, setQuery, filtered };
}
