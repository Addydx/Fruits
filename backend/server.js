//Aledev

const express = require("express");//esto es para crear el servidor
//requiere significa que estamos importando una libreria o modulo, en este caso express
const cors = require("cors"); //esto es para permitir que el servidor acepte peticionese de otros dominios
require("dotenv").config(); //esto es para cargar las variables de entorno desde un archivo .env


const app = express(); //esto es para crear una instancia de express, que es el servidor


app.use(cors()); //esto es para usar el middleware de cors, que permite las peticiones de otros dominios
app.use(express.json());// esto es para usar el middleware de express.json, que permite que el servidor entienda las peticiones con formato JSON

const PORT = process.env.PORT || 3000; //esto para definir el puerto en el que el servidor va a escuchar, si no se define en las variables de entorno, se usara el puerto 3000
const FRUITYVICE_API = "https://www.fruityvice.com/api/fruit";//esto es para definir la URL de la API de fruityvice, que es la que vamos a usar para obtener los datos de las criptomonedas

let favorites = []; //esto es para definir un array vacio que va a almacenar las frutas favoritas de los usuarios

app.get("/", (req, res) => {//esto es para definir una ruta en la raiz del servidor, que va a responder con un mensaje de bienvenida
    res.json({ 
        message: "Bienvenido al API de frutas, andamos funcionando",
        description: "Proyecto DevOps con informacion de frutas",
        version: "1.0.0"
    });
});

app.get("/health", (req, res) => {//esto es para definir una ruta de salud, que va a responder con un mensaje de que el servidro esta saludable
    res.json({
        status: "healthy",
        uptime: process.uptime(),//esto es para mostrar el tiempo que el servidor ha estado funcionando
        timestamp: Date.now()//esto es para mostrar la fecha y hora actual en formato de timestamp
    })  
});

//ahora vamos a definir la ruta para obtener las frutas, esta ruta va a hacer una peticion a la API de fruityce para obtener los datos de las frutas y luego los va a devolver al cliente
app.get("/fruits", async (req, res) => {
    try {//esto es para hacer una peticion a la API de fruityce y obtener los datos de las frutas 
        const response = await fetch(`${FRUITYVICE_API}/all`); //esto es para hacer una peticion a la API de fruityce usando fetch, que es una funcion que permite hacer peticiones HTTP

        if(!response.ok) {//esto es para verificar si la respuesta de la API de fruityce es correcta, si no lo es, se lanza un error
            return res.status(502).json({
                error: "Error al obtener las frutas en Fruityvice",
                status: response.status //esto es para incluir el status de la respusta del api, response.status es el codigo http del estado
            });
        }
        
        const fruits = await response.json(); //esto es para convertir la respuesta de la API de fruityce a formato JSON, que es un formato que se puede manipular en Javascript

        res.json(fruits);//esto es para devolver los datos de las frutas al cliente en formato JSON 
    } catch (error) {//esto es para manejar cualquier error que pueda ocurrir durante la peticion a la API y devolver un mensaje de error al cliente
        console.error("Error en GET /fruits", error.message);//esto es para mostrar el error en la consola del servidro

        //res significa response, que es el objeto que se usa para enviar la respuesta al cliente
        res.status(500).json({//este status 500 significa que hubo un error en el servidor
            error: "Error al obtener las frutas",
            errorMessage: error.message
        })
    } 
})

app.get("/fruits/:name", async (req, res) => {//esto es para definir una ruta para obtener una fruta , lleva req y res como parametros, req es el objeto que representa la peticion del cliente y res es el objeto que representa la respuesta del servidor, :name es un parametro dinamico que se va a usar para obtener el nombre de la fruta que se quier obtener
    try {
        const { name } = req.params; // esto es para obtener el nombre de la fruta del parametro dinamico de la ruta, req.params es un objeto que contiene los parametros de la ruta, en este caso namees el nombre de la fruta que se quiere obtener
        const response = await fetch(`${FRUITYVICE_API}/${name}`); //esto es para hacer una peticion a la API de fruityce usando fetch, pero esta vez se le agrega el nombre de la fruta al final de la URL para obtener los datos de esa fruta en especifico 

        if(response.status === 404) { //esto es para verificar si la respuesta de la API de fruityce es un error 404, que significa que no se encontro la fruta, si es asi, se devuelve un mensaje de error al cliente
            return res.status(404).json({
                error: "Fruta no encontrada"
            });
        }

        if(!response.ok ) {
            return res.status(502).json({//esto es para verficiar si la ruta de la API de fruityce es correcta, si no lo es se devulve un error 502 que significa que hubo un error en la perta de enlace del servidor
                error: "Error al consultar Fruityvice",
            })
        }

        const fruit = await response.json();//esto es para convertir la respuesta de la API de fruityce a formato JSOON
        res.json(fruit);// esto es para devolver los datos de la fruta al cliente en formato JSON
    } catch (error) {
        console.error("Error en GET /fruits/:name", error.message);//esto es para mostrar el error en la consola del servidro

        res.status(500).json({
            error:"Error interno al obtener la fruta",
        })
    }
})

