interface RatingStarsProps {
  value: number; // 0..5
  className?: string;
}

export function RatingStars({ value, className = '' }: RatingStarsProps) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const total = 5;
  const stars: string[] = [];
  for (let i = 0; i < full; i++) stars.push('full');
  if (half && stars.length < total) stars.push('half');
  while (stars.length < total) stars.push('empty');

  return (
    <span className={`inline-flex items-center ${className}`} aria-label={`Rated ${value} out of 5`}>
      {stars.map((t, i) => (
        <span key={i} className={t === 'empty' ? 'text-gray-300' : 'text-yellow-500'}>
          {t === 'half' ? '★' : '★'}
        </span>
      ))}
    </span>
  );
}

export default RatingStars;

