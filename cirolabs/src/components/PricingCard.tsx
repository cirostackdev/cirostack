import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative p-8 rounded-2xl border flex flex-col",
        highlighted
          ? "border-2 border-[#E53935] bg-[#E53935]/5"
          : "border-border bg-card"
      )}
    >
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#E53935]/10 text-[#E53935]">
          {badge}
        </span>
      )}

      <h3 className="font-display text-xl font-bold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="mb-6">
        <span className="font-display text-3xl font-bold text-foreground">{price}</span>
        {period && <span className="text-sm text-muted-foreground ml-1">{period}</span>}
      </div>

      <ul className="space-y-2 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
            <svg className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
