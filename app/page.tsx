import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#fefae0] to-[#faf3d0]">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-medium mb-6 leading-tight text-[#283618]">
            &ldquo;Wherever you go, go with all your heart [and friends]&rdquo;
          </h1>
          <p className="text-xl text-[#000000] font-light tracking-wide">
            Confucius
          </p>
        </div>
        
        <Button 
          asChild
          size="lg"
          style={{ 
            backgroundColor: '#283618',
            color: '#fefae0',
            boxShadow: '0 4px 14px 0 rgba(40, 54, 24, 0.25)',
            transition: 'all 0.2s ease-in-out'
          }}
          className="hover:opacity-90 hover:scale-105 hover:shadow-lg font-semibold tracking-wide text-base px-10 py-4 rounded-lg border-0"
        >
          <Link href="/waitlist">
            Join the waitlist
          </Link>
        </Button>
      </div>
    </main>
  );
}
