//import { LucideIconName } from "lucide-react";
export default function DashboardCard({
  label,
  amount,
  description,
  icon: Icon,
}) {
  return (
    <div className="bg-slate-200/50 shadow flex w-full flex-col gap-3 rounded-[5px] p-5">
      <section className="flex justify-between items-center gap-2">
        <p className="text-sm">{label}</p>
        <Icon className="w-4 h-4" />
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-primary">{amount}</h2>
        <p className="text-sm">{description}</p>
      </section>
    </div>
  );
}
