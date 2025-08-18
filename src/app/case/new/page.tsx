"use client";
import Link from "next/link";

export default function NewCasePage() {
  return (
    <div className="py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4 sm:mb-6">New Case</h1>
      <div className="card text-center py-6 sm:py-8">
        <p className="text-base sm:text-lg text-neutral-600 mb-3 sm:mb-4">
          Cases should be created from planned visits on the dashboard.
        </p>
        <p className="text-sm sm:text-base text-neutral-500 mb-4 sm:mb-6">
          Please go back to the dashboard and select a visit to capture case notes.
        </p>
        <Link 
          href="/"
          className="btn-primary w-full sm:w-auto"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
