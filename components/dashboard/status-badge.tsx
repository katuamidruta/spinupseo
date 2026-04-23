import { cn } from "@/lib/utils";

const STATUS_MAP = {
  pending_verification: { label: "Verifying Payment", class: "bg-orange-50 text-orange-700 border-orange-200" },
  pending:    { label: "Pending",    class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  processing: { label: "Processing", class: "bg-blue-50 text-blue-700 border-blue-200" },
  completed:  { label: "Completed",  class: "bg-green-50 text-green-700 border-green-200" },
  cancelled:  { label: "Cancelled",  class: "bg-gray-100 text-gray-500 border-gray-200" },
} as const;

type Status = keyof typeof STATUS_MAP;

export default function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status as Status] ?? STATUS_MAP.pending;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", s.class)}>
      {s.label}
    </span>
  );
}
