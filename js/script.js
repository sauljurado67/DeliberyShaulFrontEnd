//------------------ Creamos contenido del menu ----------------------
/* ----------------------- API para el menu --------------------------*/


filterObjects('comida');

function filterObjects(comida){
    var API_KEY = '44122995-98073ae0106560ae12cd28208';
    var searchQuery = comida; // Cambia esta variable según lo que quieras buscar
    var maxResults = 5; // Número máximo de resultados

    var URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}&per_page=${maxResults}`;

    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const resultsContainer = document.getElementById('detalle'); // Asegúrate de tener un contenedor en tu HTML con este ID
            resultsContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevos resultados

            if (parseInt(data.totalHits) > 0) {
                data.hits.slice(0, maxResults).forEach(hit => { // Limitar los resultados a maxResults
                    // Crear un elemento div para insertar la card
                    const div = document.createElement("div");
                    const facefront = document.createElement("div");
                    const faceback = document.createElement("div");

                    // Agrego estilos y atributos
                    div.classList.add("card", "show");
                    div.id = `menu${hit.id}`;

                    facefront.classList.add("face", "front");
                    faceback.classList.add("face", "back");

                    facefront.innerHTML = `<img src="${hit.webformatURL}" />
                                        <h3>${hit.tags}</h3>`;
                    faceback.innerHTML = `<h2>${hit.tags}</h2>
                                        <span>By ${hit.user}</span>
                                        <a class="link" href="${hit.pageURL}" target="_blank">Ver en Pixabay</a>`;

                    // Añadir las faces al div de la card
                    div.append(facefront, faceback);

                    // Añadir la card al contenedor de resultados
                    resultsContainer.appendChild(div);
                });
            } else {
                resultsContainer.innerHTML = 'No hits';
            }
            console.log(data); // Esto imprime todo el objeto de datos devuelto por la API
        })
        .catch(error => {
            console.error('Request failed:', error);
        });
    }

// -------------  codigo de filtrado de nuestro menu --------------------


filterObjects("all");

function filterObjects(c){
    var x, f;
    x = document.getElementsByClassName("card");
    if (c == "all") c = "";
    for (f = 0; f < x.length; f++){
        removeClass(x[f], "show");
        if (x[f].className.indexOf(c) > -1) addClass(x[f], "show");
    }
    
}

function addClass(element, name){
    var f, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (f = 0; f < arr2.length; f++){
        if (arr1.indexOf(arr2[f]) == -1){
            element.className += " " + arr2[f];
        }
    }
}

function removeClass(element, name){
    var f, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (f = 0; f < arr2.length; f++){
        while (arr1.indexOf(arr2[f]) > -1){
            arr1.splice(arr1.indexOf(arr2[f]), 1);
        }
    }
    element.className = arr1.join(" ");
}

/* -------- Validacion Login cambio login por usuario -------------- */

let nom = localStorage.getItem('user', '');
if (nom == null || nom == ''){
    document.getElementById('log').innerText = 'Login'
} else {
    document.getElementById('log').innerText = nom;
    document.getElementById('log2').innerText = nom;
    document.getElementById('log3').innerText = nom;
    document.getElementById('log').style.backgroundColor = "#a152eb";
}

document.addEventListener('click', () =>{
    let usua = nom;
    if (document.getElementById('log').innerText !== usua){
        const keysToRemove = ['user'];
        keysToRemove.forEach(key => localStorage.removeItem(key));
    } else {
        document.getElementById('log').innerText = nom;
        document.getElementById('log').style.backgroundColor = "#a152eb";
    }
})


