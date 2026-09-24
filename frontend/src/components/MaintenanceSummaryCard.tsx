type MaintenanceSummaryCardProps = {
  label: string;
  value: number;
  description: string;
  tone?: "default" | "warning" | "danger" | "success";
};

const toneClasses: Record<NonNullable<MaintenanceSummaryCardProps["tone"]>, string> = {
  default: "border-stone-200 bg-white text-[#20211F]",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

function MaintenanceSummaryCard({
  label,
  value,
  description,
  tone = "default",
}: MaintenanceSummaryCardProps) {
  return (
    <div className={`rounded-2xl border p-5 shadow-[0_8px_24px_rgba(72,66,52,0.06)] transition-transform duration-200 hover:-translate-y-0.5 ${toneClasses[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{label}</p>

      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>

      <p className="mt-2 text-sm text-stone-500">{description}</p>
    </div>
  );
}

export default MaintenanceSummaryCard;
