// Codigo para consultar precios de los productos

document.getElementById('consultPrecForm').addEventListener('submit', function(event) {
    // Evitar que se recargue la página al enviar el formulario
    event.preventDefault();

    // Obtener los datos del formulario
    const claveDept = document.getElementById('claveDept').value.trim();
    // Crear un objeto con los datos del producto
    const precData = {
        claveDept: claveDept
    };

    // Enviar los datos del producto al servidor para guardar el producto
    fetch('/consult-price', {
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
            const precList = document.getElementById('precList');
            precList.innerHTML = '';
            data.products.forEach(product => {
                const precCard = `
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <div class="card-body">
                                <h5 class="card-title
                                ">Clave producto: ${product.key}</h5>
                                <p class="card-text">Producto: ${product.name}</p>
                                <p class="card-text">Precio: $${product.price}</p>
                            </div>
                        </div>
                    </div>
                `;
                precList.insertAdjacentHTML('beforeend', precCard);
            }
            );
        }
        else {
            const precList = document.getElementById('precList');
            precList.innerHTML = '<p>Hubo un error al cargar los precios.</p>';
        }
    }
    )
    .catch(error => {
        console.error('Error:', error);
        const precList = document.getElementById('precList');
        precList.innerHTML = '<p>Hubo un error al cargar los precios.</p>';
    });
}
);


