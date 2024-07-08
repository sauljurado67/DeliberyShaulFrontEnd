const URL = 'http://localhost:8080/api/users';

function loguearse(callback) {
    let form = document.getElementById('form-login');
    form.email.value = '';
    form.password.value = '';

    function complete(value, valu) {
        document.onkeydown = null;
        callback(value, valu);
    }

    form.onsubmit = function () {
        let value = form.email.value;
        let valu = form.password.value;
        if (value == ''){
            alert('Complete el campo email');
        }
        if (valu == ''){
            alert('Complete el campo Password');
        }
        if (value == '' || valu == '') return false; // ignorar submit vacíos
        complete(value, valu);
        return false;
    };

    document.onkeydown = function (e) {
        if (e.key == 'Escape') {
            complete(null, null);
        }
    };

    let lastElem = form.elements[form.elements.length - 1];
    let firstElem = form.elements[0];

    lastElem.onkeydown = function (e) {
        if (e.key == 'Tab' && !e.shiftKey) {
            firstElem.focus();
            return false;
        }
    };

    firstElem.onkeydown = function (e) {
        if (e.key == 'Tab' && e.shiftKey) {
            lastElem.focus();
            return false;
        }
    };
}

function sarasa(value, valu) {
    if (value == null && valu == null) {
        alert('No se modificó nada');
    } else {
        log(value, valu, function(userFound) {
            if (userFound) {
                alert('Bienvenido');
                window.location.href = '../index.html';
            } else {
                alert('Ingrese la Contraseña correcta');
            }
        });
    }
}

function log(email, password, callback) {
    
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let userFound = false;
            data.forEach(item => {
                if (item.email === email){
                    
                    if (item.password == password) {
                        userFound = true
                        localStorage.setItem('user', item.username);
                        document.getElementById('log').innerText = item.username;
                        callback(true);
                    } else {
                        alert('Password incorrecto')
                    }
                } 
            })
            callback(userFound);
        })
        .catch(error => {
            alert('Error fetching users:', error);
            callback(false);
        });
}

if (document.getElementById('log').textContent === 'Login') {
    loguearse(function (value, valu) {
        sarasa(value, valu);
    });
} else {
    alert('Cerrando sesión');
    document.getElementById('log').innerText = 'Login';
}

/*---------------------------------- */

