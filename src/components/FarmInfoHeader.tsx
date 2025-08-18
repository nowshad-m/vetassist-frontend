import type { CaseRequest } from "@/types/recommendations";

interface FarmInfoHeaderProps {
  caseData: CaseRequest;
  title?: string;
}

export default function FarmInfoHeader({ caseData, title }: FarmInfoHeaderProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {title || "Case Information"}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">Farm ID</label>
              <span className="text-lg font-semibold text-slate-800">{caseData.farm_id}</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">Farm Name</label>
              <span className="text-lg font-semibold text-slate-800">{caseData.farm_name}</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">Stock Class ID</label>
              <span className="text-lg font-semibold text-slate-800">{caseData.stock_class_id}</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">Stock Class Name</label>
              <span className="text-lg font-semibold text-slate-800">
                {getStockClassName(caseData.stock_class_id)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get stock class name from ID
function getStockClassName(stockClassId: string): string {
  const stockClassMap: Record<string, string> = {
    "SC-001": "Dairy Cattle",
    "SC-002": "Beef Cattle", 
    "SC-003": "Sheep",
    "SC-004": "Sport Horses",
    "SC-005": "Goats",
    "SC-006": "Breeding Sows"
  };
  return stockClassMap[stockClassId] || stockClassId;
}
