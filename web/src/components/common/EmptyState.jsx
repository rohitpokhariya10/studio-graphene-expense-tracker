const EmptyState = ({ action, description, icon = "+", title }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center">
    <div className="flex size-12 items-center justify-center rounded-full border border-emerald-100 bg-white text-lg font-semibold text-emerald-700 shadow-sm">
      {icon}
    </div>
    <p className="mt-4 text-sm font-semibold text-slate-950">{title}</p>
    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
      {description}
    </p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);

export default EmptyState;
