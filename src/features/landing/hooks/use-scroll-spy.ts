'use client';

import { useEffect, useState } from 'react';

export function useScrollSpy(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
            return;
          }
          visibleIds.delete(entry.target.id);
        });

        const nextId = sectionIds.find((id) => visibleIds.has(id));
        if (nextId) {
          setActiveId(nextId);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.2, 0.5, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
