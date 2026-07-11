import { useState } from 'react';
import FruitList from '../components/FruitList';
import './HomePage.css';

function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="home-page">
            <nav className="navbar">
                <div className="navbar-inner">
                    <div className="navbar-brand">
                        <span className="navbar-logo">🍎</span>
                        <span className="navbar-title">FrutiOps</span>
                    </div>
                    <div className="navbar-links">
                        <a href="#explorar" className="navbar-link active">Explorar</a>
                        <a href="#acerca" className="navbar-link">Acerca</a>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb hero-orb-1"></div>
                    <div className="hero-orb hero-orb-2"></div>
                    <div className="hero-orb hero-orb-3"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        API en tiempo real
                    </div>
                    <h1 className="hero-title">
                        Descubre el mundo de las
                        <span className="hero-title-accent"> frutas</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explora informacion nutricional detallada de mas de 100 frutas
                        obtenidas directamente de Fruityvice. Calorias, proteinas,
                        carbohidratos y mucho mas.
                    </p>
                    <div className="hero-search">
                        <div className="search-wrapper">
                            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Buscar fruta..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="search-clear" onClick={() => setSearchTerm('')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-number">100+</span>
                            <span className="hero-stat-label">Frutas</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">Real-time</span>
                            <span className="hero-stat-label">Datos actualizados</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">Gratis</span>
                            <span className="hero-stat-label">API abierta</span>
                        </div>
                    </div>
                </div>
            </section>

            <main className="main-content" id="explorar">
                <FruitList searchTerm={searchTerm} />
            </main>

            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <span className="footer-logo">🍎</span>
                        <span>FrutiOps</span>
                    </div>
                    <p className="footer-text">
                        Desarrollado con React + Express | Datos de Fruityvice
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
