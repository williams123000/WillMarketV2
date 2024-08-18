// Importar los módulos necesarios 

const express = require('express'); // Importar el módulo express para crear el servidor 
const dotenv = require('dotenv'); // Importar el módulo dotenv para leer las variables de entorno
const bodyParser = require('body-parser'); // Importar el módulo body-parser para leer los datos de las peticiones POST
const { createClient } = require('@supabase/supabase-js'); // Importar el módulo @supabase/supabase-js para interactuar con Supabase
const fs = require('fs'); // Importar el módulo fs para leer y escribir archivos 
const path = require('path'); // Importar el módulo path para manejar rutas de archivos
const e = require('express');
const app = express(); // Crear una instancia de express
const PORT = 3000; // Definir el puerto en el que se ejecutará el servidor

dotenv.config(); // Leer las variables de entorno del archivo .env
app.use(express.json()); // Habilitar el uso de JSON en las solicitudes
app.use(bodyParser.json()); // Habilitar el uso de JSON en las solicitudes
app.use(bodyParser.urlencoded({ extended: true })); // Habilitar el uso de JSON en las solicitudes
app.use(express.static(path.join(__dirname, '.'))); // Habilitar el uso de archivos estáticos en la carpeta actual

const supabaseUrl = process.env.SUPABASE_URL; // Obtener la URL de Supabase desde las variables de entorno
const supabaseKey = process.env.SUPABASE_KEY; // Obtener la clave de Supabase desde las variables de entorno
const supabase = createClient(supabaseUrl, supabaseKey); // Crear una instancia del cliente de Supabase


const filePath = path.join(__dirname, 'data', 'Productos.txt'); // Ruta del archivo de productos 
const depFilePath = path.join(__dirname, 'data', 'Deptos.txt'); // Ruta del archivo de departamentos
const clavedeptoprocdepto = path.join(__dirname, 'data', 'ClaveDeptoProductosDepto.txt'); // Ruta del archivo de clavedeptoprocdepto

// Crear el archivo con los encabezados si no existe
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'Clave,Producto,Proveedor\n');
}

// Crear el archivo con los encabezados si no existe
if (!fs.existsSync(depFilePath)) {
    fs.writeFileSync(depFilePath, 'Clave,Nombre,Encargado\n');
}

// Crear el archivo con los encabezados si no existe
if (!fs.existsSync(clavedeptoprocdepto)) {
    fs.writeFileSync(clavedeptoprocdepto, '');
}


/*
// Ruta para guardar el producto en Productos.txt
app.post('/save-product', (req, res) => {

    // Obtener los datos del producto del cuerpo de la solicitud 
    const productData = req.body;

    // Leer el archivo para encontrar la última clave
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.json({ success: false });
        }

        let nextKey = 1;

        const lines = data.trim().split('\n');
        // Si hay más de una línea, obtener la clave del último producto y sumarle 1 para la nueva clave 
        if (lines.length > 1) {
            const lastLine = lines[lines.length - 1];
            const lastKey = parseInt(lastLine.split(',')[0]);
            nextKey = lastKey + 1;
        }

        // Crear la línea con los datos del producto a guardar 
        const productLine = `${nextKey},${productData.name},${productData.provider}\n`;

        // Agregar la línea al archivo de productos 
        fs.appendFile(filePath, productLine, (err) => {
            if (err) {
                console.error('Error al guardar el producto:', err);
                return res.json({ success: false });
            }
            res.json({ success: true, key: nextKey });
        });
    });
});*/



// Ruta para obtener los productos
/*app.get('/get-products', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.json({ success: false });
        }

        // Convertir el contenido del archivo a un arreglo de objetos con los productos 
        const lines = data.trim().split('\n');
        // Crear un objeto por cada línea con los datos del producto 
        const products = lines.slice(1).map(line => {
            const [key, name, provider] = line.split(',');
            return { key, name, provider };
        });

        // Enviar la lista de productos como respuesta 
        res.json({ success: true, products });
    });
});*/

// Ruta para guaradr el producto
app.post('/save-product', async (req, res) => {
    // Obtener los datos del producto del cuerpo de la solicitud
    const productData = req.body;
    console.log(productData);
    // Obtener la ultima clave del producto 
    const { data, error } = await supabase.from('productos').select('Clave').order('Clave', { ascending: false }).limit(1);
    if (error) {
        console.error('Error al obtener la última clave:', error);
        return res.json({ success: false });
    }
    const lastKey = data.length > 0 ? data[0].Clave : 0;
    const nextKey = lastKey + 1;
    // Guardar el producto en la tabla 'Productos' de Supabase
    const { error: saveError } = await supabase.from('productos').insert([{ Clave: nextKey, Producto: productData.name, Proveedor: productData.provider }]);
    if (saveError) {
        console.error('Error al guardar el producto:', saveError);
        return res.json({ success: false });
    }
    // Si se guardó el producto correctamente, devolver la clave del producto
    res.json({ success: true, key: nextKey });
    
});

