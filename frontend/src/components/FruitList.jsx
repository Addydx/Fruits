import { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';
import './FruitList.css';

function NutritionBar({ label, value, unit, max }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="nutrition-row">
      <div className="nutrition-label">
        <span>{label}</span>
        <span className="nutrition-value">{value ?? 'N/A'}{unit}</span>
      </div>
      <div className="nutrition-track">
        <div className="nutrition-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="fruit-card skeleton">
      <div className="skeleton-image skeleton-pulse" />
      <div className="skeleton-body">
        <div className="skeleton-lines">
          <div className="skeleton-line skeleton-line-title skeleton-pulse" />
          <div className="skeleton-line skeleton-line-sub skeleton-pulse" />
        </div>
        <div className="skeleton-nutrition">
          <div className="skeleton-line skeleton-pulse" />
          <div className="skeleton-line skeleton-pulse" />
        </div>
      </div>
    </div>
  );
}

function FruitCard({ fruit, index }) {
  const imageUrl = fruit.imagenes?.[0] || null;

  return (
    <div
      className="fruit-card"
      style={{ animationDelay: `${Math.min(index * 40, 600)}ms` }}
    >
      <div className="fruit-card-image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={fruit.nombre}
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.classList.add('fruit-card-image--empty'); }}
          />
        ) : (
          <div className="fruit-card-image-placeholder">
            <span className="placeholder-initial">{(fruit.nombre || '?')[0].toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="fruit-card-body">
        <div className="fruit-card-titles">
          <h3 className="fruit-card-name">{fruit.nombre}</h3>
          <span className="fruit-card-family">{fruit.familiaBotanica || 'Desconocida'}</span>
        </div>

        {fruit.descripcion && (
          <p className="fruit-card-desc">{fruit.descripcion.slice(0, 100)}...</p>
        )}

        <div className="fruit-card-meta">
          {fruit.categoria && (
            <span className="fruit-tag tag-categoria">{fruit.categoria}</span>
          )}
          {fruit.temporada?.slice(0, 2).map(t => (
            <span key={t} className="fruit-tag tag-temporada">{t}</span>
          ))}
          {fruit.colores?.slice(0, 2).map(c => (
            <span key={c} className="fruit-tag tag-color">{c}</span>
          ))}
        </div>

        <div className="fruit-card-nutrition">
          <NutritionBar label="Calorias" value={fruit.caloriasKcal} unit=" kcal" max={200} />
          <NutritionBar label="Azucar" value={fruit.azucaresG} unit="g" max={40} />
          <NutritionBar label="Proteina" value={fruit.proteinasG} unit="g" max={15} />
          <NutritionBar label="Grasas" value={fruit.grasasG} unit="g" max={20} />
          <NutritionBar label="Carbohidratos" value={fruit.carbohidratosG} unit="g" max={50} />
        </div>
      </div>
    </div>
  );
}

function FruitList({ searchTerm }) {
    const [fruits, setFruits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        const cargarFrutas = async () => {
            try {
                setLoading(true);
                const data = await api.frutas.listar({ por_pagina: 100 });
                setFruits(data.datos || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al cargar las frutas');
            } finally {
                setLoading(false);
            }
        };
        cargarFrutas();
    }, []);

    const filteredFruits = useMemo(() => {
        let result = fruits;
        if (searchTerm?.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(f =>
                f.nombre?.toLowerCase().includes(term) ||
                f.familiaBotanica?.toLowerCase().includes(term) ||
                f.categoria?.toLowerCase().includes(term) ||
                f.origenPais?.toLowerCase().includes(term)
            );
        }
        if (sortBy === 'calories') {
            result = [...result].sort((a, b) => (a.caloriasKcal || 0) - (b.caloriasKcal || 0));
        } else if (sortBy === 'sugar') {
            result = [...result].sort((a, b) => (a.azucaresG || 0) - (b.azucaresG || 0));
        } else {
            result = [...result].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        }
        return result;
    }, [fruits, searchTerm, sortBy]);

    if (error) {
        return (
            <div className="fruit-list-error">
                <div className="error-icon">⚠️</div>
                <h3>Error al cargar frutas</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="fruit-list">
            <div className="fruit-list-header">
                <div className="fruit-list-title-group">
                    <h2 className="fruit-list-title">Todas las frutas</h2>
                    {!loading && (
                        <span className="fruit-list-count">{filteredFruits.length} resultados</span>
                    )}
                </div>
                <div className="fruit-list-controls">
                    <div className="sort-buttons">
                        <button className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`} onClick={() => setSortBy('name')}>A-Z</button>
                        <button className={`sort-btn ${sortBy === 'calories' ? 'active' : ''}`} onClick={() => setSortBy('calories')}>Calorias</button>
                        <button className={`sort-btn ${sortBy === 'sugar' ? 'active' : ''}`} onClick={() => setSortBy('sugar')}>Azucar</button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="fruit-grid">
                    {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredFruits.length === 0 ? (
                <div className="fruit-list-empty">
                    <span className="empty-emoji">🔍</span>
                    <h3>Sin resultados</h3>
                    <p>No se encontraron frutas para "<strong>{searchTerm}</strong>"</p>
                </div>
            ) : (
                <div className="fruit-grid">
                    {filteredFruits.map((fruit, index) => (
                        <FruitCard key={fruit.id ?? fruit.nombre} fruit={fruit} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FruitList;
