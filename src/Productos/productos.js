// Codigo para la página de productos 

// Cargar la lista de productos al cargar la página 
document.addEventListener('DOMContentLoaded', function() {
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
});
