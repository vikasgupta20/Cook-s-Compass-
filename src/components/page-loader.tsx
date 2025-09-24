'use client';

import { useNProgress } from 'next-nprogress/client';

const NProgress = ({ children }: { children: React.ReactNode }) => {
  useNProgress();
  return children;
};

export function PageLoader() {
  return (
    <NProgress>
      <div
        id="nprogress-container"
        style={{
          '--nprogress-color': 'hsl(var(--primary))',
          pointerEvents: 'none',
          position: 'relative',
          zIndex: '99999',
        }}
      />
    </NProgress>
  );
}
