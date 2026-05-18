import type { ReactNode } from "react";

type ConfirmationRowProps = {
  icon: ReactNode;
  label: string;
  primary: string;
  secondary: string;
};

export const ConfirmationRow = ({
  icon,
  label,
  primary,
  secondary,
}: ConfirmationRowProps) => (
  <div className="flex gap-4 py-5 first:pt-0 last:pb-0">
    <span className="mt-1 text-brand-blue-600">{icon}</span>
    <div className="space-y-1">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{primary}</p>
      <p className="text-sm leading-6 text-slate-600">{secondary}</p>
    </div>
  </div>
);
