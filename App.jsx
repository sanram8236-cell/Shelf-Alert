import "./App.css";

function App() {
  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">Shelf-Alert</h1>
        <ul className="nav-links">
          <li>Home</li>
          <li>My Foods</li>
          <li>About</li>
          <button className="login-btn">Log In</button>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h2>Don’t Let Your Food Expire!</h2>
          <p>
            Our goal in our local community is to limit food waste by helping
            people track food expiration dates.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn">Get Started</button>
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>
      </section>

      {/* ADD FOOD SECTION */}
      <section className="tracker">
        <h3>Track Your Groceries</h3>
        <div className="tracker-form">
          <input type="text" placeholder="Food Item" />
          <input type="date" />
          <button className="primary-btn">Add Item</button>
        </div>
      </section>

      {/* ALERTS PREVIEW */}
      <section className="alerts">
        <h3>Upcoming Alerts</h3>
        <div className="alert-cards">
          <div className="card red">Bread — Expires in 1 day</div>
          <div className="card yellow">Cheese — Expires in 3 days</div>
          <div className="card green">Berries — Expires in 4 days</div>
        </div>
      </section>

      {/* TEAM + MESA */}
      <section className="team">
        <h3>Our Team & MESA Program</h3>
        <div className="team-cards">
          <div className="member">Team Member 1</div>
          <div className="member">Team Member 2</div>
          <div className="member">Team Member 3</div>
          <div className="member">Team Member 4</div>
        </div>
        <p className="advisor">Advisor: Mr. Thompson</p>
      </section>
    </div>
  );
}

export default App;
