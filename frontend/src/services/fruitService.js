//Este es el archivo donde se conectara el front con el back y se haran las peticiones para obtener las frutas

//esta el la url base del backend
const API_URL = 'http://localhost:3000';

//funcion para obtener todas las frutas
export const getFruits = async () => {//async 
    try {
        const response = await fetch(`${API_URL}/fruits`);//fetch para obtener las frutas
        //si la respuesta no es ok lanza un error
        if (!response.ok) {
            throw new Error('Error al obtener las frutas');
        }
        const data = await response.json();//convierte la respuesta a json
        return data; //retorna los datos
    } catch (error) {
        console.error('Error en getFruits:', error);
        throw error; //lanza el error para que pueda ser manejado por el componente 
    }
}