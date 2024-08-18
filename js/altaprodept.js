// Codigo para la página de alta de productos en un departamento
// Enviar datos del formulario al servidor para guardar un producto en un archivo de texto

document.getElementById('productForm').addEventListener('submit', function(event) {
    // Evitar que se recargue la página al enviar el formulario
    event.preventDefault();
    // Obtener los datos del formulario (nombre del producto y nombre del proveedor) 
    const productClave = document.getElementById('productClave').value;
    const deptoclave = document.getElementById('claveDept').value;
    // Crear un objeto con los datos del producto 
    const productData = {
        Claveproduct: productClave,
        Clavedept: deptoclave
    };

    // Enviar los datos del producto al servidor para guardar el producto en un archivo de texto
    fetch('/save-product-dept', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    // Convertir la respuesta a JSON y mostrar el resultado en la página
    .then(data => {
        // Si el registro es exitoso, mostrar un mensaje en la página y limpiar el formulario
        if (data.success) {
            document.getElementById('result').innerText = `Producto registrado con éxito.`;
            document.getElementById('productForm').reset();
        } else {
            // Si hay un error, mostrar un mensaje en la página
            document.getElementById('result').innerText = 'Hubo un error al registrar el producto clave de producto o departamento no registrada.';
        }
    })
    // Manejar errores de conexión o del servidor
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Hubo un error al registrar, clave de producto o departamento no registrada.';
    });
} );