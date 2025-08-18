"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { RecommendationResponse } from "@/types/recommendations";
import Breadcrumb from "@/components/Breadcrumb";

export default function Page() {
  const [items, setItems] = useState<{ id: string; rec: RecommendationResponse }[]>([]);
  
  useEffect(() => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith("rec-") && !k.endsWith("-accepted"));
    const rows = keys.map(k => ({ id: k.replace("rec-", ""), rec: JSON.parse(localStorage.getItem(k) || "{}") }));
    setItems(rows);
  }, []);
  
  return (
    <div className="py-4 sm:py-8">
      <Breadcrumb 
        items={[
          { label: "Dashboard", href: "/" },
          { label: "History" }
        ]} 
      />
      
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4 sm:mb-6">History</h1>
      
      {items.length === 0 ? (
        <div className="card text-center text-neutral-500">
          <p className="text-lg">No cases yet.</p>
          <p className="text-sm mt-2">Start by capturing case notes from planned visits.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Cards View */}
          <div className="block sm:hidden space-y-3">
            {items.map(it => (
              <div key={it.id} className="card">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-neutral-800">Case {it.id}</h3>
                    <span className="px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                      {it.rec?.likely_conditions?.[0] || "-"}
                    </span>
                  </div>
                  
                  <p className="text-neutral-700 text-sm">
                    {it.rec?.case_summary?.slice(0, 120) || "No summary available"}...
                  </p>
                  
                  <div className="flex flex-col space-y-2">
                    <Link 
                      className="btn-secondary text-center"
                      href={`/recommendations/${it.id}`}
                    >
                      View Rec
                    </Link>
                    <Link 
                      className="btn-secondary text-center"
                      href={`/job-sheet/${it.id}`}
                    >
                      Job Sheet
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <h2 className="text-lg font-semibold text-neutral-800">Case History</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="p-4 text-left text-neutral-700 font-medium">Case</th>
                  <th className="p-4 text-left text-neutral-700 font-medium">Summary</th>
                  <th className="p-4 text-left text-neutral-700 font-medium">Primary Condition</th>
                  <th className="p-4 text-right text-neutral-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr key={it.id} className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-medium text-neutral-800">{it.id}</td>
                    <td className="p-4 text-neutral-700">{it.rec?.case_summary?.slice(0, 80) || "-"}</td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-lg bg-primary-50 text-primary-800 text-sm border border-primary-200 font-medium">
                        {it.rec?.likely_conditions?.[0] || "-"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <Link 
                        className="btn-secondary" 
                        href={`/recommendations/${it.id}`}
                      >
                        View Rec
                      </Link>
                      <Link 
                        className="btn-secondary" 
                        href={`/job-sheet/${it.id}`}
                      >
                        Job Sheet
                      </Link>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td className="p-8 text-center text-neutral-500" colSpan={4}>
                      <p className="text-lg">No cases yet.</p>
                      <p className="text-sm mt-2">Start by capturing case notes from planned visits.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
