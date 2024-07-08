const BASEURL = 'http://localhost:8080/api/users';

async function fetchData(url, method, data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        // alert('An error occurred while fetching data. Please try again.');
    }
}

async function showClientes() {
    let clientes = await fetchData(BASEURL, 'GET');
    const tableClientes = document.querySelector('#list-clientes tbody');
    tableClientes.innerHTML = '';
    clientes.forEach((clie) => {
        let tr = `<tr>
            <td>${clie.username}</td>
            <td>${clie.email}</td>
            <td>${clie.password}</td>
            <td>
                <button class="btn-fan" onclick='updateCliente(${clie.id})'><i class="fa-solid fa-pen-to-square fa-2xl"></i></button>
                <button class="btn-fan" onclick='deleteCliente(${clie.id})'><i class="fa-regular fa-trash-can fa-2xl"></i></button>
            </td>
          </tr>`;
        tableClientes.innerHTML += tr;
    });
}

async function saveCliente() {
    const id = document.querySelector('#id').value;
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (!username || !email || !password) {
        Swal.fire({
            title: 'Error!',
            text: 'Por favor completa todos los campos.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    const clienteData = {
        username: username,
        email: email,
        password: password,
    };
    let result = null;

    if (id!== "") {
        result = await fetchData(`${BASEURL}/${id}`, 'PUT', clienteData);
    } else {
        result = await fetchData(`${BASEURL}`, 'POST', clienteData);
    }

    const formclientes = document.querySelector('#userForm');
    formclientes.reset();
    Swal.fire({
        title: 'Éxito!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'Cerrar'
    })
    showClientes();
}

function deleteCliente(id) {
    Swal.fire({
        title: "¿Está seguro de eliminar el Cliente?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            let response = await fetchData(`${BASEURL}/${id}`, 'DELETE');
            showClientes();
            Swal.fire(response.message, "", "success");
        }
    });
}

async function updateCliente(id) {
    let response = await fetchData(`${BASEURL}/${id}`, 'GET');
    const idClie = document.querySelector('#id');
    const usernameU = document.querySelector('#username');
    const emailE = document.querySelector('#email');
    const passwordP = document.querySelector('#password');

    idClie.value = response.id;
    usernameU.value = response.username;
    emailE.value = response.email;
    passwordP.value = response.password;
}

document.addEventListener('DOMContentLoaded', function () {
    const btnSaveCliente = document.querySelector('#btn-save-cliente');
    btnSaveCliente.addEventListener('click', saveCliente);
    showClientes();
});
