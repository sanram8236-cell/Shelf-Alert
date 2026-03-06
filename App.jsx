import React, { useMemo, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

/* ---------- Helpers ---------- */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const exp = new Date(dateStr + "T00:00:00");
  exp.setHours(0, 0, 0, 0);

  const diffMs = exp.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/* ---------- Pages ---------- */
function HomePage({ foods, onAddFood }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const upcoming = useMemo(() => {
    return foods
      .map((f) => ({ ...f, d: daysUntil(f.exp) }))
      .filter((f) => f.d >= 0)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
  }, [foods]);

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim() || !date) return;
    onAddFood({ name: name.trim(), exp: date });
    setName("");
    setDate("");
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h2>Don’t Let Your Food Expire!</h2>
          <p>Our goal in our local community is to limit food waste.</p>
          <div className="hero-buttons">
            <Link className="primary-btn link-btn" to="/notifications">
              View Notifications
            </Link>
            <Link className="secondary-btn link-btn" to="/about">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* TRACKER */}
      <section className="tracker">
        <h3>Track Your Groceries</h3>

        <form className="tracker-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Food Item (ex: Yogurt)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="primary-btn" type="submit">
            Add Item
          </button>
        </form>

        <div className="list">
          {foods.length === 0 ? (
            <p className="muted">No foods yet. Add a few items above.</p>
          ) : (
            foods
              .slice()
              .sort((a, b) => a.exp.localeCompare(b.exp))
              .map((f) => (
                <div className="list-row" key={f.id}>
                  <span className="food-name">{f.name}</span>
                  <span className="food-date">{formatDate(f.exp)}</span>
                </div>
              ))
          )}
        </div>
      </section>

      {/* UPCOMING PREVIEW */}
      <section className="alerts">
        <h3>Upcoming Alerts</h3>
        <div className="alert-cards">
          {upcoming.length === 0 ? (
            <div className="card gray">No upcoming alerts yet.</div>
          ) : (
            upcoming.map((f) => (
              <div
                key={f.id}
                className={`card ${f.d <= 1 ? "red" : f.d <= 3 ? "yellow" : "green"}`}
              >
                {f.name} — Expires in {f.d} day{f.d === 1 ? "" : "s"}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

function NotificationsPage({ foods, onRemoveFood, soonDays = 3 }) {
  const { expired, soon, later } = useMemo(() => {
    const withDays = foods
      .map((f) => ({ ...f, d: daysUntil(f.exp) }))
      .sort((a, b) => a.d - b.d);

    return {
      expired: withDays.filter((f) => f.d < 0),
      soon: withDays.filter((f) => f.d >= 0 && f.d <= soonDays),
      later: withDays.filter((f) => f.d > soonDays),
    };
  }, [foods, soonDays]);

  return (
    <section className="notifications">
      <h2>Notifications</h2>
      <p className="muted">
        Foods that are expired or expiring soon will appear here. Remove items when you’re done.
      </p>

      {/* EXPIRED */}
      <div className="notif-block">
        <h3>Expired Foods</h3>
        {expired.length === 0 ? (
          <p className="muted">No expired foods 🎉</p>
        ) : (
          <div className="notif-list">
            {expired.map((f) => (
              <div className="notif-row" key={f.id}>
                <div>
                  <div className="notif-title">{f.name}</div>
                  <div className="notif-sub">
                    Expired {Math.abs(f.d)} day{Math.abs(f.d) === 1 ? "" : "s"} ago •{" "}
                    {formatDate(f.exp)}
                  </div>
                </div>
                <button className="danger-btn" onClick={() => onRemoveFood(f.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ALMOST EXPIRED */}
      <div className="notif-block">
        <h3>Almost Expired (Next {soonDays} Days)</h3>
        {soon.length === 0 ? (
          <p className="muted">Nothing expiring soon.</p>
        ) : (
          <div className="notif-list">
            {soon.map((f) => (
              <div className="notif-row" key={f.id}>
                <div>
                  <div className="notif-title">{f.name}</div>
                  <div className="notif-sub">
                    Expires in {f.d} day{f.d === 1 ? "" : "s"} • {formatDate(f.exp)}
                  </div>
                </div>
                <button className="danger-btn" onClick={() => onRemoveFood(f.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OPTIONAL: OTHER FOODS */}
      <div className="notif-block">
        <h3>All Other Foods</h3>
        {later.length === 0 ? (
          <p className="muted">No other foods.</p>
        ) : (
          <div className="notif-list">
            {later.map((f) => (
              <div className="notif-row" key={f.id}>
                <div>
                  <div className="notif-title">{f.name}</div>
                  <div className="notif-sub">
                    Expires in {f.d} days • {formatDate(f.exp)}
                  </div>
                </div>
                <button className="outline-btn" onClick={() => onRemoveFood(f.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="about-page">
      <div className="about-container">

        <h2>About Shelf-Alert</h2>
        <p className="about-intro">
          Shelf-Alert helps families track expiration dates so they use food before it goes bad.
          Our goal in our local community is to limit food waste and save households money.
        </p>

        {/* Expiration Dates */}
        <div className="about-section">
          <h3>Understanding Expiration Dates</h3>
          <ul>
            <li><strong>Best By:</strong> Refers to food quality (taste or texture). Food is often still safe after this date.</li>
            <li><strong>Use By:</strong> The last recommended date for peak quality and safety.</li>
            <li><strong>Sell By:</strong> Used by stores for inventory purposes, not a safety deadline.</li>
          </ul>
          <p>
            Many people throw away food too early because they misunderstand these labels.
            Shelf-Alert reminds users before items expire so they can plan meals and reduce waste.
          </p>
        </div>

        {/* Financial Gain */}
        <div className="about-section">
          <h3>Financial Gain</h3>
          <ul>
            <li>California households waste <strong>$1,022</strong> worth of food annually, about 25% of food purchased.</li>
            <li>In 2024, the average American spent <strong>$762</strong> on food that went uneaten.</li>
            <li>Consumer food waste makes up over <strong>45%</strong> of surplus food in the U.S., costing about <strong>$259 billion</strong>.</li>
          </ul>
          <p>
            By tracking expiration dates and using food before it spoils,
            families can significantly reduce grocery expenses.
          </p>
        </div>

        {/* LA County */}
        <div className="about-section">
          <h3>Food Waste in Los Angeles County</h3>
          <p>
            In Los Angeles County, nearly a quarter of households experience food insecurity,
            yet large amounts of edible food are still thrown away each year.
          </p>
          <p>
            Los Angeles County geneerates over 5,000 tons of food waste daily, making
            it the largest component of landfill waste in the region.
          </p>
          <p>
            Shelf-Alert supports LA County’s efforts to reduce landfill waste
            by helping households build better food management habits.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- App Shell ---------- */
export default function App() {
  const [foods, setFoods] = useState([
    // sample data (you can delete these)
    { id: crypto.randomUUID(), name: "Milk", exp: "2026-02-22" },
    { id: crypto.randomUUID(), name: "Lettuce", exp: "2026-02-25" },
    { id: crypto.randomUUID(), name: "Eggs", exp: "2026-02-28" },
  ]);

  function addFood(item) {
    setFoods((prev) => [{ id: crypto.randomUUID(), ...item }, ...prev]);
  }

  function removeFood(id) {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  }

  const notifCount = useMemo(() => {
    const soonDays = 3;
    return foods.reduce((count, f) => {
      const d = daysUntil(f.exp);
      if (d < 0 || (d >= 0 && d <= soonDays)) return count + 1;
      return count;
    }, 0);
  }, [foods]);

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="logo-link">
          <h1 className="logo">Shelf-Alert</h1>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/notifications">
              Notifications {notifCount > 0 && <span className="badge">{notifCount}</span>}
            </Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<HomePage foods={foods} onAddFood={addFood} />} />
        <Route
          path="/notifications"
          element={<NotificationsPage foods={foods} onRemoveFood={removeFood} soonDays={3} />}
        />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}