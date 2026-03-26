import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { productService } from "../services/shopService";
import "../styles/shop/Shop.css";

const CATEGORIES = [
  { id: "all", name: "All Products" },
  { id: "frames", name: "Frames" },
  { id: "wheels", name: "Wheels" },
  { id: "groupsets", name: "Groupsets" },
  { id: "components", name: "Components" },
  { id: "accessories", name: "Accessories" },
  { id: "clothing", name: "Clothing" },
  { id: "parts", name: "Parts" },
];

const SORT_OPTIONS = [
  { id: "latest", name: "Latest" },
  { id: "popular", name: "Popular" },
  { id: "rating", name: "Top Rated" },
  { id: "price_asc", name: "Price: Low to High" },
  { id: "price_desc", name: "Price: High to Low" },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "latest";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    fetchProducts();
  }, [category, sort, search, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { sort, page, limit: 20 };
      if (category !== "all") params.category = category;
      if (search) params.search = search;

      const data = await productService.getProducts(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams();
    if (catId !== "all") params.set("category", catId);
    if (sort !== "latest") params.set("sort", sort);
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSort);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Header />
      <div className="shop-page">
        <aside className="shop-sidebar">
          <div className="category-card">
            <h3 className="category-title">Categories</h3>
            <ul className="category-list">
              {CATEGORIES.map((cat) => (
                <li key={cat.id} className="category-item">
                  <div
                    className={`category-link ${category === cat.id ? "active" : ""}`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.name}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="shop-main">
          <div className="shop-toolbar">
            <span className="result-count">
              {pagination.total} products found
            </span>
            <div className="sort-options">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`sort-btn ${sort === opt.id ? "active" : ""}`}
                  onClick={() => handleSortChange(opt.id)}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner"></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try changing your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
                    className="product-card"
                  >
                    <div className="product-image">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/400"}
                        alt={product.name}
                      />
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="product-discount">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div>
                        <span className="product-price">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="product-original-price">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="product-meta">
                        <span className="product-sold">{product.sold || 0} sold</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === pagination.pages ||
                        Math.abs(p - page) <= 2
                    )
                    .map((p, idx, arr) => (
                      <>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span key={`ellipsis-${p}`} style={{ padding: "8px" }}>
                            ...
                          </span>
                        )}
                        <button
                          key={p}
                          className={`page-btn ${page === p ? "active" : ""}`}
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </button>
                      </>
                    ))}
                  <button
                    className="page-btn"
                    disabled={page === pagination.pages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
