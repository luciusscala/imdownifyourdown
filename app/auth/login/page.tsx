import { LoginForm } from "@/components/login-form";
import { BubbleNav } from "@/components/bubble-nav";

export default function Page() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
      <BubbleNav />
    </>
  );
}
