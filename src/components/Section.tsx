export default function Section({title, desc, children}:{title:string; desc?:string; children:React.ReactNode}) {
    return (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-800">{title}</h2>
        {desc && <p className="text-sm text-neutral-500 mb-2">{desc}</p>}
        <div className="card">{children}</div>
      </section>
    );
  }
  