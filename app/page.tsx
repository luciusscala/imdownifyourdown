import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-medium mb-4">"Wherever you go, go with all your heart [and friends]"</h1>
        <p className="text-lg mb-8">Confucius</p>
        
        <div className="flex gap-4 justify-center">
          <Button 
            asChild
            style={{ backgroundColor: '#283618' }}
            className="hover:opacity-90 text-white"
          >
            <Link href="/auth/login">
              Login
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline"
            style={{ borderColor: '#283618', color: '#283618' }}
            className="hover:bg-[#283618] hover:text-white"
          >
            <Link href="/auth/sign-up">
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
