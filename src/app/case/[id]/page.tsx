"use client";
import { useEffect, useState } from "react";
import visits from "@/data/visits.json";
import type { CaseRequest, RecommendationResponse, Visit } from "@/types/recommendations";
import FarmInfoHeader from "@/components/FarmInfoHeader";
import Breadcrumb from "@/components/Breadcrumb";
import VoiceInput from "@/components/VoiceInput";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [id, setId] = useState<string>("");
  const [pre, setPre] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Handle async params
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
        await fetchVisitData(resolvedParams.id);
      } catch (error) {
        console.error("Error resolving params:", error);
        setLoading(false);
      }
    };
    resolveParams();
  }, [params]);

  const fetchVisitData = async (visitId: string) => {
    try {
      setLoading(true);
      
      // For now, use sample data directly since we don't have a visits API
      const foundVisit = visits.find((v) => v.id === visitId) as Visit | undefined;
      if (foundVisit) {
        setPre(foundVisit);
      } else {
        console.error('Visit not found in sample data');
      }
      
      // TODO: When you have a visits API, uncomment this:
      // const response = await fetch(`/api/visits/${visitId}`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // 
      // if (response.ok) {
      //   const visitData = await response.json();
      //   setPre(visitData);
      // } else {
      //   // Fallback to sample data if API fails
      //   console.warn('API failed, using sample data');
      //   const foundVisit = visits.find((v) => v.id === visitId) as Visit | undefined;
      //   if (foundVisit) {
      //     setPre(foundVisit);
      //   } else {
      //     throw new Error('Visit not found');
      //   }
      // }
      
    } catch (err) {
      console.error('Error fetching visit data:', err);
      // Fallback to sample data
      const foundVisit = visits.find((v) => v.id === visitId) as Visit | undefined;
      if (foundVisit) {
        setPre(foundVisit);
      }
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState<CaseRequest>({
    farm_id: "",
    farm_name: "",
    stock_class_id: "",
    clinical_notes: ""
  });

  // Update form when pre data is available
  useEffect(() => {
    if (pre) {
      setForm(prev => ({
        ...prev,
        farm_id: pre.farm_id || "",
        farm_name: pre.farm_name || "",
        stock_class_id: pre.stock_class_id || ""
      }));
    }
  }, [pre]);

  const set = (k: keyof CaseRequest, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  async function generate() {
    if (!form.clinical_notes?.trim()) { 
      alert("Clinical notes are required"); 
      return; 
    }
    
    localStorage.setItem(`req-${id}`, JSON.stringify(form));
    
    try {
      const res = await fetch("/api/recommendations", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(form) 
      });
      
      if (!res.ok) { 
        alert("API error: " + res.statusText); 
        return; 
      }
      
      const data: RecommendationResponse = await res.json();
      localStorage.setItem(`rec-${id}`, JSON.stringify(data));
      window.location.href = `/recommendations/${id}`;
    } catch (error) {
      alert("Error generating recommendations: " + error);
    }
  }

  if (loading) {
    return (
      <div className="py-4 sm:py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600">Loading case information...</p>
        </div>
      </div>
    );
  }

  if (!pre) {
    return (
      <div className="py-4 sm:py-8">
        <div className="text-center">
          <p className="text-lg text-neutral-600">Case not found.</p>
          <Link className="text-primary-700 underline mt-2 inline-block" href="/">Go back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-8">
      <Breadcrumb 
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Case Notes" }
        ]} 
      />
      
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4 sm:mb-6">
        Case Notes - {pre.farm_name}
      </h1>

      <FarmInfoHeader caseData={form} title="Visit Information" />

      <div className="card">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 sm:mb-3">Clinical Notes</label>
            <VoiceInput 
              value={form.clinical_notes}
              onChange={(value) => set("clinical_notes", value)}
              placeholder="Enter clinical notes, symptoms, observations..."
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8 text-center">
        <button 
          className="btn-primary w-full sm:w-auto px-8 py-4" 
          onClick={generate}
        >
          Generate Recommendations
        </button>
      </div>
    </div>
  );
}
