import React, { useEffect, useState, useRef } from "react";

export default function App() {
  // mock "movies" data
  const movies = useRef(
    Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      title: `Movie ${i + 1}`,
      year: 2000 + ((i + 1) % 25),
      runtime: 90 + (i % 60),
      rating: (
        6 +
        (i % 4) +
        Math.round(((Math.random() * 10) / 10) * 10) / 10
      ).toFixed(1),
      overview:
        "This is a short mock overview of the movie. In a real app you'd fetch data from an API like TMDB.",
      // placeholder image generated with base64 SVG so no external assets needed
      image: `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='225'>
          <rect width='100%' height='100%' fill='hsl(${
            (i * 30) % 360
          } 60% 40%)'/>
          <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Arial' font-size='20' fill='white'>
            Movie ${i + 1}
          </text>
        </svg>`
      )}`,
    }))
  ).current;

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(movies);
  const [selected, setSelected] = useState(null);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) setFiltered(movies);
    else
      setFiltered(
        movies.filter(
          (m) => m.title.toLowerCase().includes(q) || String(m.year).includes(q)
        )
      );
  }, [query, movies]);

  const renderRow = (title, items) => {
    return (
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ margin: "8px 0" }}>{title}</h3>
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 6,
          }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              onClick={() => setSelected(it)}
              style={{
                minWidth: 220,
                cursor: "pointer",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                background: "#111",
              }}
            >
              <img
                src={it.image}
                alt={it.title}
                style={{ width: "100%", display: "block" }}
              />
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{it.title}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {it.year} • {it.runtime}m
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const buckets = {
    Trending: filtered.slice(0, 8),
    "Top Picks": filtered.slice(8, 16),
    "New Releases": filtered.slice(16, 24),
    "Because you watched": filtered.slice(24, 30),
  };

  return (
    <div
      style={{
        fontFamily:
          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        minHeight: "100vh",
        background: dark ? "#050505" : "#f5f5f5",
        color: dark ? "#eee" : "#111",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          backdropFilter: "blur(6px)",
          borderBottom: dark
            ? "1px solid rgba(255,255,255,0.03)"
            : "1px solid rgba(0,0,0,0.06)",
          background: dark
            ? "linear-gradient(180deg, rgba(0,0,0,0.6), transparent)"
            : "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 22px",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 1.2 }}>
            NETFLIX
          </div>
          <input
            aria-label="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies or year"
            style={{
              flex: 1,
              maxWidth: 520,
              padding: "8px 10px",
              borderRadius: 6,
              border: "none",
              outline: "none",
            }}
          />
          <button
            onClick={() => setDark(!dark)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: "28px 22px 10px", display: "grid", gap: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: 36, margin: "0 0 6px" }}>
              Watch something you'll love
            </h1>
            <p style={{ margin: 0, opacity: 0.85, maxWidth: 680 }}>
              This is a lightweight single-file Netflix-like UI built with
              React. Click posters to open a detail modal.
            </p>
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => setSelected(filtered[0])}
                style={{
                  padding: "10px 14px",
                  borderRadius: 6,
                  marginRight: 8,
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Play
              </button>
              <button
                onClick={() => alert("Added to My List (mock)")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 6,
                  cursor: "pointer",
                  border: "none",
                }}
              >
                + My List
              </button>
            </div>
          </div>
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
            }}
          >
            <img
              src={filtered[0].image}
              alt="hero"
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* Rows */}
        <div>
          {Object.entries(buckets).map(([k, v]) => (
            <div key={k}>{renderRow(k, v)}</div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 22,
          opacity: 0.6,
          fontSize: 13,
          borderTop: dark
            ? "1px solid rgba(255,255,255,0.02)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        This is a mock clone — no external APIs, no routing, everything in one
        React file.
      </div>

      {/* Modal */}
      {selected && (
        <div
          role="dialog"
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            zIndex: 80,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(920px, 96%)",
              background: dark ? "#0b0b0b" : "white",
              color: dark ? "#eee" : "#111",
              borderRadius: 12,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "360px 1fr",
            }}
          >
            <img
              src={selected.image}
              alt="sel"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ padding: 18 }}>
              <h2 style={{ marginTop: 0 }}>{selected.title}</h2>
              <div style={{ marginBottom: 10, opacity: 0.9 }}>
                {selected.year} • {selected.runtime}m • ⭐ {selected.rating}
              </div>
              <p style={{ lineHeight: 1.5 }}>{selected.overview}</p>
              <div style={{ marginTop: 12 }}>
                <button
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    marginRight: 8,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Play
                </button>
                <button
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => alert("Added to list (mock)")}
                >
                  + My List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}