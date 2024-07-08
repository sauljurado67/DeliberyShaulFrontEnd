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

//---------------- Registrarse------------------
const form = document.getElementById('form');
const usuario = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', e=> {
    e.preventDefault();
    checkImputs();
});

function checkImputs(){
    const usuarioValue = usuario.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if(usuarioValue === '' || usuarioValue.length < 4){
        setErrorFor(usuario, 'No dejar en blanco o menos de 4 letras.');
    }else{
        setSuccessFor(usuario);
    };

    if(emailValue === ''){
        setErrorFor(email, 'No puede dejar un email en blanco.');
    }else if(!isEmail(emailValue)){
        setErrorFor(email, 'No ingreso un email válido.');
    }else {
        setSuccessFor(email);
    }
    if(passwordValue === '' || passwordValue.length < 4){
        setErrorFor(password, 'No dejar en blanco o menos de 4 caract.');
    }else{
        setSuccessFor(password);
    };
    if(password2Value === ''){
        setErrorFor(password2, 'No puede dejar el password en blanco.');
    }else if(passwordValue !== password2Value){
        setErrorFor(password2, 'Passwords no coinciden.');
    }else{
        setSuccessFor(password2);
        guardar(usuarioValue,emailValue,passwordValue);
    };
};

function setErrorFor(input, message){
    const formControl = input.parentElement;
    const small= formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
};

function setSuccessFor(input){
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
};

function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        
}

async function guardar(usuarioValue, emailValue, passwordValue) {

    const clienteData = {
        username: usuarioValue,
        email: emailValue,
        password: passwordValue,
    };
    console.log(clienteData);
    let result = null;

    
    result = await fetchData(`${BASEURL}`, 'POST', clienteData);
    

    const formRegis = document.querySelector('#form');
    formRegis.reset();

    window.location.href = '../page/Login.html'
};

