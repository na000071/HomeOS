import Card from "./Card";

type WarrantySummaryCardProps = {
  label: string;
  value: number;
  description: string;
  tone: "default" | "success" | "warning" | "danger";
};

const toneClasses: Record<WarrantySummaryCardProps["tone"], string> = {
  default: "text-sky-950",
  success: "text-emerald-700",
  warning: "text-amber-700",
  danger: "text-red-700",
};

function WarrantySummaryCard({
  label,
  value,
  description,
  tone,
}: WarrantySummaryCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-tight ${toneClasses[tone]}`}>
        {value}
      </p>
      <p className="mt-2 text-sm text-stone-500">{description}</p>
    </Card>
  );
}

export default WarrantySummaryCard;