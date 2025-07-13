import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Protected Page</h1>
        <LogoutButton />
      </div>
      
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">Your user details</h2>
        <pre className="text-sm font-mono p-4 rounded border bg-gray-50 max-h-64 overflow-auto">
          {JSON.stringify(data.user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
