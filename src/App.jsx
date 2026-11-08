import { useEffect, useRef, useState } from "react";
import Storefront from "./Storefront";
import Dialog from "./Dialog";
import Toast from "./Toast";
import SearchPanel from "./SearchPanel";

import { products, categories, official } from "./data";
import {
  ArrowUpRight,
  ArrowRight,
  Heart,
  ShoppingBag,
  X,
  Plus,
  Minus,
} from "lucide-react";
import "./brand.css";

function readStorage(key, fallback, validate) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return validate(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [favorites, setFavorites] = useState(() =>
    readStorage(
      "ts-concept-v2-favorites",
      [],
      (v) =>
        Array.isArray(v) && v.every((id) => products.some((p) => p.id === id)),
    ),
  );
  const [cart, setCart] = useState(() =>
    readStorage(
      "ts-concept-v2-cart",
      [],
      (v) =>
        Array.isArray(v) &&
        v.every(
          (i) =>
            products.some((p) => p.id === i.id && p.sizes.includes(i.size)) &&
            Number.isInteger(i.qty) &&
            i.qty > 0 &&
            i.qty <= 99,
        ),
    ),
  );
  const [panel, setPanel] = useState(null);
  const [selected, setSelected] = useState(products[0]);
  const [size, setSize] = useState("");
  const [filter, setFilter] = useState(() => {
    const requested = new URLSearchParams(location.search).get("kategorie");
    return ["Alle", ...categories.map((c) => c[0])].includes(requested)
      ? requested
      : "Alle";
  });
  const [newOnly, setNewOnly] = useState(
    () => new URLSearchParams(location.search).get("neu") === "1",
  );
  const [gender, setGender] = useState(() => {
    const requested = new URLSearchParams(location.search).get("auswahl");
    return ["Herren", "Damen"].includes(requested) ? requested : "Alle";
  });
  const [scrolled, setScrolled] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [toast, setToast] = useState("");
  const [undoAction, setUndoAction] = useState(null);
  const [info, setInfo] = useState("");
  const toastTimer = useRef(null);
  const count = cart.reduce((n, i) => n + i.qty, 0);
  useEffect(() => {
    try {
      localStorage.setItem(
        "ts-concept-v2-favorites",
        JSON.stringify(favorites),
      );
      localStorage.setItem("ts-concept-v2-cart", JSON.stringify(cart));
    } catch {
      setStorageAvailable(false);
    }
  }, [favorites, cart]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    const url = new URL(location.href);
    if (filter === "Alle") url.searchParams.delete("kategorie");
    else url.searchParams.set("kategorie", filter);
    if (gender === "Alle") url.searchParams.delete("auswahl");
    else url.searchParams.set("auswahl", gender);
    if (newOnly) url.searchParams.set("neu", "1");
    else url.searchParams.delete("neu");
    history.replaceState(null, "", url);
  }, [filter, gender, newOnly]);
  function notify(message, undo = null) {
    setToast(message);
    setUndoAction(() => undo);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => {
        setToast("");
        setUndoAction(null);
      },
      undo ? 8000 : 3200,
    );
  }
  function clearSelection() {
    const previousCart = cart;
    const previousFavorites = favorites;
    setCart([]);
    setFavorites([]);
    notify("Gespeicherte Auswahl gelöscht", () => {
      setCart(previousCart);
      setFavorites(previousFavorites);
    });
  }
  function undo() {
    undoAction?.();
    notify("Auswahl wiederhergestellt");
  }
  function favorite(id) {
    const removing = favorites.includes(id);
    setFavorites((v) =>
      v.includes(id) ? v.filter((x) => x !== id) : [...v, id],
    );
    notify(
      removing ? "Aus der Merkliste entfernt" : "In der Merkliste gespeichert",
    );
  }
  function browse(category = "Alle", audience = "Alle", mode = "all") {
    setNewOnly(mode === "new");
    setFilter(category);
    setGender(audience);
    setPanel(null);
    setTimeout(
      () =>
        document.getElementById("highlights")?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        }),
      30,
    );
  }
  function view(product) {
    setSelected(product);
    setSize("");
    if (panel === "product") return;
    setPanel("product");
  }
  function add() {
    if (!size) return;
    if (
      cart.some(
        (item) =>
          item.id === selected.id && item.size === size && item.qty >= 99,
      )
    ) {
      notify("Maximal 99 Stück je Größe im Demo-Warenkorb");
      return;
    }
    setCart((v) => {
      const existing = v.find((i) => i.id === selected.id && i.size === size);
      return existing
        ? v.map((i) =>
            i === existing ? { ...i, qty: Math.min(99, i.qty + 1) } : i,
          )
        : [...v, { id: selected.id, size, qty: 1 }];
    });
    notify("Zum Demo-Warenkorb hinzugefügt");
  }
  function quantity(id, size, delta) {
    if (
      delta < 0 &&
      cart.some(
        (item) => item.id === id && item.size === size && item.qty === 1,
      )
    ) {
      removeCartItem(id, size);
      return;
    }
    setCart((v) =>
      v
        .map((i) =>
          i.id === id && i.size === size
            ? { ...i, qty: Math.min(99, i.qty + delta) }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  }
  function removeCartItem(id, size) {
    const removed = cart.find((item) => item.id === id && item.size === size);
    if (!removed) return;
    setCart((items) =>
      items.filter((item) => !(item.id === id && item.size === size)),
    );
    notify("Aus dem Demo-Warenkorb entfernt", () =>
      setCart((items) => {
        const existing = items.find(
          (item) => item.id === id && item.size === size,
        );
        return existing
          ? items.map((item) =>
              item === existing
                ? { ...item, qty: Math.min(99, item.qty + removed.qty) }
                : item,
            )
          : [...items, removed];
      }),
    );
  }
  function showInfo(title) {
    setInfo(title);
    setPanel("info");
  }
  const visible = products.filter(
    (p) =>
      (!newOnly || p.isNew) &&
      (filter === "Alle" || p.category === filter) &&
      (gender === "Alle" || p.audience === gender || p.audience === "Alle"),
  );
  return (
    <>
      <Storefront
        favorites={favorites}
        cartCount={count}
        onBrowse={browse}
        onPanel={setPanel}
        onView={view}
        onFavorite={favorite}
        filter={filter}
        onFilter={(value) => {
          setFilter(value);
          setNewOnly(false);
        }}
        gender={gender}
        onGender={setGender}
        onInfo={showInfo}
        scrolled={scrolled}
        newOnly={newOnly}
        visible={visible}
      />
      <Dialog
        open={Boolean(panel)}
        onClose={() => setPanel(null)}
        className={panel === "product" ? "product-dialog" : ""}
      >
        <div className="panel-inner">
          <div className="panel-heading">
            <span className="panel-brand">THOR STEINAR / KONZEPT</span>
            <button
              className="icon-button"
              aria-label="Dialog schließen"
              onClick={() => setPanel(null)}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          {panel === "menu" && (
            <>
              <h2 id="dialog-title">ENTDECKEN.</h2>
              <nav className="mobile-nav" aria-label="Mobile Navigation">
                {[
                  ["Herren", "Alle", "Herren"],
                  ["Damen", "Alle", "Damen"],
                  ["Neuheiten", "Alle", "Alle"],
                  ["Jacken", "Jacken", "Alle"],
                  ["Hoodies", "Hoodies", "Alle"],
                  ["Accessoires", "Accessoires", "Alle"],
                ].map(([n, c, g]) => (
                  <button
                    key={n}
                    onClick={() =>
                      browse(c, g, n === "Neuheiten" ? "new" : "all")
                    }
                  >
                    {n}
                    <ArrowUpRight aria-hidden="true" />
                  </button>
                ))}
              </nav>
              <p className="panel-note">
                Unabhängiges Designkonzept. Kein offizieller Shop.
              </p>
            </>
          )}
          {panel === "search" && <SearchPanel onView={view} />}
          {panel === "favorites" && (
            <>
              <h2 id="dialog-title">
                DEINE MERKLISTE<span className="red-period">.</span>
              </h2>
              <p className="panel-note">
                {storageAvailable
                  ? "Deine Auswahl bleibt auf diesem Gerät gespeichert."
                  : "Der Browser erlaubt kein Speichern. Deine Auswahl bleibt für diesen Besuch erhalten."}
              </p>
              {favorites.length === 0 ? (
                <div className="empty-state">
                  <Heart aria-hidden="true" size={35} />
                  <p>Hier ist Platz für deine Favoriten.</p>
                  <button
                    className="button button-white"
                    onClick={() => browse()}
                  >
                    MODELLE ENTDECKEN{" "}
                    <ArrowRight aria-hidden="true" size={18} />
                  </button>
                </div>
              ) : (
                <div className="mini-list">
                  {products
                    .filter((p) => favorites.includes(p.id))
                    .map((p) => (
                      <div className="saved-row" key={p.id}>
                        <button
                          className="mini-product"
                          onClick={() => view(p)}
                        >
                          <img
                            src={`./images/${p.image}.webp`}
                            alt=""
                            width="80"
                            height="95"
                          />
                          <span>
                            <strong>{p.name}</strong>
                            <small>{p.category}</small>
                          </span>
                        </button>
                        <button
                          className="icon-button"
                          aria-label={`${p.name} entfernen`}
                          onClick={() => favorite(p.id)}
                        >
                          <X aria-hidden="true" size={18} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
          {panel === "cart" && (
            <>
              <h2 id="dialog-title">
                DEIN WARENKORB<span className="red-period">.</span>
              </h2>
              <p className="panel-note">
                Interaktive Demonstration. Keine Bestellung, keine Zahlung und
                keine Verfügbarkeitszusage.
              </p>
              {!cart.length ? (
                <div className="empty-state">
                  <ShoppingBag aria-hidden="true" size={35} />
                  <p>Dein Demo-Warenkorb ist noch leer.</p>
                  <button
                    className="button button-white"
                    onClick={() => browse()}
                  >
                    LOOKS ENTDECKEN <ArrowRight aria-hidden="true" size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mini-list">
                    {cart.map((i) => {
                      const p = products.find((p) => p.id === i.id);
                      return (
                        <div className="cart-row" key={`${i.id}-${i.size}`}>
                          <img
                            src={`./images/${p.image}.webp`}
                            alt={p.name}
                            width="85"
                            height="110"
                          />
                          <div>
                            <strong>{p.name}</strong>
                            <small>
                              {p.color} / {i.size}
                            </small>
                            <div className="quantity">
                              <button
                                aria-label={`Ein ${p.name} weniger, Größe ${i.size}`}
                                onClick={() => quantity(i.id, i.size, -1)}
                              >
                                <Minus aria-hidden="true" size={14} />
                              </button>
                              <span>{i.qty}</span>
                              <button
                                aria-label={`Ein ${p.name} mehr, Größe ${i.size}`}
                                onClick={() => quantity(i.id, i.size, 1)}
                                disabled={i.qty >= 99}
                              >
                                <Plus aria-hidden="true" size={14} />
                              </button>
                            </div>
                          </div>
                          <button
                            className="icon-button"
                            aria-label={`${p.name} Größe ${i.size} aus Warenkorb entfernen`}
                            onClick={() => removeCartItem(i.id, i.size)}
                          >
                            <X aria-hidden="true" size={17} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="cart-total">
                    <span>ARTIKEL GESAMT</span>
                    <strong>{count}</strong>
                  </div>
                  <p className="panel-note">
                    Im Konzept werden keine Preise berechnet. Echte Produkte und
                    aktuelle Konditionen findest du im offiziellen Shop.
                  </p>
                  <a
                    className="button button-white"
                    href={official}
                    target="_blank"
                    rel="noreferrer"
                  >
                    OFFIZIELLEN SHOP BESUCHEN{" "}
                    <ArrowUpRight aria-hidden="true" size={17} />
                  </a>
                </>
              )}
            </>
          )}
          {panel === "product" && (
            <>
              <h2 id="dialog-title" className="sr-only">
                {selected.fullName}
              </h2>
              <div className="product-detail">
                <img
                  width="960"
                  height="960"
                  className="detail-photo"
                  src={`./images/${selected.image}.webp`}
                  alt={`Originalfoto: ${selected.fullName} in ${selected.color}`}
                />
                <div className="detail-copy">
                  <h3>{selected.name}</h3>
                  <p className="detail-category">
                    {selected.fullName} / {selected.color}
                  </p>
                  <p>{selected.note}</p>
                  <dl className="product-specs">
                    <div>
                      <dt>Material</dt>
                      <dd>{selected.material}</dd>
                    </div>
                    <div>
                      <dt>Details</dt>
                      <dd>{selected.detail}</dd>
                    </div>
                  </dl>
                  <a
                    className="text-link"
                    href={selected.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Zum Originalprodukt{" "}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                  <div className="demo-notice">
                    Originalprodukt und Originalfoto. Die folgende Größenwahl
                    ist eine Demo und zeigt keinen Lagerbestand. Aktuelle
                    Größen, Preise und Verfügbarkeit findest du im Originalshop.
                  </div>
                  <fieldset>
                    <legend>DEMO-GRÖSSE WÄHLEN</legend>
                    <div className="sizes">
                      {selected.sizes.map((s) => (
                        <button
                          key={s}
                          aria-pressed={size === s}
                          onClick={() => setSize(s)}
                          className={size === s ? "chosen" : ""}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <button
                    className="button button-white add-button"
                    disabled={!size}
                    onClick={add}
                  >
                    {size ? "ZUM DEMO-WARENKORB" : "BITTE GRÖSSE WÄHLEN"}{" "}
                    <Plus size={18} aria-hidden="true" />
                  </button>
                  <button
                    className="detail-wish text-link"
                    aria-pressed={favorites.includes(selected.id)}
                    onClick={() => favorite(selected.id)}
                  >
                    <Heart
                      size={17}
                      aria-hidden="true"
                      fill={
                        favorites.includes(selected.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                    {favorites.includes(selected.id)
                      ? "GEMERKT"
                      : "AUF DIE MERKLISTE"}
                  </button>
                  <button
                    className="text-link"
                    onClick={() => setPanel("cart")}
                  >
                    Demo-Warenkorb ansehen{" "}
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </>
          )}
          {panel === "info" && (
            <>
              <h2 id="dialog-title">{info}</h2>
              <div className="info-content">
                {info === "Datenschutz" ? (
                  <>
                    <p>
                      Dieses Konzept verwendet keine Analyse- oder
                      Marketingdienste. Es gibt keine Registrierung und kein
                      Formular zur Erfassung persönlicher Daten.
                    </p>
                    <p>
                      Merkliste und Demo-Warenkorb werden ausschließlich im
                      lokalen Speicher deines Browsers gespeichert. Beim Aufruf
                      eines Hosting-Anbieters können technisch notwendige
                      Serverprotokolle entstehen.
                    </p>
                    <button
                      className="button button-outline"
                      onClick={clearSelection}
                    >
                      LOKALE AUSWAHL LÖSCHEN
                    </button>
                  </>
                ) : info === "Bild- und Markenrechte" ? (
                  <>
                    <p>
                      Die Produktfotos und das Logo stammen aus dem offiziellen
                      Thor Steinar Shop. Die beiden Kampagnenbilder zeigen
                      KI-generierte Models in Kleidung, die anhand dieser
                      Originalprodukte visualisiert wurde. Sie sind keine
                      offiziellen Kampagnen und können im Detail vom Original
                      abweichen.
                    </p>
                    <p>
                      THOR STEINAR und zugehörige Markenrechte gehören ihren
                      jeweiligen Rechteinhabern. Für eine offizielle oder
                      kommerzielle Nutzung sind Rechte und Freigaben zu klären.
                    </p>
                  </>
                ) : info === "Social Media" ? (
                  <p>
                    In diesem unabhängigen Konzept werden keine unbestätigten
                    Social-Media-Profile verlinkt. Die offiziellen Kanäle
                    findest du auf der Website des Unternehmens.
                  </p>
                ) : (
                  <>
                    <p>
                      Dieses Projekt ist eine unabhängige gestalterische
                      Initiative. Es ist weder beauftragt noch mit Thor Steinar
                      oder MediaTex GmbH verbunden.
                    </p>
                    <p>
                      Suche, Filter, Merkliste, Größenauswahl und Warenkorb
                      lassen sich ausprobieren. Es finden keine Bestellungen und
                      keine Zahlungen statt. Die Produktfotos zeigen echte Thor
                      Steinar Kleidung. Die Kampagnenbilder sind
                      KI-Visualisierungen anhand dieser Produkte.
                    </p>
                  </>
                )}
                <a
                  className="text-link"
                  href={official}
                  target="_blank"
                  rel="noreferrer"
                >
                  ZUR OFFIZIELLEN WEBSITE{" "}
                  <ArrowUpRight aria-hidden="true" size={17} />
                </a>
              </div>
            </>
          )}
          <Toast message={toast} onUndo={undoAction ? undo : undefined} />
        </div>
      </Dialog>
      {!panel && (
        <Toast message={toast} onUndo={undoAction ? undo : undefined} />
      )}
    </>
  );
}
