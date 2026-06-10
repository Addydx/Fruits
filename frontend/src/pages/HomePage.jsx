import fruittree from '../assets/fruittree2.jpg';
import FruitList from '../components/FruitList';
import fruitList from '../components/FruitList';

function HomePage() {
    return (
        <>
            <header>
                <h1>🍎Fruits</h1>

            </header>

            <main>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    padding: '20px', //espaciado entre los elementos
                }}>
                    <img src={fruittree} alt="Fruit Tree" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                    <div>
                        <h2>Las frutas</h2>
                        <p>Aqui podras ver una variedad de frutas donde veras los atributos de esta como las calorias y un poco de historia de esta.</p>
                    </div>
                </div>
                <FruitList />
            </main>
        </>

    );
}


    
export default HomePage;