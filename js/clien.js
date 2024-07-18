class UserService {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async fetchData(url, method, data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : null,
        };
        try {
            const response = await fetch(url, options);
            const text = await response.text();
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText} - ${text}`);
            }

            return text ? JSON.parse(text) : {}; // Return an empty object if the response body is empty
        } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        }
    }

    async getUsers() {
        return await this.fetchData(this.baseURL, 'GET');
    }

    async getUser(id) {
        return await this.fetchData(`${this.baseURL}?username=${id}`, 'GET');
    }

    async saveUser(user) {
        if (user.id) {
            return await this.fetchData(`${this.baseURL}?id=${user.id}`, 'PUT', user);
        } else {
            return await this.fetchData(this.baseURL, 'POST', user);
        }
    }

    async deleteUser(id) {
        return await this.fetchData(`${this.baseURL}?id=${id}`, 'DELETE');
    }
}


const userService = new UserService('http://localhost:8080/users');

async function showClientes() {
    let clientes = await userService.getUsers();
    console.log(clientes);
    const tableClientes = document.querySelector('#list-clientes tbody');
    tableClientes.innerHTML = '';
    if (clientes && Array.isArray(clientes)) {
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
        id: id || null,
        username: username,
        email: email,
        password: password,
    };

    let result = await userService.saveUser(clienteData);

    const formclientes = document.querySelector('#userForm');
    formclientes.reset();
    Swal.fire({
        title: 'Éxito!',
        text: 'Operación realizada con éxito.',
        icon: 'success',
        confirmButtonText: 'Cerrar'
    });
    showClientes();
}

function deleteCliente(id) {
    Swal.fire({
        title: "¿Está seguro de eliminar el Cliente?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await userService.deleteUser(id);
            showClientes();
            Swal.fire("Cliente eliminado con éxito", "", "success");
        }
    });
}

async function updateCliente(id) {
    let response = await userService.getUser(id);
    if (response) {
        const idClie = document.querySelector('#id');
        const usernameU = document.querySelector('#username');
        const emailE = document.querySelector('#email');
        const passwordP = document.querySelector('#password');

        idClie.value = response.id;
        usernameU.value = response.username;
        emailE.value = response.email;
        passwordP.value = response.password;
    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Cliente no encontrado.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const btnSaveCliente = document.querySelector('#btn-save-cliente');
    btnSaveCliente.addEventListener('click', saveCliente);
    showClientes();
});
