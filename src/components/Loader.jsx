import Spinner from './Spinner';

export default function Loader() {
  return (
    <div className="flex items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-slate-300">
      <Spinner />
      <span className="ml-3">Cargando datos...</span>
    </div>
  );
}