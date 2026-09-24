import {
  Bath,
  Gift,
  Grid2X2,
  Package,
  Smile,
  Sparkles,
  SprayCan,
} from "lucide-react";

const icons = {
  perfume: SprayCan,
  bath: Bath,
  sparkles: Sparkles,
  smile: Smile,
  lipstick: Sparkles,
  gift: Gift,
  package: Package,
  grid: Grid2X2,
};
export function CategoryIcon({ name }: { name: string }) {
  const Icon = icons[name as keyof typeof icons] || Grid2X2;
  return <Icon size={19} />;
}
