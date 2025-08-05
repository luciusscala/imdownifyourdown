import { SignUpForm } from "@/components/sign-up-form";
import { BubbleNav } from "@/components/bubble-nav";
import { Home, LogIn } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    variant: "ghost" as const,
  },
  {
    label: "Sign In",
    href: "/auth/login",
    icon: LogIn,
    variant: "outline" as const,
  },
];

export default function Page() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </main>
      <BubbleNav items={navItems} />
    </>
  );
}
