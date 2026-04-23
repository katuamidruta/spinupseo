"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ToggleActive({ id, isActive }: { id: string; isActive: boolean }) {
  const [active, setActive] = useState(isActive);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !active }),
    });
    setActive(!active);
    setLoading(false);
    router.refresh();
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${active ? "bg-green-500" : "bg-gray-200"} disabled:opacity-60`}>
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${active ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}