// Ruta para obtener los productos
app.get('/get-products', async (req, res) => {
    // Obtener los productos de la tabla 'Productos' de Supabase
    const { data, error } = await supabase.from('productos').select('*');
    console.log(data);
    // Verificar si hubo un error al obtener los productos
    if (error) {
        console.error('Error al obtener los productos:', error);
        return res.json({ success: false });
    }
    const products = data.map(product => {
        const { Clave, Producto, Proveedor } = product;
        return { key: Clave, name: Producto, provider: Proveedor };
    });
    // Si se obtuvieron los productos correctamente, devolver la lista de productos
    res.json({ success: true, products });
}
);


/*
// Ruta para eliminar un producto
app.post('/delete-product', (req, res) => {
    // Obtener la clave del producto a eliminar 
    const { key } = req.body;

    // Leer el archivo y eliminar el producto con la clave indicada
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.json({ success: false, message: 'Error al leer el archivo.' });
        }

        // Buscar el producto con la clave indicada y eliminarlo del archivo 
        const lines = data.trim().split('\n');
        const header = lines[0];
        // Filtrar las líneas para eliminar el producto con la clave indicada 
        const products = lines.slice(1).filter(line => {
            const [productKey] = line.split(',');
            return productKey !== key;
        });

        // Verificar si se eliminó algún producto 
        if (products.length < lines.length - 1) {
            // Producto encontrado y eliminado
            fs.writeFile(filePath, `${header}\n${products.join('\n')}\n`, (err) => {
                if (err) {
                    console.error('Error al escribir el archivo:', err);
                    return res.json({ success: false, message: 'Error al escribir el archivo.' });
                }
                res.json({ success: true });
            });
        } else {
            // Producto no encontrado
            res.json({ success: false, message: 'Producto no encontrado.' });
        }
    });
});*/

// Ruta para eliminar un producto
// Ruta para eliminar un producto
app.post('/delete-product', async (req, res) => {
    const { key } = req.body;

    // Verificar si el producto existe antes de intentar eliminarlo
    const { data: existingProduct, error: fetchError } = await supabase
        .from('productos')
        .select('Clave')
        .eq('Clave', key)
        .single();

    if (fetchError) {
        console.error('Error al verificar el producto:', fetchError);
        return res.json({ success: false, message: 'Error al verificar el producto.' });
    }

    if (!existingProduct) {
        return res.json({ success: false, message: 'Producto no encontrado.' });
    }

    // Eliminar el producto
    const { error: deleteError } = await supabase.from('productos').delete().eq('Clave', key);

    if (deleteError) {
        console.error('Error al eliminar el producto:', deleteError);
        return res.json({ success: false, message: 'Error al eliminar el producto.' });
    }

    res.json({ success: true });
});




/*
// Ruta para guardar el departamento en deptos.txt
app.post('/save-department', (req, res) => {
    // Obtener los datos del departamento del cuerpo de la solicitud
    const depData = req.body;
    console.log(depData);

    // Leer el archivo
    fs.readFile(depFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.json({ success: false });
        }

        const lines = data.trim().split('\n');

        // Verificar si la clave del departamento ya existe
        const depExists = lines.some(line => {
            const [key] = line.split(',');
            return key === depData.key;
        });

        if (depExists) {
            return res.json({ success: false, message: 'La clave del departamento ya existe.' });
        }else{
            // Crear la línea con los datos del departamento a guardar
            const depLine = `${depData.key},${depData.name},${depData.manager}\n`;

            // Agregar la línea al archivo de departamentos
            fs.appendFile(depFilePath, depLine, (err) => {
                if (err) {
                    console.error('Error al guardar el departamento:', err);
                    return res.json({ success: false });
                }
                res.json({ success: true, key: depData.key });
            });
        }
    });
} );

*/

// Ruta para guardar el departamento
app.post('/save-department', async (req, res) => {
    // Obtener los datos del departamento del cuerpo de la solicitud
    const depData = req.body;
    console.log(depData);

    // Guardar el departamento en la tabla 'Departamentos' de Supabase
    const { error: saveError } = await supabase
        .from('departamentos')
        .insert([{ Clave: depData.key, Nombre: depData.name, Encargado: depData.manager }]);

    if (saveError) {
        console.error('Error al guardar el departamento:', saveError);
        return res.json({ success: false });
    }

    // Si se guardó el departamento correctamente, devolver la clave del departamento
    res.json({ success: true, key: depData.key });
});


