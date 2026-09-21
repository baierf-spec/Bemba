"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, PackageSearch, MapPin } from "lucide-react";
import { categories, demoProducts } from "@/lib/demo/catalog";
import { categoryIcons, ProductCard, Photo } from "./shared";
export function Marketplace({
  initialQuery = "",
  initialCategory = "All products",
}: {
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [cities, setCities] = useState<string[]>([]);
  const [max, setMax] = useState(1500);
  const [sort, setSort] = useState("featured");
  const [filters, setFilters] = useState(false);
  const products = useMemo(() => {
    const items = demoProducts.filter(
      (p) =>
        (category === "All products" || p.category === category) &&
        (!cities.length || cities.includes(p.city)) &&
        p.price <= max &&
        `${p.name} ${p.seller} ${p.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
    return sort === "low"
      ? items.sort((a, b) => a.price - b.price)
      : sort === "high"
        ? items.sort((a, b) => b.price - a.price)
        : items;
  }, [query, category, cities, max, sort]);
  return (
    <div className="page-container">
      <section className="market-hero">
        <div>
          <p className="eyebrow">AFRICAN BUSINESSES. BRIGHTER TOMORROWS.</p>
          <h1>
            Find amazing products
            <br />
            from local sellers.
          </h1>
          <p>
            Shop fashion, beauty, electronics, home, food and more — all from
            independent businesses.
          </p>
        </div>
        <form className="search-box" onSubmit={(e) => e.preventDefault()}>
          <Search size={17} />
          <input
            aria-label="Search demo products"
            placeholder="Search for products, brands or sellers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-small">Search</button>
        </form>
      </section>
      <nav className="category-strip" aria-label="Product categories">
        {categories.map((c, i) => {
          const Icon = categoryIcons[i];
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={category === c ? "selected" : ""}
              aria-pressed={category === c}
            >
              <Icon />
              {c}
            </button>
          );
        })}
      </nav>
      <button
        className="mobile-filter-toggle"
        onClick={() => setFilters(!filters)}
        aria-expanded={filters}
      >
        <SlidersHorizontal size={14} /> Filters {filters ? "−" : "+"}
      </button>
      <div className="market-layout">
        <aside className={`filters ${filters ? "show-filters" : ""}`}>
          <h3>Filters</h3>
          <fieldset className="filter-group">
            <legend>Category</legend>
            {categories.map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={category === c}
                  onChange={() =>
                    setCategory(category === c ? "All products" : c)
                  }
                />
                {c}
              </label>
            ))}
          </fieldset>
          <fieldset className="filter-group">
            <legend>Price range</legend>
            <div className="range-labels">
              <span>K0</span>
              <span>K{max.toLocaleString()}</span>
            </div>
            <input
              type="range"
              aria-label="Maximum price"
              min={0}
              max={1500}
              step={50}
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
            />
          </fieldset>
          <fieldset className="filter-group">
            <legend>City</legend>
            {["Lusaka", "Kitwe", "Ndola", "Livingstone", "Kabwe"].map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={cities.includes(c)}
                  onChange={() =>
                    setCities(
                      cities.includes(c)
                        ? cities.filter((x) => x !== c)
                        : [...cities, c],
                    )
                  }
                />
                {c}
              </label>
            ))}
          </fieldset>
          <button
            className="text-link"
            onClick={() => {
              setCategory("All products");
              setCities([]);
              setMax(1500);
              setQuery("");
            }}
          >
            Clear all filters
          </button>
        </aside>
        <section>
          <div className="market-toolbar">
            <div>
              <h2>Discover products</h2>
              <p>{products.length} sample products · Zambia</p>
            </div>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="low">Price: Low to high</option>
              <option value="high">Price: High to low</option>
            </select>
          </div>
          <div className="market-promo">
            <div>
              <h2>Support local makers.</h2>
              <p>
                Thoughtful products. Independent businesses. A little closer to
                home.
              </p>
              <button
                className="btn btn-small"
                onClick={() => {
                  setCategory("Fashion");
                  setQuery("");
                }}
              >
                Explore fashion →
              </button>
            </div>
            <Photo
              src="/images/handbag.webp"
              alt="Colourful chitenge handbag"
            />
          </div>
          {products.length ? (
            <div className="products-grid market-products">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <PackageSearch />
              <h2>No products found.</h2>
              <p>Try a different search, category or price range.</p>
            </div>
          )}
          <div className="pagination">
            <span>1</span>Showing {products.length} sample products{" "}
            <MapPin size={12} /> Zambia
          </div>
        </section>
      </div>
    </div>
  );
}
