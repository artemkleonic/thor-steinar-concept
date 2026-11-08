import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";
import { categories, products, official } from "./data";
import ProductCard from "./ProductCard";

function BrandMark() {
  return (
    <img
      className="brand-mark"
      src="./images/brand/logo-original.png"
      alt="THOR STEINAR"
      width="357"
      height="117"
    />
  );
}

export default function Storefront({
  favorites,
  cartCount,
  onBrowse,
  onPanel,
  onView,
  onFavorite,
  filter,
  onFilter,
  gender,
  onGender,
  onInfo,
  scrolled,
  newOnly,
  visible,
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Zum Inhalt springen
      </a>
      <div className="announcement">
        Unabhängiges Designkonzept · Kein offizieller Shop
      </div>
      <header className={scrolled ? "site-header scrolled" : "site-header"}>
        <button
          className="mobile-toggle icon-button"
          onClick={() => onPanel("menu")}
          aria-label="Menü öffnen"
        >
          <Menu aria-hidden="true" />
        </button>
        <a
          className="brand-home"
          href="#"
          aria-label="Thor Steinar Startseite"
          translate="no"
        >
          <BrandMark />
        </a>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          <button onClick={() => onBrowse("Alle", "Herren")}>Herren</button>
          <button onClick={() => onBrowse("Alle", "Damen")}>Damen</button>
          <button
            className={newOnly ? "nav-new selected" : "nav-new"}
            onClick={() => onBrowse("Alle", "Alle", "new")}
          >
            Neuheiten
          </button>
          <button onClick={() => onBrowse("Jacken")}>Jacken</button>
          <button onClick={() => onBrowse("Hoodies")}>Hoodies</button>
          <button onClick={() => onBrowse("Accessoires")}>Accessoires</button>
        </nav>
        <div className="header-tools">
          <button
            className="icon-button"
            aria-label="Suche öffnen"
            onClick={() => onPanel("search")}
          >
            <Search size={21} aria-hidden="true" />
          </button>
          <button
            className="icon-button"
            aria-label={`Merkliste öffnen, ${favorites.length} Artikel`}
            onClick={() => onPanel("favorites")}
          >
            <Heart size={21} aria-hidden="true" />
            {favorites.length > 0 && (
              <span className="counter">{favorites.length}</span>
            )}
          </button>
          <button
            className="icon-button"
            aria-label={`Warenkorb öffnen, ${cartCount} Artikel`}
            onClick={() => onPanel("cart")}
          >
            <ShoppingBag size={21} aria-hidden="true" />
            {cartCount > 0 && <span className="counter">{cartCount}</span>}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <picture>
            <source
              media="(max-width:600px)"
              srcSet="./images/brand/hero-mobile.webp"
            />
            <img
              className="hero-image"
              src="./images/brand/hero.webp"
              width="1536"
              height="1024"
              fetchPriority="high"
              alt="KI-Kampagnenkonzept: Model in der schwarzen Thor Steinar Jacke EIKIN II mit Brustlogo an einer Küste"
            />
          </picture>
          <div className="hero-shade" />
          <div className="hero-content">
            <h1 id="hero-title">
              NORDIC
              <br />
              COMPANY.
            </h1>
            <p>
              Jacken, Hoodies und T-Shirts.
              <br />
              Dein Look. Dein eigener Weg.
            </p>
            <button className="button button-white" onClick={() => onBrowse()}>
              KOLLEKTION ENTDECKEN <ArrowUpRight size={20} aria-hidden="true" />
            </button>
            <button
              className="hero-product-link"
              onClick={() => onView(products[0])}
            >
              Im Bild: EIKIN II <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="hero-bottom">
            <span>KI-Kampagnenkonzept mit Originalprodukt</span>
            <a href="#categories">
              Weiter entdecken <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </section>
        <section
          className="section category-section"
          id="categories"
          aria-labelledby="categories-title"
        >
          <div className="section-heading">
            <h2 id="categories-title">FINDE DEINEN LOOK.</h2>
            <div className="audience-shortcuts">
              <button onClick={() => onBrowse("Alle", "Herren")}>
                Herren <ArrowUpRight size={16} aria-hidden="true" />
              </button>
              <button onClick={() => onBrowse("Alle", "Damen")}>
                Damen <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="category-layout">
            <button
              className="jacket-category"
              onClick={() => onBrowse("Jacken")}
            >
              <img
                src="./images/brand/eikin.webp"
                width="960"
                height="960"
                loading="lazy"
                alt="Originalfoto der schwarzen Jacke EIKIN II mit Thor Steinar Brustlogo"
              />
              <div>
                <span className="category-title">JACKEN</span>
                <span>
                  Entdecke EIKIN II{" "}
                  <ArrowUpRight size={20} aria-hidden="true" />
                </span>
              </div>
            </button>
            <div className="category-links">
              {categories.slice(1).map(([name, description, image]) => (
                <button
                  className="category-link"
                  key={name}
                  onClick={() => onBrowse(name)}
                >
                  <img
                    src={`./images/${image}.webp`}
                    width="960"
                    height="960"
                    loading="lazy"
                    alt=""
                  />
                  <span>
                    <strong>{name.toUpperCase()}</strong>
                    <small>{description}</small>
                  </span>
                  <ArrowUpRight size={23} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </section>
        <section
          className="section catalog"
          id="highlights"
          aria-labelledby="catalog-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="catalog-title">
                {newOnly ? "NEU ENTDECKEN." : "UNSERE HIGHLIGHTS."}
              </h2>
              <p className="section-description">
                Originalprodukte. Markante Details. Thor Steinar.
              </p>
            </div>
            <button className="text-link" onClick={() => onBrowse()}>
              Alle Produkte <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="catalog-toolbar">
            <div className="filter-tabs" aria-label="Produktkategorien">
              {["Alle", ...categories.map((c) => c[0])].map((name) => (
                <button
                  key={name}
                  aria-pressed={filter === name}
                  className={filter === name ? "selected" : ""}
                  onClick={() => onFilter(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <label className="audience-filter">
              <SlidersHorizontal size={16} aria-hidden="true" />
              <select
                aria-label="Zielgruppe"
                value={gender}
                onChange={(event) => onGender(event.target.value)}
              >
                <option value="Alle">Alle Looks</option>
                <option>Herren</option>
                <option>Damen</option>
              </select>
            </label>
          </div>
          <p className="catalog-count" role="status">
            {visible.length} {visible.length === 1 ? "Produkt" : "Produkte"}
            {newOnly ? " · Auswahl aus den Neuheiten" : ""}
          </p>
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                favorites={favorites}
                favorite={onFavorite}
                view={onView}
              />
            ))}
          </div>
          {visible.length === 0 && (
            <div className="empty-state">
              <p>Für diese Auswahl zeigen wir noch kein Produkt.</p>
              <button className="text-link" onClick={() => onBrowse()}>
                Alle Produkte anzeigen{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
          <p className="catalog-note">
            Originalfotos und Produktangaben aus dem offiziellen Shop.
            Größenwahl und Warenkorb sind eine Demonstration; Preise und
            Verfügbarkeit findest du beim jeweiligen Originalprodukt.
          </p>
        </section>
        <section className="detail-story" aria-labelledby="detail-title">
          <div className="detail-story-image">
            <img
              src="./images/brand/support-detail.webp"
              alt="Originale Detailaufnahme des Thor Steinar Frontmotivs am T-Shirt SUPPORT 2.0"
              width="960"
              height="960"
              loading="lazy"
            />
          </div>
          <div className="detail-story-copy">
            <h2 id="detail-title">
              DER NAME.
              <br />
              DIE DETAILS.
            </h2>
            <p>
              Ein Brustlogo. Eine Stickerei. Ein Schriftzug, der bleibt.
              Entdecke die Markendetails der ausgewählten Jacken, Hoodies und
              T-Shirts.
            </p>
            <p className="product-fact">
              SUPPORT 2.0
              <br />
              <span>Frontprint „Nordic Company“ · 100 % Baumwolle</span>
            </p>
            <button className="text-link" onClick={() => onView(products[2])}>
              SUPPORT 2.0 ansehen <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
        </section>
        <section
          className="women-story"
          id="collection"
          aria-labelledby="women-title"
        >
          <img
            src="./images/brand/women-campaign.webp"
            alt="KI-generiertes Model im weißen Thor Steinar Damen-T-Shirt SUPPORT mit originalem Frontmotiv"
            width="1536"
            height="1024"
            loading="lazy"
          />
          <div className="women-shade" />
          <div className="women-story-copy">
            <h2 id="women-title">
              DEIN STIL.
              <br />
              DEIN AUSDRUCK.
            </h2>
            <p>
              SUPPORT und LEGENDARY.
              <br />
              Entdecke die Auswahl für Damen.
            </p>
            <button
              className="button button-white"
              onClick={() => onBrowse("Alle", "Damen")}
            >
              DAMEN ENTDECKEN <ArrowUpRight size={20} aria-hidden="true" />
            </button>
            <small>KI-Kampagnenkonzept · T-Shirt SUPPORT</small>
          </div>
        </section>
        <div className="official-handoff">
          <p>Dein Look ist dabei?</p>
          <a href={official} target="_blank" rel="noreferrer">
            Zum offiziellen Shop <ArrowUpRight size={25} aria-hidden="true" />
          </a>
        </div>
      </main>
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a
              className="brand-home"
              href="#"
              aria-label="Thor Steinar nach oben"
            >
              <BrandMark />
            </a>
            <p>
              Ein unabhängiger Entwurf für
              <br />
              ein neues Einkaufserlebnis.
            </p>
          </div>
          <div className="footer-col">
            <h3>SERVICE</h3>
            <button onClick={() => onInfo("Einkaufen im Konzept")}>
              Hilfe zum Konzept
            </button>
            <button onClick={() => onPanel("favorites")}>
              Meine Merkliste
            </button>
            <button onClick={() => onPanel("cart")}>Demo-Warenkorb</button>
            <a
              href={`${official}Informationen/Groessentabellen/`}
              target="_blank"
              rel="noreferrer"
            >
              Offizielle Größentabellen{" "}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
          <div className="footer-col">
            <h3>INFORMATIONEN</h3>
            <button onClick={() => onInfo("Über dieses Konzept")}>
              Über dieses Konzept
            </button>
            <button onClick={() => onInfo("Bild- und Markenrechte")}>
              Bild- und Markenrechte
            </button>
            <button onClick={() => onInfo("Datenschutz")}>Datenschutz</button>
          </div>
          <div className="footer-col">
            <h3>KONTAKT</h3>
            <a
              href={`${official}Informationen/Kontakt/`}
              target="_blank"
              rel="noreferrer"
            >
              Offizieller Kontakt <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <h3 className="social-heading">SOCIAL MEDIA</h3>
            <button onClick={() => onInfo("Social Media")}>
              Offizielle Kanäle <ArrowUpRight size={13} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Inoffizielles Designkonzept. Keine Verbindung zu Thor Steinar oder
            MediaTex GmbH. Kein Verkauf. Marken und Originalfotos gehören ihren
            jeweiligen Rechteinhabern.
          </p>
          <a href="#">
            Nach oben <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}
