export interface CaseRequest {
    farm_id: string;
    farm_name: string;
    stock_class_id: string;
    clinical_notes: string;
  }
  
  export interface Visit {
    id: string;
    farm_id: string;
    farm_name: string;
    stock_class_id: string;
    stock_class_name: string;
    animal_species: "bovine" | "ovine" | "caprine" | "equine" | "porcine" | "canine" | "feline" | string;
    animal_id: string;
    time: string;
    status: "New" | "In-Progress" | "Completed" | "Cancelled";
    date?: string;
  }
  
  export interface RecommendationResponse {
    case_summary: string;
    likely_conditions: string[];
    recommended_actions: string[];
    suggested_products: { name: string; rationale: string; usage: string }[];
    follow_up?: string | string[];
    red_flags?: string | string[];
    job_sheet?: { title: string; instructions: string[]; consumables?: string[] };
    metadata?: { model?: string; created_at?: string; confidence?: number };
    citations?: string[];
  }
  