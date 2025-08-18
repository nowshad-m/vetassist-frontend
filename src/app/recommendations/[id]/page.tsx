"use client";
import { useEffect, useState } from "react";
import type { RecommendationResponse, CaseRequest } from "@/types/recommendations";
import ActionsEditor from "@/components/ActionsEditor";
import ProductsTable from "@/components/ProductsTable";
import Breadcrumb from "@/components/Breadcrumb";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [id, setId] = useState<string>("");
  const [rec, setRec] = useState<RecommendationResponse | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [products, setProducts] = useState<{ name: string; rationale: string; usage: string }[]>([]);
  const [follow, setFollow] = useState<string>("");
  const [flags, setFlags] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebugTools, setShowDebugTools] = useState(false);

  // Function to clear old sample data
  const clearOldData = () => {
    // Clear any old sample data that might be cached
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('rec-') && key !== `rec-${id}`) {
        localStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      clearOldData(); // Clear old data first
      fetchRecommendations();
    }
  }, [id]); // Remove function dependencies to avoid circular reference

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have recommendations in localStorage (from case page)
      const localData = localStorage.getItem(`rec-${id}`);
      if (localData) {
        const localRec = JSON.parse(localData) as RecommendationResponse;
        console.log("📋 Loaded data from localStorage:", localRec);
        setRec(localRec);
        setActions(localRec.recommended_actions || []);
        setProducts(localRec.suggested_products || []);
        setFollow((localRec.follow_up || []).join("\n"));
        setFlags((localRec.red_flags || []).join("\n"));
      } else {
        // No recommendations found - user needs to generate them first
        setError("No recommendations found. Please go back to the case page and generate recommendations first.");
      }
      
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err instanceof Error ? err.message : "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  // Function to regenerate recommendations (for testing purposes)
  const regenerateRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Regenerating recommendations...");
      
      // Get the actual case data from localStorage (from case page)
      const caseData = localStorage.getItem(`req-${id}`);
      console.log("📋 Case data from localStorage:", caseData);
      
      if (!caseData) {
        setError("No case data found. Please go back to the case page and generate recommendations first.");
        setLoading(false);
        return;
      }
      
      const caseRequest = JSON.parse(caseData) as CaseRequest;
      console.log("📤 Sending case request to API:", caseRequest);
      
      // Call the API with the actual case data
      const response = await fetch(`/api/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseRequest)
      });

      console.log("📥 API response status:", response.status);
      console.log("📥 API response headers:", Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const apiRec = await response.json();
        console.log("✅ API response data:", apiRec);
        
        // Use the new API response format directly
        const mappedRec: RecommendationResponse = {
          case_summary: apiRec.result?.case_summary || '',
          likely_conditions: apiRec.result?.likely_conditions || [],
          recommended_actions: apiRec.result?.recommended_actions || [],
          suggested_products: apiRec.result?.suggested_products || [],
          follow_up: apiRec.result?.follow_up || [],
          red_flags: apiRec.result?.red_flags || [],
          job_sheet: apiRec.result?.job_sheet,
          metadata: apiRec.result?.metadata,
          citations: apiRec.result?.citations
        };
        
        setRec(mappedRec);
        setActions(mappedRec.recommended_actions || []);
        setProducts(mappedRec.suggested_products || []);
        setFollow((mappedRec.follow_up || []).join("\n"));
        setFlags((mappedRec.red_flags || []).join("\n"));
        
        // Store in localStorage for future use
        localStorage.setItem(`rec-${id}`, JSON.stringify(mappedRec));
        console.log("💾 Stored recommendations in localStorage");
      } else {
        const errorText = await response.text();
        console.error("❌ API error response:", errorText);
        throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
      }
      
    } catch (err) {
      console.error("💥 Error regenerating recommendations:", err);
      setError(err instanceof Error ? err.message : "Failed to regenerate recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error: {error}</p>
          <div className="space-x-4 mb-6">
            <button 
              onClick={fetchRecommendations}
              className="btn-primary px-6 py-2"
            >
              Retry
            </button>
            <button 
              onClick={regenerateRecommendations}
              className="btn-secondary px-6 py-2"
            >
              Regenerate from API
            </button>
          </div>
          
          <a className="text-primary-700 underline mt-4 inline-block" href={`/case/${id}`}>
            Go back to case
          </a>
        </div>
      </div>
    );
  }

  if (!rec) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-lg text-neutral-600">No recommendations found.</p>
          <a className="text-primary-700 underline mt-2 inline-block" href={`/case/${id}`}>Go back to case</a>
        </div>
      </div>
    );
  }

  const accept = () => {
    const accepted: RecommendationResponse = {
      ...rec,
      recommended_actions: actions,
      suggested_products: products,
      follow_up: follow.split(/\r?\n/).filter(Boolean),
      red_flags: flags.split(/\r?\n/).filter(Boolean),
    };
    localStorage.setItem(`rec-${id}-accepted`, JSON.stringify(accepted));
    window.location.href = `/job-sheet/${id}`;
  };
  
  const copyJSON = () => navigator.clipboard.writeText(JSON.stringify({ ...rec, recommended_actions: actions, suggested_products: products }, null, 2));

  return (
    <div className="py-8">
      <Breadcrumb 
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Case Notes", href: `/case/${id}` },
          { label: "Recommendations" }
        ]} 
      />
      
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">AI Recommendations</h1>

      {/* Debug Tools Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowDebugTools(!showDebugTools)}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showDebugTools ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>Debug Tools</span>
        </button>
        
        {showDebugTools && (
          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">🧪 Test API Functionality</h3>
            <p className="text-blue-700 mb-3">Use this button to test your Azure API directly:</p>
            <button 
              onClick={regenerateRecommendations}
              className="btn-primary px-6 py-2"
            >
              Test API Call
            </button>
            <p className="text-sm text-blue-600 mt-2">Check browser console for detailed logs</p>
          </div>
        )}
      </div>

      {/* Top Section: Summary and Likely Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Case Summary */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-800">Case Summary</h2>
          </div>
          <p className="text-neutral-700 leading-relaxed">{rec.case_summary}</p>
        </div>

        {/* Likely Conditions */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-800">Likely Conditions</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {rec.likely_conditions?.map((c, i) => (
              <span key={i} className="px-3 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium border border-orange-200">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content and Sidebar Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content - Actions and Products */}
        <div className="xl:col-span-3 space-y-6">
          {/* Recommended Actions */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-neutral-800">Recommended Actions</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Review and customize the recommended actions for your treatment plan.</p>
            <ActionsEditor value={actions} onChange={setActions} />
          </div>

          {/* Products */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-neutral-800">Products & Medications</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Review and customize the recommended products with their rationale and usage instructions.</p>
            <ProductsTable value={products} onChange={setProducts} />
          </div>

          {/* Follow-up and Red Flags */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Follow-up */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">Follow-up</h3>
              </div>
              <textarea 
                className="input-field" 
                rows={4} 
                value={follow} 
                onChange={e => setFollow(e.target.value)} 
                placeholder="Enter follow-up instructions..."
              />
            </div>

            {/* Red Flags */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">Red Flags</h3>
              </div>
              <textarea 
                className="input-field" 
                rows={4} 
                value={flags} 
                onChange={e => setFlags(e.target.value)} 
                placeholder="Enter red flags and warnings..."
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Action Buttons */}
        <div className="xl:col-span-1">
          <div className="card sticky top-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800">Actions</h3>
            </div>
            
            <div className="space-y-3">
              <button 
                className="w-full btn-primary flex items-center justify-center space-x-2" 
                onClick={accept}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Accept to Job Sheet</span>
              </button>
              
              <button 
                className="w-full btn-secondary flex items-center justify-center space-x-2" 
                onClick={copyJSON}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy JSON</span>
              </button>
              
              <a 
                className="w-full btn-secondary flex items-center justify-center space-x-2" 
                href={`/case/${id}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Re-run</span>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Actions:</span>
                  <span className="font-medium text-neutral-800">{actions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Products:</span>
                  <span className="font-medium text-neutral-800">{products.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Conditions:</span>
                  <span className="font-medium text-neutral-800">{rec.likely_conditions?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
