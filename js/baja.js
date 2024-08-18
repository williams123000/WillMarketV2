// Código para la página de baja de productos
// Manejar el envío del formulario de eliminación de productos

document.addEventListener('DOMContentLoaded', function() {
    // Ruta para obtener los productos y mostrarlos en la página 
    fetch('/get-products')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const productList = document.getElementById('productList');
                data.products.forEach(product => {
                    const productCard = `
                        <div class="col-md-4">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h5 class="card-title">Clave: ${product.key}</h5>
                                    <p class="card-text">Producto: ${product.name}</p>
                                    <p class="card-text">Proveedor: ${product.provider}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    productList.insertAdjacentHTML('beforeend', productCard);
                });
            } else {
                const productList = document.getElementById('productList');
                productList.innerHTML = '<p>Hubo un error al cargar los productos.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const productList = document.getElementById('productList');
            productList.innerHTML = '<p>Hubo un error al cargar los productos.</p>';
        });

    // Manejar el envío del formulario de eliminación
    document.getElementById('deleteForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const productKey = document.getElementById('productKey').value;

        // Confirmar la eliminación
        if (confirm(`¿Estás seguro de que deseas eliminar el producto con clave ${productKey}?`)) {
            fetch('/delete-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ key: productKey })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('result').innerText = `Producto con clave ${productKey} eliminado con éxito.`;
                    document.getElementById('deleteForm').reset();
                    document.getElementById('productList').innerHTML = ''; // Limpiar la lista
                    fetch('/get-products')
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                const productList = document.getElementById('productList');
                                data.products.forEach(product => {
                                    const productCard = `
                                        <div class="col-md-4">
                                            <div class="card mb-4">
                                                <div class="card-body">
                                                    <h5 class="card-title">Clave: ${product.key}</h5>
                                                    <p class="card-text">Producto: ${product.name}</p>
                                                    <p class="card-text">Proveedor: ${product.provider}</p>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                    productList.insertAdjacentHTML('beforeend', productCard);
                                });
                            } else {
                                const productList = document.getElementById('productList');
                                productList.innerHTML = '<p>Hubo un error al cargar los productos.</p>';
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            const productList = document.getElementById('productList');
                            productList.innerHTML = '<p>Hubo un error al cargar los productos.</p>';
                        });
                } else {
                    document.getElementById('result').innerText = `Error: ${data.message}`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('result').innerText = 'Hubo un error al eliminar el producto.';
            });
        }
    });
});
