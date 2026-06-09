import fruittree from './assets/fruittree3.jpg';

function App() {
  return (
    <> 
      <header>
        <h1>Fruits</h1>
        
      </header>

      <main>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}>
          <img src={fruittree} alt="Fruit Tree" style={{width:'100%', height:'auto', objectFit:'cover'}}/>
          <div>
            <h2>Las frutas</h2>
          </div>
        </div>
        <p>Aqui iran las frutas</p>
      </main>
    </>
    
  );
}

export default App;