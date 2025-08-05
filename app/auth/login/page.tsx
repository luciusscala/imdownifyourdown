import { LoginForm } from "@/components/login-form";
import { BubbleNav } from "@/components/bubble-nav";
import { Home, UserPlus } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    variant: "ghost" as const,
  },
  {
    label: "Sign Up",
    href: "/auth/sign-up",
    icon: UserPlus,
    variant: "default" as const,
  },
];

export default function Page() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
      <BubbleNav items={navItems} />
    </>
  );
}
