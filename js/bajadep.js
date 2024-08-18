// Codigo para borrar un departamento
// Manejar el envío del formulario de eliminación de departamento

document.addEventListener('DOMContentLoaded', function() {
    // Ruta para obtener los departamentos y mostrarlos en la página 
    function loadDepartments() {
        fetch('/get-departments')
            .then(response => response.json())
            .then(data => {
                const departmentList = document.getElementById('departmentList');
                if (data.success) {
                    departmentList.innerHTML = ''; // Limpiar lista actual
                    data.departments.forEach(department => {
                        const departmentCard = `
                            <div class="col-md-4">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title">Clave: ${department.key}</h5>
                                        <p class="card-text">Departamento: ${department.name}</p>
                                        <p class="card-text">Gerente: ${department.manager}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                        departmentList.insertAdjacentHTML('beforeend', departmentCard);
                    });
                } else {
                    departmentList.innerHTML = '<p>Hubo un error al cargar los departamentos.</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const departmentList = document.getElementById('departmentList');
                departmentList.innerHTML = '<p>Hubo un error al cargar los departamentos.</p>';
            });
    }

    // Cargar los departamentos al inicio
    loadDepartments();

    // Manejar el envío del formulario de eliminación
    document.getElementById('deleteForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const departmentKey = document.getElementById('depKey').value;

        if (confirm(`¿Estás seguro de que deseas eliminar el departamento con clave ${departmentKey}?`)) {
            fetch('/delete-department', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ key: departmentKey })
            })
            .then(response => response.json())
            .then(data => {
                const resultElement = document.getElementById('result');
                if (data.success) {
                    resultElement.innerText = `Departamento con clave ${departmentKey} eliminado con éxito.`;
                    document.getElementById('deleteForm').reset();
                    loadDepartments(); // Recargar la lista de departamentos
                } else {
                    resultElement.innerText = `Error: ${data.message}`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('result').innerText = 'Hubo un error al eliminar el departamento.';
            });
        }
    });
});
