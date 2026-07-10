import "./PromoBanner.css";

export default function PromoBanner({ title, subtitle, cta, image, to, align = "left" }) {
  return (
    <a href={to || "#"} className={`promo-banner promo-${align}`}>
      <img src={image} alt="" loading="lazy" />
      <div className="promo-overlay" />
      <div className="promo-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        {cta && <span className="promo-cta">{cta} →</span>}
      </div>
    </a>
  );
}
