import { Heart, Plus, ArrowUpRight } from "lucide-react";
export default function ProductCard({ product: p, favorites, favorite, view }) {
  return (
    <article className="product-card">
      <div className="product-photo">
        <button
          className="photo-button"
          onClick={() => view(p)}
          aria-label={`${p.name} ansehen`}
        >
          <img
            src={`./images/${p.image}.webp`}
            alt={`Originalfoto: ${p.fullName} in ${p.color} mit Thor Steinar Logo`}
            loading="lazy"
            width="768"
            height="768"
          />
        </button>
        {p.isNew && <span className="product-label">Neu</span>}
        <button
          className={`favorite icon-button ${favorites.includes(p.id) ? "active" : ""}`}
          aria-label={`${p.name} ${favorites.includes(p.id) ? "aus der Merkliste entfernen" : "merken"}`}
          aria-pressed={favorites.includes(p.id)}
          onClick={() => favorite(p.id)}
        >
          <Heart aria-hidden="true" size={19} />
        </button>
        <button className="quick-view" onClick={() => view(p)}>
          Produkt ansehen <Plus aria-hidden="true" size={16} />
        </button>
      </div>
      <div className="product-meta">
        <div>
          <p>
            {p.category} · {p.color}
          </p>
          <h3>
            <button onClick={() => view(p)}>{p.name}</button>
          </h3>
        </div>
      </div>
      <a
        className="source-link"
        href={p.source}
        target="_blank"
        rel="noreferrer"
        aria-label={`${p.fullName}: Preis und Verfügbarkeit im Originalshop`}
      >
        Im Originalshop <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </article>
  );
}
