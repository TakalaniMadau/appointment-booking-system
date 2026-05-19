import type { ReactNode } from "react";

type SummaryTileProps = {
  icon: ReactNode;
  label: string;
  primary: string;
  secondary?: string;
};

export const SummaryTile = ({
  icon,
  label,
  primary,
  secondary,
}: SummaryTileProps) => (
  <div className="rounded-field border border-brand-blue-200 bg-brand-blue-50 px-4 py-4">
    <div className="flex items-start gap-3">
      <span className="mt-1 text-brand-blue-600">{icon}</span>
      <div className="space-y-1">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{primary}</p>
        {secondary ? (
          <p className="text-sm leading-6 text-slate-600">{secondary}</p>
        ) : null}
      </div>
    </div>
  </div>
);
