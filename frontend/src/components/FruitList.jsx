import { useState, useEffect } from 'react';
//hooks de react son funciones especiales para manejar logica dentro de componentes funcionales
//useState  sirve para actualizar el estado de un componente(guardar y modificar valores)
//useEffect sirve para manejar efectos secundarios como llamadas a APIs, suscripciones, etc.

import { getFruits } from '../services/fruitService';
import './FruitList.css';

function FruitList() {
    //estado para guardar las frutas
    const [fruits, setFruits] = useState([]);//estado para guardar las frutas

    //estado para mostrar si esta cargando
    const [loading, setLoading] = useState(true); //estado para mostrar si esta cargando

    //estado para mostrar errores
    const [error, setError] = useState(null);

    //useEffect cuando el componente se monta(aparece en la pantalla)
    useEffect(() => {
        //funcion para cargar las frutas
        const cargarFrutas = async () => {
            try {
                setLoading(true); //muestra que esta cargando
                const data = await getFruits(); //obtener las frutas del backend
                setFruits(data); //guardar las frutas en el estado
                setError(null); //esto hace que el error sea null para no mostrar el mensaje de error
            } catch (err) {
                setError('Error al cargar las frutas'); //muestra un mensaje de error
            } finally {
                setLoading(false); //oculta el indicador de carga
            }
        };

        cargarFrutas(); //llama la funcion para cargar las frutas
    }, []); //el array vacio hace que se ejecute solo una vez cuando el componente se monta

    //si esta cargando, mostrar "cargando..."
    if (loading) return <p>Cargando frutas...</p>;
    
    //si hay error, mostrar un mensaje de error
    if (error) return <p style={{color:'red'}}>{error}</p>;

    //si no hay frutas mostrar mensaje
    if (fruits.length === 0) return <p>No hay frutas disponibles</p>;

    //si todo esta bien mostrar las frutas 
    return (
        <div class="fruit-list">
            <h2>Lista de Frutas</h2>
            <div class="fruit-grid">
                {fruits.map((fruit) => (
                    <div key={fruit.id} class="fruit-card">
                        <h3>{fruit.name}</h3>
                        <p><strong>Familia:</strong> {fruit.family}</p>
                        <p><strong>Calorias:</strong> {fruit.calories}</p>
                        <p><strong>Azúcar:</strong> {fruit.sugar}</p>
                        <p><strong>Proteina:</strong> {fruit.protein}</p>
                        <p><strong>Grasas:</strong> {fruit.fat} </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FruitList; //exporta el componente para que pueda ser usado en otros archivos