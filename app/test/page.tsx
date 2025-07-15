"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/test", { method: "POST" });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto py-10 px-4 flex flex-col gap-4">
      <Button onClick={handleTest} disabled={loading}>
        {loading ? "Testing..." : "Send Test Request"}
      </Button>
      <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto min-h-[80px]">
        {result || "No result yet."}
      </pre>
    </main>
  );
} 