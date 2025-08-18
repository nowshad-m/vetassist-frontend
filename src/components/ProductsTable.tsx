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
    <div className="space-y-4">
      {(value||[]).map((p,i)=>(
        <div key={i} className="card">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <input 
              className="sm:col-span-4 input-field" 
              placeholder="Product name" 
              value={p.name||""} 
              onChange={e=>update(i,{name:e.target.value})}
            />
            <input 
              className="sm:col-span-4 input-field" 
              placeholder="Rationale" 
              value={p.rationale||""} 
              onChange={e=>update(i,{rationale:e.target.value})}
            />
            <input 
              className="sm:col-span-2 input-field" 
              placeholder="Usage" 
              value={p.usage||""} 
              onChange={e=>update(i,{usage:e.target.value})}
            />
            <button 
              aria-label="Remove product"
              title="Remove"
              className="sm:col-span-2 p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors w-full sm:w-auto justify-self-end" 
              onClick={()=>remove(i)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0l1-2h6l1 2m-8 0h8" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      <button className="btn-secondary w-full" onClick={add}>Add Product</button>
    </div>
  );
}