app.get("/stats", async (req, res) => {
    try {
        const response = await fetch(`${FRUITYVICE_API}/all`); //esto es para hacer una peticion a la API de fruityce usando fetch, que es una funcion que permite hacer peticiones HTTP

        if(!response.ok) {//if para verifica si la respuesta es correcta, si no lo es entonces se lanza un error
            return res.status(502).json({//un 502 significa que hubo un error en la puerta de enlace del servidor
                error: "Error al obtener las frutas en Fruityvice",//mensaje de error que se le devuelve al cliente
            });
        }

        const fruits = await response.json(); //esto es para convertir la respuesta de la api en formato JSON
        const totalFruits = fruits.length; //esto es para contar el total de frutas, con ayuda de la propiedad length del array de frutas

        const averageCalories = 
            fruits.reduce ((sum, fruit) => sum + fruit.nutritions.calories, 0) /
            totalFruits; //esto es para calcular el promedio de calorias, usando el metodo reduce, se suman las calorias y de divide por el total de frutas para obtener el promedio
        
        const averageSugar = 
            fruits.reduce((sum, fruit) => sum + fruit.nutritions.sugar, 0) / 
            totalFruits; //esto es para calcular el promedio de azucar, usando el metodo reduce, se suman las azucares y se divide por el total de frutas para obtener el promedio

        const fruitWithMostSugar = fruits.reduce((max, fruit) => {
            return fruit.nutritions.sugar > max.nutritions.sugar ? fruit : max; // esto es para econtrar la fruta con mas azucar, usando el metodo reduce, se compara el nivel de azucar de cada fruta con el maximo encontrado hasta el momento, si es mayor se actualiza el maximo, sino se mantiene el mismo
        });

        res.json({
            totalFruits,
            averageCalories: Number(averageCalories.toFixed(2)),//esto es para devolver el promedio de calorias con 2 decimales, usando el metodo toFixed para redondear el numero a 2 decimales y luego se convierte a numero con Number para eliminar los ceros innecesarios 
            averageSugar: Number(averageSugar.toFixed(2)),//esto es para devolver el promedio de azucar con dos decimales, usando el metodo toFixed para redondear el numero a 2 decimales y luego se convierte a numero con Number para eliminar los ceros innecesarios
            fruitWithMostSugar: {
                name: fruitWithMostSugar.name, 
                sugar: fruitWithMostSugar.nutritions.sugar,
            },
        });
    } catch (error) {
        console.error("Error en GET /stats", error.message); //esto es para mostrar el error en la consola del servidor 

        res.status(500).json({
            error: "Error interno al calcular las estadisticas",
        });
    }
});

app.get("/favorites", (req, res) => {
    res.json(favorites);//esto es para devolver el arrary de las frutas favoritas 
})

app.post("/favorites", (req, res) => {
    const { name } = req.body; //esto es para obtener el nombre de la fruta del cuerpo de la peticion, req.body es un objeto que contiene los datos enviados por el cliente en el cuerpo de la peticion

    if(!name) {
        return res.status(400).json({
            error: "El nombre de la fruta es obligatorio", 
        });
    }

    const alreadyExists = favorites.some(fruit => fruit.name.toLowerCase() === name.toLowerCase());//esto es para verificar si la fruta ya esta en el array de favoritas

    if(alreadyExists) {
        return res.status(409).json({
            error: "La fruta ya esta en favoritas",
        });
    }

    const favoriteFruit = { 
        id : Date.now(), //esto es para generar un id unico para cada fruta favorita, usando el timestamp actual
        name,
        createdAt: new Date().toISOString(), //esto es para agregar la fecha de creacion de la fruta favorita, usando el metodo toISOString para convertir la fecha a formato ISO 8601 
    }; //esto es para crear un objeto con el nombre de la fruta favorita

    favorites.push(favoriteFruit); //esto es para agregar la fruta favorita al array de favoritas

    res.status(201).json(favoriteFruit);//esto es para devolver la fruta favorita creada al cliente, 201 significa que se creo un recurso nuevo
});

app.delete("/favorites/:name" , (req, res) => {
    const { name } = req.params; //esto es para obtener el nombre de la fruta del parametro dinamico de la ruta 

    const originalLength = favorites.length; //esto es para guardar la longitud oridinal del array, para verificar si se elimino alguna fruta

    favorites = favorites.filter(
        (fruit ) => fruit.name.toLowerCase() !== name.toLowerCase() //esto es para eliminar la fruta del array de favoritas, usando el metodo filter para crear un nuevo array sin la fruta que se quiere eliminar
        //toLowerCase es para comparar los nombres de las frutas sin importar mayusculas o minusculas
    );

    if(favorites.length === originalLength) {
        return res.status(404).json({
            error: "Favorita no encontrada",
        })
    }

    res.json({
        message: "Fruta favorita eliminada exitosamente",
        name,
    })
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`); //esto es para mostrar un mensaje en la consola del servidor indicando que el servidor esta escuchando en el puerto definido
});