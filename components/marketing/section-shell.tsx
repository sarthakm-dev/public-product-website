export function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8 space-y-4">
        {eyebrow ? (
          <p className="font-mono text-xs tracking-[0.22em] text-cyan-400 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <div className="max-w-3xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="text-base leading-8 text-slate-300 md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
