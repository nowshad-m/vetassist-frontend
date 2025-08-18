"use client";
type Prod = { name: string; rationale: string; usage: string };

export default function ProductsTable({value,onChange}:{value:Prod[];onChange:(v:Prod[])=>void}) {
  const update=(i:number,patch:Partial<Prod>)=>{ 
    const next=[...value]; 
    next[i]={...next[i],...patch}; 
    onChange(next); 
  };
  
  const add=()=>onChange([...(value||[]),{name:"", rationale:"", usage:""}]);
  
  const remove=(i:number)=>onChange(value.filter((_,idx)=>idx!==i));
  
  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="col-span-4">
          <span className="text-sm font-medium text-neutral-700">Product Name</span>
        </div>
        <div className="col-span-4">
          <span className="text-sm font-medium text-neutral-700">Rationale</span>
        </div>
        <div className="col-span-3">
          <span className="text-sm font-medium text-neutral-700">Usage</span>
        </div>
        <div className="col-span-1 text-center">
          <span className="text-sm font-medium text-neutral-700">Actions</span>
        </div>
      </div>
      
      {/* Table Rows */}
      <div className="space-y-2">
        {(value||[]).map((p,i)=>(
          <div key={i} className="grid grid-cols-12 gap-4 px-4 py-3 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
            <div className="col-span-4">
              <input 
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-neutral-400" 
                placeholder="Product name" 
                value={p.name||""} 
                onChange={e=>update(i,{name:e.target.value})}
              />
            </div>
            <div className="col-span-4">
              <input 
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-neutral-400" 
                placeholder="Rationale" 
                value={p.rationale||""} 
                onChange={e=>update(i,{rationale:e.target.value})}
              />
            </div>
            <div className="col-span-3">
              <input 
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-neutral-400" 
                placeholder="Usage" 
                value={p.usage||""} 
                onChange={e=>update(i,{usage:e.target.value})}
              />
            </div>
            <div className="col-span-1 flex justify-center">
              <button 
                aria-label="Remove product"
                title="Remove"
                className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors" 
                onClick={()=>remove(i)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0l1-2h6l1 2m-8 0h8" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Button */}
      <button 
        className="w-full px-4 py-3 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:border-neutral-400 transition-colors flex items-center justify-center space-x-2" 
        onClick={add}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Product</span>
      </button>
    </div>
  );
}