/*
// Ruta para obtener los departamentos
app.get('/get-departments', (req, res) => {
    fs.readFile(depFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.json({ success: false });
        }

        // Convertir el contenido del archivo a un arreglo de objetos con los departamentos
        const lines = data.trim().split('\n');
        // Crear un objeto por cada línea con los datos del departamento
        const departments = lines.slice(1).map(line => {
            const [key, name, manager] = line.split(',');
            return { key, name, manager };
        });

        // Enviar la lista de departamentos como respuesta
        res.json({ success: true, departments });
    });
}
);
*/

// Ruta para obtener los departamentos
app.get('/get-departments', async (req, res) => {
    // Obtener los departamentos de la tabla 'Departamentos' de Supabase
    const { data, error } = await supabase.from('departamentos').select('*');
    // Verificar si hubo un error al obtener los departamentos
    if (error) {
        console.error('Error al obtener los departamentos:', error);
        return res.json({ success: false });
    }
    const departments = data.map(department => {
        const { Clave, Nombre, Encargado } = department;
        return { key: Clave, name: Nombre, manager: Encargado };
    });
    // Si se obtuvieron los departamentos correctamente, devolver la lista de departamentos
    res.json({ success: true, departments });
}
);


/*
// Ruta para eliminar un departamento
app.post('/delete-department', (req, res) => {
    // Obtener la clave del departamento a eliminar
    const { key } = req.body;

    // Leer el archivo y eliminar el departamento con la clave indicada
    fs.readFile(depFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.json({ success: false, message: 'Error al leer el archivo.' });
        }

        // Buscar el departamento con la clave indicada y eliminarlo del archivo
        const lines = data.trim().split('\n');
        const header = lines[0];
        // Filtrar las líneas para eliminar el departamento con la clave indicada
        const departments = lines.slice(1).filter(line => {
            const [departmentKey] = line.split(',');
            return departmentKey !== key;
        });

        // Verificar si se eliminó algún departamento
        if (departments.length < lines.length - 1) {
            // Departamento encontrado y eliminado
            fs.writeFile(depFilePath, `${header}\n${departments.join('\n')}\n`, (err) => {
                if (err) {
                    console.error('Error al escribir el archivo:', err);
                    return res.json({ success: false, message: 'Error al escribir el archivo.' });
                }
                res.json({ success: true });
            });
        } else {
            // Departamento no encontrado
            res.json({ success: false, message: 'Departamento no encontrado.' });
        }
    });
});
*/

// Ruta para eliminar un departamento
// Ruta para eliminar un departamento
app.post('/delete-department', async (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({ success: false, message: 'Clave del departamento no proporcionada.' });
    }

    // Verificar si el departamento existe antes de eliminarlo
    const { data: existingDepartment, error: fetchError } = await supabase
        .from('departamentos')
        .select('Clave')
        .eq('Clave', key)
        .single();

    if (fetchError) {
        console.error('Error al verificar el departamento:', fetchError);
        return res.status(500).json({ success: false, message: 'Error al verificar el departamento.' });
    }

    if (!existingDepartment) {
        return res.status(404).json({ success: false, message: 'Departamento no encontrado.' });
    }

    // Eliminar el departamento
    const { error } = await supabase.from('departamentos').delete().eq('Clave', key);

    if (error) {
        console.error('Error al eliminar el departamento:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar el departamento.' });
    }

    res.json({ success: true, message: 'Departamento eliminado correctamente.' });
});


// Ruta para guardar el producto en un departamento
app.post('/save-product-dept', async (req, res) => {
    // Obtener los datos del producto del cuerpo de la solicitud
    const { Claveproduct, Clavedept } = req.body;

    console.log('Clave del producto:', Claveproduct);
    console.log('Clave del departamento:', Clavedept);

    // Verificar que la clave del producto y del departamento ya existan
    const { data: product, error: productError } = await supabase
        .from('productos')
        .select('Clave')
        .eq('Clave', Claveproduct)
        .single();

    if (productError) {
        console.error('Error al verificar el producto:', productError);
        return res.json({ success: false, message: 'Error al verificar el producto.' });
    }

    if (!product) {
        return res.json({ success: false, message: 'Producto no encontrado.' });
    }

    const { data: department, error: departmentError } = await supabase
        .from('departamentos')
        .select('Clave')
        .eq('Clave', Clavedept)
        .single();

    if (departmentError) {
        console.error('Error al verificar el departamento:', departmentError);
        return res.json({ success: false, message: 'Error al verificar el departamento.' });
    }

    if (!department) {
        return res.json({ success: false, message: 'Departamento no encontrado.' });
    }

    var precio = -1;

    // Guardar la relación entre el producto y el departamento
    const { error: saveError } = await supabase.from('producDepto').insert([{ ClaveProduct: Claveproduct, Precio: precio, ClaveDepto: Clavedept }]);

    if (saveError) {
        console.error('Error al guardar la relación:', saveError);
        return res.json({ success: false, message: 'Error al guardar la relación.' });
    }

    res.json({ success: true, message: 'Relación guardada correctamente.' });

});

