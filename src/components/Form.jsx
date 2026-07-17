export default function Form({ title, children, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="mt-5 space-y-4">{children}</div>
    </form>
  );
}