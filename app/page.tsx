import { BubbleNav } from "@/components/bubble-nav";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-medium mb-6 leading-tight">
              &ldquo;Wherever you go, go with all your heart [and friends]&rdquo;
            </h1>
            <p className="text-xl font-light tracking-wide">
              Confucius
            </p>
          </div>
        </div>
      </main>
      <BubbleNav />
    </>
  );
}
