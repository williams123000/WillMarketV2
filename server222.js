// Importar los módulos necesarios 

const express = require('express'); // Importar el módulo express para crear el servidor
const dotenv = require('dotenv'); // Importar el módulo dotenv para leer las variables de entorno
const bodyParser = require('body-parser'); // Importar el módulo body-parser para leer los datos de las peticiones POST
const { createClient } = require('@supabase/supabase-js'); // Importar el módulo @supabase/supabase-js para interactuar con Supabase

dotenv.config(); // Leer las variables de entorno del archivo .env
const app = express(); // Crear una instancia de express
app.use(express.json()); // Configurar express para leer los datos de las peticiones POST
app.use(bodyParser.json()); // Configurar body-parser para leer los datos de las peticiones POST 
app.use(bodyParser.urlencoded({ extended: true })); //Formatear los datos de las peticiones POST en formato JSON 
app.use(express.urlencoded({ extended: true })); //Formatear los datos de las peticiones POST en formato JSON

const PORT = process.env.PORT || 3000; // Definir el puerto en el que se ejecutará el servidor
const supabaseUrl = process.env.SUPABASE_URL; // Obtener la URL de Supabase desde las variables de entorno
const supabaseKey = process.env.SUPABASE_KEY; // Obtener la clave de Supabase desde las variables de entorno
const supabase = createClient(supabaseUrl, supabaseKey); // Crear una instancia del cliente de Supabase


// Ruta para obtener la lista de productos de la base de datos de Supabase
app.get('/get-products', async (req, res) => {
    // Obtener los productos de la tabla 'Productos' de Supabase
    const { data, error } = await supabase.from('productos').select('*');
    console.log(data);
    // Verificar si hubo un error al obtener los productos
    if (error) {
        console.error('Error al obtener los productos:', error);
        return res.json({ success: false });
    }
    // Si se obtuvieron los productos correctamente, devolver la lista de productos
    res.json({ success: true });
});

// Ruta para guardar el producto en la base de datos de Supabase
app.post('/save-product', async (req, res) => {
    // Obtener los datos del producto del cuerpo de la solicitud
    const productData = req.body;
    console.log(productData);
    // Insertar el producto en la tabla 'productos' de Supabase
    const { data, error } = await supabase.from('Productos').insert(productData);
    // Verificar si hubo un error al insertar el producto
    if (error) {
        console.error('Error al insertar el producto:', error);
        return res.json({ success: false });
    }
    // Si el producto se insertó correctamente, devolver la clave asignada
    res.json({ success: true, key: data[0].id });
});


app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
