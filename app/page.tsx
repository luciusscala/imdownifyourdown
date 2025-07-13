import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-lg text-gray-600 mb-8">Your app is ready!</p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/auth/login" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </Link>
          <Link 
            href="/auth/sign-up" 
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
