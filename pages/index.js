import dynamic from 'next/dynamic';

const ChocolateTracker = dynamic(() => import('../components/ChocolateTracker'), {
  loading: () => <div style={{padding: '20px', textAlign: 'center'}}>⏳ Yükleniyor...</div>,
  ssr: false
});

export default function Home() {
  return (
    <div>
      <ChocolateTracker />
    </div>
  );
}
