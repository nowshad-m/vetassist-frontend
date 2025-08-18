"use client";
import { useEffect, useState } from "react";
import type { RecommendationResponse, CaseRequest } from "@/types/recommendations";
import FarmInfoHeader from "@/components/FarmInfoHeader";
import Breadcrumb from "@/components/Breadcrumb";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [id, setId] = useState<string>("");
  const [rec, setRec] = useState<RecommendationResponse | null>(null);
  const [req, setReq] = useState<CaseRequest | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      const a = localStorage.getItem(`rec-${id}-accepted`);
      const r = localStorage.getItem(`req-${id}`);
      if (a) setRec(JSON.parse(a));
      if (r) setReq(JSON.parse(r));
    }
  }, [id]);

  if (!rec || !req) return (
    <div className="py-4 sm:py-8">
      <div className="text-center">
        <p className="text-lg text-neutral-600">No accepted plan found.</p>
        <a className="text-primary-700 underline mt-2 inline-block" href={`/recommendations/${id}`}>Go back</a>
      </div>
    </div>
  );

  return (
    <div className="py-4 sm:py-8">
      <Breadcrumb 
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Case Notes", href: `/case/${id}` },
          { label: "Recommendations", href: `/recommendations/${id}` },
          { label: "Job Sheet" }
        ]} 
      />
      
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4 sm:mb-6">Job Sheet</h1>

      <FarmInfoHeader caseData={req} title="Case Information" />

      <div className="card print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-800">Treatment Plan</h2>
          <button 
            className="btn-secondary w-full sm:w-auto" 
            onClick={() => window.print()}
          >
            Print / Save PDF
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-neutral-800">Summary</h3>
            <p className="text-neutral-700 bg-neutral-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">{rec.case_summary}</p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-neutral-800">Actions</h3>
            <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
              {rec.recommended_actions?.map((a, i) => (
                <li key={i} className="text-neutral-700 text-sm sm:text-base">
                  <span className="font-semibold text-primary-600">[{a.severity ?? "-"} P{a.priority ?? "-"}]</span> {a.action}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-neutral-800">Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border border-neutral-200 rounded-lg overflow-hidden">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="p-2 sm:p-3 text-left text-neutral-700 font-medium">Name</th>
                    <th className="p-2 sm:p-3 text-center text-neutral-700 font-medium">Dose</th>
                    <th className="p-2 sm:p-3 text-center text-neutral-700 font-medium">Route</th>
                    <th className="p-2 sm:p-3 text-center text-neutral-700 font-medium">Duration</th>
                    <th className="p-2 sm:p-3 text-center text-neutral-700 font-medium">Withholding</th>
                  </tr>
                </thead>
                <tbody>
                  {rec.products?.map((p, i) => (
                    <tr key={i} className="border-t border-neutral-200 hover:bg-neutral-50">
                      <td className="p-2 sm:p-3 font-medium text-neutral-800">{p.name}</td>
                      <td className="p-2 sm:p-3 text-center text-neutral-600">{p.dose || "-"}</td>
                      <td className="p-2 sm:p-3 text-center text-neutral-600">{p.route || "-"}</td>
                      <td className="p-2 sm:p-3 text-center text-neutral-600">{p.duration || "-"}</td>
                      <td className="p-2 sm:p-3 text-center text-neutral-600">
                        {p.withholding_period ? `milk:${p.withholding_period.milk || "-"} meat:${p.withholding_period.meat || "-"}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {rec.job_sheet?.instructions?.length ? (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-neutral-800">Instructions</h3>
              <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-neutral-700 text-sm sm:text-base">
                {rec.job_sheet.instructions.map((i, k) => (<li key={k}>{i}</li>))}
              </ul>
            </div>
          ) : null}

          {rec.follow_up?.length ? (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-neutral-800">Follow-up</h3>
              <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-neutral-700 text-sm sm:text-base">
                {rec.follow_up.map((f, k) => (<li key={k}>{f}</li>))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
