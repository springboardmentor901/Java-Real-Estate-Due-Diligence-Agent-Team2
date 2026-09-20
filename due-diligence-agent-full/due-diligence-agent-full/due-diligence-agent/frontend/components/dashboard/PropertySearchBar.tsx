"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function PropertySearchBar() {
  const router = useRouter();
  const [address, setAddress] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = address.trim() ? `?address=${encodeURIComponent(address.trim())}` : "";
    router.push(`/properties${params}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Input
          placeholder="Search by address…"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          aria-label="Search properties by address"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
