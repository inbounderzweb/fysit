const COLOR_CLASSES = {
  indigo: "bg-indigo-100 text-indigo-600",
  neutral: "bg-neutral-100 text-neutral-500",
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  yellow: "bg-yellow-100 text-yellow-600",
  pink: "bg-pink-100 text-pink-600",
  teal: "bg-teal-100 text-teal-600",
} as const;

export type StatTileColor = keyof typeof COLOR_CLASSES;

export function StatTile({
  icon: Icon,
  label,
  value,
  delta,
  color,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
  /** Real count of new records this calendar month; 0 renders as a neutral "No change". */
  delta: number;
  color: StatTileColor;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${COLOR_CLASSES[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-semibold text-neutral-900">{value.toLocaleString()}</p>
      <p className="text-sm text-neutral-500">{label}</p>
      {delta > 0 ? (
        <p className="mt-1 text-xs font-medium text-green-600">↑ +{delta} this month</p>
      ) : (
        <p className="mt-1 text-xs font-medium text-neutral-400">No change</p>
      )}
    </div>
  );
}