// Ruta para eliminar un producto de un departamento
app.post('/delete-product-dept', async (req, res) => {
    const { Claveproduct } = req.body;

    console.log('Clave del producto:', Claveproduct);

    try {
        // Verificar si el producto existe antes de intentar eliminarlo
        const { data: existingProduct, error: fetchError } = await supabase
            .from('producDepto')
            .select('ClaveProduct')
            .eq('ClaveProduct', Claveproduct)
            .single();

        if (fetchError) {
            console.error('Error al verificar el producto:', fetchError);
            return res.status(500).json({ success: false, message: 'Error al verificar el producto.' });
        }

        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }

        // Eliminar el producto
        const { error: deleteError } = await supabase
            .from('producDepto')
            .delete()
            .eq('ClaveProduct', Claveproduct);

        if (deleteError) {
            console.error('Error al eliminar el producto:', deleteError);
            return res.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
        }

        res.json({ success: true, message: 'Producto eliminado correctamente.' });
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).json({ success: false, message: 'Ocurrió un error inesperado.' });
    }
});


// Ruta para registrar el precio de un producto en un departamento
app.post('/save-price', async (req, res) => {
    const { claveDept, claveProduct, precio } = req.body;

    console.log('Clave del departamento:', claveDept);
    console.log('Clave del producto:', claveProduct);
    console.log('Precio:', precio);

    // Verificar que la clave del producto ya exista en la tabla 'producDepto'
    const { data: products, error: productError } = await supabase
        .from('producDepto')
        .select('ClaveProduct')
        .eq('ClaveProduct', claveProduct)
        .eq('ClaveDepto', claveDept);

    if (productError) {
        console.error('Error al verificar el producto:', productError);
        return res.json({ success: false, message: 'Error al verificar el producto.' });
    }

    if (!products || products.length === 0) {
        return res.json({ success: false, message: 'Producto o departamento no encontrado.' });
    }

    // Actualizar el precio del producto en el departamento
    const { error: updateError } = await supabase
        .from('producDepto')
        .update({ Precio: precio })
        .eq('ClaveProduct', claveProduct)
        .eq('ClaveDepto', claveDept);

    if (updateError) {
        console.error('Error al actualizar el precio:', updateError);
        return res.json({ success: false, message: 'Error al actualizar el precio.' });
    }

    res.json({ success: true, message: 'Precio actualizado correctamente.' });
});



// Ruta para consultar el precio de un producto en un departamento
// Ruta para consultar el precio de un producto en un departamento
app.post('/consult-price', async (req, res) => {
    const { claveDept } = req.body;

    console.log('Clave del departamento:', claveDept);

    // Verificar que la clave del departamento ya exista en la tabla 'producDepto'
    const { data: departments, error: departmentError } = await supabase
        .from('producDepto')
        .select('ClaveDepto')
        .eq('ClaveDepto', claveDept);

    if (departmentError) {
        console.error('Error al verificar el departamento:', departmentError);
        return res.json({ success: false, message: 'Error al verificar el departamento.' });
    }

    if (!departments || departments.length === 0) {
        return res.json({ success: false, message: 'Departamento no encontrado.' });
    }

    // Obtener los productos del departamento
    const { data: products, error: productsError } = await supabase
        .from('producDepto')
        .select('ClaveProduct, Precio')
        .eq('ClaveDepto', claveDept);

    if (productsError) {
        console.error('Error al obtener los productos:', productsError);
        return res.json({ success: false, message: 'Error al obtener los productos.' });
    }

    const productKeys = products.map(product => product.ClaveProduct);

    // Obtener los datos de los productos
    const { data: productData, error: productDataError } = await supabase
        .from('productos')
        .select('Clave, Producto')
        .in('Clave', productKeys);

    if (productDataError) {
        console.error('Error al obtener los datos de los productos:', productDataError);
        return res.json({ success: false, message: 'Error al obtener los datos de los productos.' });
    }

    // Crear un mapa con las claves y nombres de los productos para facilitar la búsqueda por clave
    const productMap = productData.reduce((map, product) => {
        map[product.Clave] = product.Producto;
        return map;
    }, {});

    // Combinar los datos de los productos y los precios para enviarlos como respuesta
    const productsWithPrice = products.map(product => {
        return {
            key: product.ClaveProduct,
            name: productMap[product.ClaveProduct],
            price: product.Precio
        };
    });

    res.json({ success: true, products: productsWithPrice });
});




app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
