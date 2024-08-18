// Codigo para la página de baja de productos en un departamento

document.getElementById('deleteForm').addEventListener('submit', function(event) {
    // Evitar que se recargue la página al enviar el formulario
    event.preventDefault();
    
    // Obtener los datos del formulario
    const productClave = document.getElementById('productKey').value;
    
    // Crear un objeto con los datos del producto
    const productData = {
        Claveproduct: productClave
    };

    // Enviar los datos del producto al servidor para eliminarlo
    fetch('/delete-product-dept', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar el mensaje en la página según el resultado
        if (data.success) {
            document.getElementById('result').innerText = 'Producto eliminado con éxito.';
        } else {
            document.getElementById('result').innerText = data.message;
        }
        
        // Limpiar el formulario después de la operación
        document.getElementById('deleteForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Hubo un error al eliminar el producto.';
    });
});
