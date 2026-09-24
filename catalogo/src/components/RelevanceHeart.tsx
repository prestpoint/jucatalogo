import { Heart } from 'lucide-react';
import { relevanceLevels, type RelevanceLevel } from '../catalog/relevance';

export function RelevanceHeart({ level }: { level: RelevanceLevel }) {
  const { color, label } = relevanceLevels[level];
  return <span className="relevance-heart" role="img" title={label} aria-label={label}>
    <Heart size={18} fill={color} stroke="none" aria-hidden="true" />
  </span>;
}
