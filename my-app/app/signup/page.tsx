// app/signup/page.tsx
"use client";

import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Create Your Account
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
