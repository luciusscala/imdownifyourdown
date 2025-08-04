import { SignUpForm } from "@/components/sign-up-form";
import { BubbleNav } from "@/components/bubble-nav";

export default function Page() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </main>
      <BubbleNav />
    </>
  );
}
