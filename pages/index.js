import React from 'react';
import dynamic from 'next/dynamic';

const ChocolateTracker = dynamic(() => import('../components/ChocolateTracker'), {
  loading: () => <div style={{padding: '40px', textAlign: 'center', fontSize: '18px'}}>⏳ Dashboard yükleniyor...</div>,
  ssr: false
});

export default function Home() {
  return (
    <main>
      <ChocolateTracker />
    </main>
  );
}
