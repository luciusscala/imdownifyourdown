"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#fefae0] to-[#faf3d0]">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-medium text-[#283618]">
              You're on the list!
            </CardTitle>
            <CardDescription className="text-base text-[#606c38]">
              Thanks for joining our waitlist. We'll notify you when we launch.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              asChild
              variant="outline"
              style={{ borderColor: '#283618', color: '#283618' }}
              className="hover:bg-[#283618] hover:text-white"
            >
              <Link href="/">
                Back to home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#fefae0] to-[#faf3d0]">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium text-[#283618]">
            Join the waitlist
          </CardTitle>
          <CardDescription className="text-base text-[#606c38]">
            Be the first to know when we launch. Travel planning made simple.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#283618] font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#283618] focus:border-[#283618] focus:ring-[#283618] bg-white/50"
              />
            </div>
            <Button 
              type="submit"
              style={{ backgroundColor: '#283618' }}
              className="w-full hover:opacity-90 text-white font-semibold tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Join waitlist"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button 
              asChild
              variant="ghost"
              className="text-[#283618] hover:bg-[#283618] hover:text-white"
            >
              <Link href="/">
                ← Back to home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 