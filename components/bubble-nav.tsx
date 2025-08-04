import { Card } from "@/components/ui/card";
import { NavButton } from "@/components/nav-button";
import { LogIn, UserPlus, Home } from "lucide-react";
import Link from "next/link";

export function BubbleNav() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-lg shadow-black/10 rounded-full px-8 py-4">
        <div className="flex items-center gap-6">
          
          <NavButton
            asChild
            variant="outline"
            size="sm"
          >
            <Link href="/auth/login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </NavButton>
          
          <NavButton
            asChild
            size="sm"
          >
            <Link href="/auth/sign-up" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Link>
          </NavButton>
        </div>
      </Card>
    </div>
  );
} 