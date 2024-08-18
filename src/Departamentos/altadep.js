// Codigo para dar de alta un deparramento
// Enviar datos del formulario al servidor para guardar un departamento en un archivo de texto

document.getElementById('depForm').addEventListener('submit', function(event) {
    // Evitar que se recargue la página al enviar el formulario
    event.preventDefault();

    // Obtener los datos del formulario
    const depKey = document.getElementById('depKey').value.trim();
    const depName = document.getElementById('depName').value.trim();
    const depManager = document.getElementById('depManager').value.trim();

    // Crear un objeto con los datos del departamento
    const depData = {
        key: depKey,
        name: depName,
        manager: depManager
    };

    // Enviar los datos del departamento al servidor para guardar el departamento
    fetch('/save-department', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(depData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Si el registro es exitoso, mostrar un mensaje en la página y limpiar el formulario
        if (data.success) {
            document.getElementById('result').innerText = `Departamento registrado con éxito. Clave asignada: ${data.key}`;
            document.getElementById('depForm').reset();
        } else {
            // Si hay un error, mostrar un mensaje en la página
            document.getElementById('result').innerText = 'Hubo un error al registrar el departamento.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Hubo un error al registrar el departamento.';
    });
});
