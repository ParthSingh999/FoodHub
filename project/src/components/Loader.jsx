import "./Loader.css";

export default function Loader({ label = "Loading deliciousness…" }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="loader-plate">
        <div className="loader-fork" />
        <div className="loader-knife" />
        <div className="loader-spinner" />
      </div>
      <p className="loader-label">{label}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="skel skel-img" />
      <div className="skel skel-line w-80" />
      <div className="skel skel-line w-50" />
      <div className="skel skel-line w-40" />
    </div>
  );
}
