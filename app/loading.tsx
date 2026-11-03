import { Spinner } from "@/components/tailgrids/core/spinner";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center py-28 gap-3 text-neutral-500">
      <Spinner size="lg" />
      <span className="text-sm font-medium">Loading...</span>
    </div>
  );
}

