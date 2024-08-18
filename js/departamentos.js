// Codigo para la página de departamentos

// Cargar la lista de departamentos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    fetch('/get-departments')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const deptList = document.getElementById('deptList');
                data.departments.forEach(department => {
                    const deptCard = `
                        <div class="col-md-4">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h5 class="card-title
                                    ">Clave: ${department.key}</h5>
                                    <p class="card-text">Departamento: ${department.name}</p>
                                    <p class="card-text">Encargado: ${department.manager}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    deptList.insertAdjacentHTML('beforeend', deptCard);
                }
                );
            }
            else {
                const deptList = document.getElementById('deptList');
                deptList.innerHTML = '<p>Hubo un error al cargar los departamentos.</p>';
            }
        }
        )
        .catch(error => {
            console.error('Error:', error);
            const deptList = document.getElementById('deptList');
            deptList.innerHTML = '<p>Hubo un error al cargar los departamentos.</p>';
        }
        );
}
);
