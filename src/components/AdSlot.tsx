import { useEffect } from 'react';

interface AdSlotProps {
  slot: string;
  className?: string;
  layout?: string;
  test?: boolean;
}

export function AdSlot({ slot, className = 'my-6', layout = 'in-article', test = false }: AdSlotProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [slot]);

  return (
    <div className={className} aria-label="advertisement" style={{ minWidth: '300px', width: '100%' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client="ca-pub-7675766348174556"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-layout={layout}
        {...(test ? { 'data-adtest': 'on' } : {})}
      />
    </div>
  );
}

export default AdSlot;

