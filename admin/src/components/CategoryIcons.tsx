import {
  Baby,
  Bath,
  BriefcaseMedical,
  Crown,
  Droplets,
  Eye,
  Flower2,
  Gem,
  Gift,
  Grid2X2,
  Hand,
  Heart,
  Package,
  Palette,
  Scissors,
  Shirt,
  ShoppingBag,
  Smile,
  Sparkles,
  SprayCan,
  Sun,
  UserRound,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

export const categoryIconOptions: Array<{ id: string; label: string; icon: LucideIcon }> = [
  { id: "perfume", label: "Perfume", icon: SprayCan },
  { id: "bath", label: "Banho", icon: Bath },
  { id: "makeup", label: "Maquiagem", icon: WandSparkles },
  { id: "hair", label: "Cabelos", icon: Scissors },
  { id: "face", label: "Rosto", icon: Smile },
  { id: "eyes", label: "Olhos", icon: Eye },
  { id: "skincare", label: "Cuidados", icon: Hand },
  { id: "hydration", label: "Hidratação", icon: Droplets },
  { id: "sun", label: "Solar", icon: Sun },
  { id: "baby", label: "Infantil", icon: Baby },
  { id: "men", label: "Masculino", icon: UserRound },
  { id: "fashion", label: "Roupas", icon: Shirt },
  { id: "jewelry", label: "Joias", icon: Gem },
  { id: "flower", label: "Floral", icon: Flower2 },
  { id: "palette", label: "Cores", icon: Palette },
  { id: "sparkles", label: "Brilho", icon: Sparkles },
  { id: "favorites", label: "Favoritos", icon: Heart },
  { id: "gift", label: "Presentes", icon: Gift },
  { id: "package", label: "Kits", icon: Package },
  { id: "shopping", label: "Compras", icon: ShoppingBag },
  { id: "premium", label: "Premium", icon: Crown },
  { id: "health", label: "Saúde", icon: BriefcaseMedical },
  { id: "grid", label: "Outros", icon: Grid2X2 },
];

export const normalizeCategoryIcon = (name: string) => name === "smile" ? "face" : name === "lipstick" ? "makeup" : name;

export function AdminCategoryIcon({ name }: { name: string }) {
  const Icon = categoryIconOptions.find((item) => item.id === normalizeCategoryIcon(name))?.icon ?? Grid2X2;
  return <Icon />;
}
