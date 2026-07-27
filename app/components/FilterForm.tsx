'use client';

import {useEffect, useState} from 'react';

export function FilterForm() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [restored, setRestored] = useState(false);

  // Restore persisted UI state after mount — a common dashboard pattern
  // (state update arriving while streaming hydration may still be in progress).
  useEffect(() => {
    const saved = window.sessionStorage.getItem('filter-keyword');
    if (saved !== null) {
      setKeyword(saved);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem('filter-keyword', keyword);
  }, [keyword]);

  return (
    <section>
      <h2>Filter {restored ? '(restored)' : ''}</h2>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="keyword" />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">all</option>
        <option value="active">active</option>
        <option value="archived">archived</option>
      </select>
    </section>
  );
}
