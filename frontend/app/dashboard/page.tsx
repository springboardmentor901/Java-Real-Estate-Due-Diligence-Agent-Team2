"use client";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">

        <h1 className="text-3xl font-bold text-gray-900">
          Welcome!
        </h1>

        <p className="text-gray-600 mt-3">
          You have successfully logged in.
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg
                     font-semibold hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </main>
  );
}