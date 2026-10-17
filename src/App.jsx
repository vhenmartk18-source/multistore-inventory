
import { useState } from "react";
import "./App.css";

const categories = [
  {
    title: "Fasteners",
    desc: "Nails, screws, bolts and more",
    icon: "⚙️",
    search: "nails",
  },
  {
    title: "Paint & Finishing",
    desc: "Paint, brushes and coatings",
    icon: "🎨",
    search: "paint",
  },
  {
    title: "Construction",
    desc: "Cement and building materials",
    icon: "🧱",
    search: "cement",
  },
  {
    title: "Plumbing",
    desc: "Pipes, fittings and supplies",
    icon: "🔧",
    search: "PVC pipe",
  },
];

function App() {
  const [product, setProduct] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function searchProducts(searchTerm) {
    const term = searchTerm.trim();

    if (!term) {
      setMessage("Please enter a product name before searching.");
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setMessage("");
    setResults([]);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      params.set("q", term);
      params.set("location", location);

      const response = await fetch(
        `http://localhost:5000/api/products?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("The server returned an error.");
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.products)) {
        throw new Error("Unexpected response from the server.");
      }

      setResults(data.products);

      if (data.products.length === 0) {
        setMessage(
          `No products found for "${term}". Try another product or location.`
        );
      }
    } catch (error) {
      console.error("Product search error:", error);

      setMessage(
        "Cannot connect to the product server. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    searchProducts(product);
  }

  function chooseCategory(searchTerm) {
    setProduct(searchTerm);
    setMessage("");

    document.getElementById("home")?.scrollIntoView({
      behavior: "smooth",
    });

    searchProducts(searchTerm);
  }

  return (
    <div className="app">
      <header className="navbar container">
        <a className="brand" href="#home">
          <span className="brand-icon">⌕</span>
          <span>
            Build<span className="green-text">Find</span>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#categories">Categories</a>
          <a href="#how-it-works">How it works</a>
          <a href="#for-stores">For stores</a>
        </nav>

        <div className="nav-actions">
          <a className="btn btn-outline" href="#for-stores">
            Store sign in
          </a>
          <a className="btn btn-green" href="#for-stores">
            List your store ↗
          </a>
        </div>
      </header>

      <main>
        <section className="hero container" id="home">
          <div className="hero-content">
            <p className="eyebrow">● YOUR LOCAL PRODUCT FINDER</p>

            <h1>
              Find the right supplies.
              <span className="green-text">
                {" "}Compare with confidence.
              </span>
            </h1>

            <p className="hero-description">
              Search hardware and construction essentials, explore
              local stores, and compare prices and stock information
              in one place.
            </p>

            <form className="search-box" onSubmit={handleSearch}>
              <span className="search-icon">⌕</span>

              <input
                type="search"
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                placeholder="Try nails, cement, or PVC pipe"
                aria-label="Search products"
              />

              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                aria-label="Choose location"
              >
                <option value="">Any location</option>
<option value="Cebu City">Cebu City</option>
<option value="Danao">Danao / Danao City</option>
<option value="Mandaue City">Mandaue City</option>
<option value="Lapu-Lapu City">Lapu-Lapu City</option>
              </select>

              <button
                className="btn btn-green"
                type="submit"
                disabled={loading}
              >
                {loading ? "Searching..." : "Find products →"}
              </button>
            </form>

            <p className="search-hint">
              Browse without an account. Confirm product availability
              with the store before purchasing.
            </p>

            {message && (
              <div className="search-message" role="status">
                {message}
              </div>
            )}
          </div>

          <div className="hero-art">
            <div className="preview-card">
              <span className="preview-label">PRODUCT FINDER</span>

              <div className="preview-illustration">🔨</div>

              <h3>Hardware supplies</h3>

              <p>
                Discover products and compare available store listings.
              </p>

              <div className="preview-bottom">
                <span>⌂ Local stores</span>
                <span className="availability">Product search</span>
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <section className="container results-section">
            <p>Searching for products...</p>
          </section>
        )}

        {hasSearched && !loading && results.length > 0 && (
          <section
            className="container results-section"
            aria-live="polite"
          >
            <h2>Search Results</h2>

            <p className="results-count">
              Found {results.length} matching listing(s).
            </p>

            <div className="results-grid">
              {results.map((item) => (
                <article
                  className="result-card"
                  key={`${item.product_id}-${item.store_id}`}
                >
                  <span className="result-category">
                    {item.category || "Uncategorized"}
                  </span>

                  <h3>{item.product_name}</h3>

                 <p className="result-price">
  ₱
  {Number(item.price).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}
  {item.unit && (
    <span className="price-unit"> / {item.unit}</span>
  )}
</p>

                  <p>
                    <strong>Store:</strong>{" "}
                    {item.store_name || "Store name unavailable"}
                  </p>

                  <p>
                    <strong>Stock:</strong>{" "}
                    {item.stock_quantity}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {item.address || "Location not provided"}
                  </p>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  {item.contact_number && (
                    <p>
                      <strong>Contact:</strong>{" "}
                      {item.contact_number}
                    </p>
                  )}

                  {item.updated_at && (
                    <p>
                      <strong>Last updated:</strong>{" "}
                      {item.updated_at}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="container section" id="categories">
          <div className="section-heading">
            <p className="eyebrow">EXPLORE SUPPLIES</p>
            <h2>What are you looking for?</h2>
            <p>
              Choose a category to search for matching products.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <button
                type="button"
                className="category-card"
                key={category.title}
                onClick={() => chooseCategory(category.search)}
                disabled={loading}
              >
                <span className="category-icon">
                  {category.icon}
                </span>

                <h3>{category.title}</h3>

                <p>{category.desc}</p>

                <span className="category-link">
                  Search category →
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">SIMPLE BY DESIGN</p>
              <h2>Find supplies in three steps</h2>
            </div>

            <div className="steps-grid">
              <article className="step-card">
                <span className="step-number">01</span>
                <h3>Search a product</h3>
                <p>
                  Enter a product name and select a location if needed.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">02</span>
                <h3>Compare listings</h3>
                <p>
                  Review the price, stock, and location returned
                  by the product database.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">03</span>
                <h3>Choose a store</h3>
                <p>
                  Contact the store to confirm the current price
                  and product availability.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="container owner-section" id="for-stores">
          <div className="owner-panel">
            <div>
              <h2>Run a hardware or supply store?</h2>
              <p>
                Help customers discover your products. Store registration
                and sign-in features can be connected in a later phase.
              </p>
            </div>

            <a
              className="btn btn-light"
              href="mailto:stores@example.com"
            >
              Contact us ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="footer container">
        <a className="brand" href="#home">
          <span className="brand-icon">⌕</span>
          <span>
            Build<span className="green-text">Find</span>
          </span>
        </a>

        <p>Product discovery for local stores.</p>

        <p>Prices and stock should be confirmed with each store.</p>
      </footer>
    </div>
  );
}

export default App;
