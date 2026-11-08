import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { products } from "./data";

export default function SearchPanel({ onView }) {
  const [query, setQuery] = useState("");
  const results = products.filter((product) =>
    `${product.fullName} ${product.category} ${product.color} ${product.audience}`
      .toLocaleLowerCase("de")
      .includes(query.trim().toLocaleLowerCase("de")),
  );
  return (
    <>
      <h2 id="dialog-title">
        DEIN LOOK.
        <br />
        DEINE SUCHE.
      </h2>
      <label className="search-input">
        <Search size={22} aria-hidden="true" />
        <input
          type="search"
          name="q"
          autoComplete="off"
          placeholder="Jacken, Hoodies, Accessoires …"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Modelle suchen"
        />
      </label>
      <p className="results-count" role="status">
        {results.length} {results.length === 1 ? "Produkt" : "Produkte"}
      </p>
      <div className="mini-list">
        {results.map((product) => (
          <button
            className="mini-product"
            key={product.id}
            onClick={() => onView(product)}
          >
            <img
              src={`./images/${product.image}.webp`}
              alt=""
              width="80"
              height="95"
            />
            <span>
              <strong>{product.name}</strong>
              <small>
                {product.category} · {product.color}
              </small>
            </span>
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        ))}
      </div>
      {!results.length && (
        <p className="panel-note">
          Keine Treffer. Versuche „Jacken“, „Hoodies“ oder „Schwarz“.
        </p>
      )}
    </>
  );
}
