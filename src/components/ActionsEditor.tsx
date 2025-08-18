"use client";
import { useState, useEffect } from "react";

export default function ActionsEditor({value,onChange}:{value:string[];onChange:(v:string[])=>void}) {
  const [items,setItems]=useState<string[]>(value||[]);
  useEffect(()=>setItems(value||[]),[value]);
  
  const update=(i:number,action:string)=>{ 
    const next=[...items]; 
    next[i]=action; 
    setItems(next); 
    onChange(next); 
  };
  
  const add=()=>{ 
    const next=[...items,""]; 
    setItems(next); 
    onChange(next); 
  };
  
  const remove=(i:number)=>{ 
    const next=items.filter((_,idx)=>idx!==i); 
    setItems(next); 
    onChange(next); 
  };
  
  return (
    <div className="space-y-4">
      {items.map((action,i)=>(
        <div key={i} className="card">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <input 
              className="sm:col-span-10 input-field" 
              placeholder="Recommended action" 
              value={action} 
              onChange={e=>update(i,e.target.value)}
            />
            <button 
              aria-label="Remove action"
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
      <button className="btn-secondary w-full" onClick={add}>Add Action</button>
    </div>
  );
}
