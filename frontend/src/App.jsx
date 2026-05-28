import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000";

function App() {
  const [fruits, setFruits] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);
      setError("");

      const [fruitsResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/fruits`),
        fetch(`${API_URL}/stats`),
      ]);

      if (!fruitsResponse.ok) {
        throw new Error("No se pudieron obtener las frutas");
      }

      if (!statsResponse.ok) {
        throw new Error("No se pudieron obtener las estadísticas");
      }

      const fruitsData = await fruitsResponse.json();
      const statsData = await statsResponse.json();

      setFruits(fruitsData);
      setStats(statsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function searchFruit(event) {
    event.preventDefault();

    if (!search.trim()) {
      setSelectedFruit(null);
      return;
    }

    try {
      setSearchLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/fruits/${search.trim()}`);

      if (!response.ok) {
        throw new Error("Fruta no encontrada");
      }

      const fruit = await response.json();
      setSelectedFruit(fruit);
    } catch (error) {
      setSelectedFruit(null);
      setError(error.message);
    } finally {
      setSearchLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="app">
        <section className="hero">
          <p>Cargando FruitOps...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Mini proyecto DevOps</p>
        <h1>FruitOps</h1>
        <p className="subtitle">
          Una app para consultar frutas, estadísticas nutricionales y practicar
          backend, frontend, APIs, Git y DevOps.
        </p>
      </section>

      {error && (
        <section className="alert">
          <strong>Error:</strong> {error}
        </section>
      )}

      {stats && (
        <section className="stats-grid">
          <article className="stat-card">
            <span>Total frutas</span>
            <strong>{stats.totalFruits}</strong>
          </article>

          <article className="stat-card">
            <span>Promedio calorías</span>
            <strong>{stats.averageCalories}</strong>
          </article>

          <article className="stat-card">
            <span>Promedio azúcar</span>
            <strong>{stats.averageSugar}g</strong>
          </article>

          <article className="stat-card">
            <span>Más azúcar</span>
            <strong>{stats.fruitWithMostSugar?.name}</strong>
          </article>
        </section>
      )}

      <section className="search-section">
        <h2>Buscar fruta</h2>

        <form onSubmit={searchFruit} className="search-form">
          <input
            type="text"
            placeholder="Ejemplo: banana, apple, strawberry"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">
            {searchLoading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {selectedFruit && (
          <FruitCard fruit={selectedFruit} featured />
        )}
      </section>

      <section className="fruits-section">
        <div className="section-header">
          <h2>Frutas disponibles</h2>
          <button onClick={fetchInitialData}>Actualizar</button>
        </div>

        <div className="fruit-grid">
          {fruits.slice(0, 12).map((fruit) => (
            <FruitCard key={fruit.id || fruit.name} fruit={fruit} />
          ))}
        </div>
      </section>
    </main>
  );
}

function FruitCard({ fruit, featured = false }) {
  return (
    <article className={featured ? "fruit-card featured" : "fruit-card"}>
      <h3>{fruit.name}</h3>

      <p className="family">
        {fruit.family} · {fruit.genus}
      </p>

      <div className="nutrition-grid">
        <div>
          <span>Calorías</span>
          <strong>{fruit.nutritions?.calories}</strong>
        </div>

        <div>
          <span>Azúcar</span>
          <strong>{fruit.nutritions?.sugar}g</strong>
        </div>

        <div>
          <span>Carbos</span>
          <strong>{fruit.nutritions?.carbohydrates}g</strong>
        </div>

        <div>
          <span>Proteína</span>
          <strong>{fruit.nutritions?.protein}g</strong>
        </div>
      </div>
    </article>
  );
}

export default App;