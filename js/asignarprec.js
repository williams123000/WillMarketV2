// Codigo para asignar precios a los productos

document.getElementById('precForm').addEventListener('submit', function(event) {
    // Evitar que se recargue la página al enviar el formulario
    event.preventDefault();

    // Obtener los datos del formulario
    const claveDept = document.getElementById('claveDept').value.trim();
    const claveProduct = document.getElementById('claveProduct').value.trim();
    const precio = document.getElementById('precio').value.trim();

    // Crear un objeto con los datos del producto
    const precData = {
        claveDept: claveDept,
        claveProduct: claveProduct,
        precio: precio
    };

    // Enviar los datos del producto al servidor para guardar el producto
    fetch('/save-price', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(precData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Si el registro es exitoso, mostrar un mensaje en la página y limpiar el formulario
        if (data.success) {
            document.getElementById('result').innerText = `Precio asignado con éxito.`;
            document.getElementById('precForm').reset();
        } else {
            // Si hay un error, mostrar un mensaje en la página
            document.getElementById('result').innerText = 'Hubo un error al asignar el precio.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Hubo un error al asignar el precio.';
    });
} );