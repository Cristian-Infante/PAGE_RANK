// Lista de marcas y referencias de zapatos
var shoes = ['Nike Air Max 90', 'Nike Air Force 1', 'Nike Dunk Low', 'Nike Air Max 270', 'Nike Cortez',
  'Adidas Stan Smith', 'Adidas Superstar', 'Adidas Gazelle', 'Adidas Ultra Boost', 'Adidas Yeezy Boost 350',
  'Puma Suede Classic', 'Puma Basket Classic', 'Puma RS-X', 'Puma Clyde', 'Puma Cali',
  'Reebok Club C 85', 'Reebok Classic Leather', 'Reebok Aztrek', 'Reebok Workout', 'Reebok Kamikaze II',
  'Jordan Retro 1', 'Jordan Retro 3', 'Jordan Retro 4', 'Jordan Retro 6', 'Jordan Retro 11',
  'New Balance 574', 'New Balance 990', 'New Balance 997', 'Vans Old Skool', 'Vans Authentic',
  'Converse Chuck Taylor', 'Converse One Star', 'Converse Jack Purcell'
];

// Genera la matriz de adyacencia basada en la lista de marcas y referencias de zapatos
var n = shoes.length;
var adjacencyMatrix = Array(n).fill().map(() => Array(n).fill(0));
for (var i = 0; i < n; i++) {
  var brand = shoes[i].split(' ')[0];
  var brandReferences = shoes.filter(ref => ref.startsWith(brand));
  if (brandReferences.length >= 5) {
    for (var j = 0; j < n; j++) {
      if (brandReferences.includes(shoes[j])) {
        adjacencyMatrix[i][j] = 1;
      }
    }
  }
}


function pagerank(adjMatrix, historial, dampingFactor = 0.85, epsilon = 1e-8, maxIterations = 100) {
  var n = adjMatrix.length;

  adjMatrix = adjMatrix.map(row => row.reduce((sum, val) => sum + val, 0) === 0 ? Array(n).fill(1) : row);

  adjMatrix = adjMatrix.map(row => row.map(val => val / row.reduce((sum, val) => sum + val, 0)));

  var pagerankVector = Array(n).fill(1 / n);

  for (var iter = 0; iter < maxIterations; iter++) {
    var prevPagerankVector = pagerankVector.slice();
    pagerankVector = adjMatrix.map(row =>
      dampingFactor * dotProduct(row, pagerankVector) + (1 - dampingFactor) / n
    );

    // Incorporar el historial en el cálculo del PageRank
    historial.forEach(function(historia, index) {
      var nodo = historia.nodo;
      var factor = historia.factor;

      pagerankVector[nodo] += factor;
    });

    if (norm(subtractVectors(pagerankVector, prevPagerankVector)) < epsilon) {
      break;
    }
  }

  return pagerankVector;
}

function dotProduct(vector1, vector2) {
  return vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
}

function subtractVectors(vector1, vector2) {
  return vector1.map((val, i) => val - vector2[i]);
}

function norm(vector) {
  return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
}

function search(query) {
  // Genera las predicciones en función de la consulta
  const predictions = {};
  for (const shoe of shoes) {
    if (shoe.toLowerCase().includes(query.toLowerCase())) {
      const key = query.slice(0, 2).toLowerCase(); // Utiliza los primeros dos caracteres de la consulta como clave de predicción (en minúsculas)
      if (!predictions[key]) {
        predictions[key] = shoe;
      }
    }
  }

  // Si hay alguna predicción, devuelve la marca o referencia de zapato correspondiente
  if (Object.keys(predictions).length > 0) {
    return predictions[query.slice(0, 2).toLowerCase()];
  }

  // Calcula el PageRank
  const pageRank = pagerank(adjacency_matrix);

  // Obtiene el índice de la marca o referencia de zapato con el mayor PageRank
  const maxIndex = pageRank.indexOf(Math.max(...pageRank));

  return shoes[maxIndex];
}



let highlightedShoeBox = null;

function highlightShoeBox(shoeBox) {
  if (highlightedShoeBox) {
    highlightedShoeBox.classList.remove('green');
  }
  highlightedShoeBox = shoeBox;
  highlightedShoeBox.classList.add('green');
}

function handleInputChange() {
  const searchInput = document.getElementById('searchInput');
  const result = document.getElementById('result');

  const query = searchInput.value.trim();

  if (query === '') {
    result.textContent = '';
    if (highlightedShoeBox) {
      highlightedShoeBox.classList.remove('green');
      highlightedShoeBox = null;
      document.getElementById('goToResultButton').style.display = 'none';
    }
  } else {
    const searchResult = search(query);
    result.textContent = 'Resultado de la búsqueda: ' + searchResult;

    const shoeBoxes = document.getElementsByClassName('shoeBox');
    for (const shoeBox of shoeBoxes) {
      if (shoeBox.textContent === searchResult) {
        highlightShoeBox(shoeBox);
        showGoToResultButton();
        break;
      }
    }
  }
}

// Function to display shoe boxes for all shoes
function displayShoeBoxes() {
  const shoeBoxes = document.getElementById('shoeBoxes');
  shoeBoxes.innerHTML = '';

  const brandMap = new Map();
  for (const shoe of shoes) {
    const brand = shoe.split(' ')[0];
    if (!brandMap.has(brand)) {
      brandMap.set(brand, []);
    }
    brandMap.get(brand).push(shoe);
  }

  for (const [brand, shoesByBrand] of brandMap) {
    const brandTitle = document.createElement('h2');
    brandTitle.textContent = brand;

    const brandContainer = document.createElement('div');
    brandContainer.className = 'brandContainer';

    for (const shoe of shoesByBrand) {
      const shoeBox = document.createElement('div');
      shoeBox.className = 'shoeBox';

      const shoeTitle = document.createElement('p');
      shoeTitle.className = 'shoeTitle';
      shoeTitle.textContent = shoe;

      shoeBox.appendChild(shoeTitle);
      brandContainer.appendChild(shoeBox);
    }

    shoeBoxes.appendChild(brandTitle);
    shoeBoxes.appendChild(brandContainer);
  }
}

function showGoToResultButton() {
  const goToResultButton = document.getElementById('goToResultButton');
  goToResultButton.style.display = 'block';
}

function goToResult() {
  if (highlightedShoeBox) {
    const scrollToOptions = {
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    };
    highlightedShoeBox.scrollIntoView(scrollToOptions);
  }
}

var urlParams = new URLSearchParams(window.location.search);
var usuario = urlParams.get('usuario');


function obtenerMarcasZapatosMasBuscadasPorUsuario(usuario) {
  // Objeto para almacenar las marcas de zapatos más buscadas por el usuario
  const marcasZapatosMasBuscadas = {};

  // Historiales de ejemplo
  const historiales = [
    { usuario: '160004519', consulta: 'Adidas Yeezy Boost 350', veces: 3 },
    { usuario: '160004519', consulta: 'Converse Jack Purcell', veces: 7 },
    { usuario: '160004518', consulta: 'Reebok Kamikaze II', veces: 0 },
    { usuario: '160004519', consulta: 'Puma Suede Classic', veces: 4 },
    { usuario: '160004518', consulta: 'Jordan Retro 11', veces: 12 },
    { usuario: '160004518', consulta: 'Vans Authentic', veces: 13 },
    { usuario: '160004518', consulta: 'New Balance 990', veces: 4 },
    { usuario: '160004518', consulta: 'Reebok Workout', veces: 11 },
    { usuario: '160004518', consulta: 'Puma RS-XJordan Retro 3', veces: 10 },
    { usuario: '160004519', consulta: 'Adidas Gazelle', veces: 10 },
    { usuario: '160004518', consulta: 'Reebok Classic Leather', veces: 6 },
    { usuario: '160004518', consulta: 'Adidas Ultra Boost', veces: 19 },
    { usuario: '160004518', consulta: 'Converse Jack Purcell', veces: 7 },
    { usuario: '160004519', consulta: 'Nike Air Max 270', veces: 22 },
    { usuario: '160004519', consulta: 'Puma Basket Classic', veces: 20 },
    { usuario: '160004519', consulta: 'Puma RS-X', veces: 11 },
    { usuario: '160004519', consulta: 'Vans Authentic', veces: 2 },
    { usuario: '160004518', consulta: 'Jordan Retro 1', veces: 16 },
    { usuario: '160004518', consulta: 'Puma Cali', veces: 19 },
    { usuario: '160004519', consulta: 'Reebok Club C 85', veces: 7 },
    { usuario: '160004519', consulta: 'Converse One Star', veces: 22 },
    { usuario: '160004519', consulta: 'Jordan Retro 11', veces: 8 },
    { usuario: '160004518', consulta: 'Jordan Retro 4', veces: 3 },
    { usuario: '160004518', consulta: 'Nike Air Max 270', veces: 3 },
    { usuario: '160004519', consulta: 'Puma Clyde', veces: 14 }
  ];

  // Recorrer los historiales del usuario especificado
  historiales.forEach(function(historial) {
    if (historial.usuario === usuario) {
      var marca = obtenerMarcaZapato(historial.consulta);

      // Verificar si la marca ya está en la lista
      if (marcasZapatosMasBuscadas[marca]) {
        // Si la marca ya está en la lista, incrementar la cantidad
        marcasZapatosMasBuscadas[marca]++;
      } else {
        // Si la marca no está en la lista, agregarla con cantidad inicial 1
        marcasZapatosMasBuscadas[marca] = 1;
      }
    }
  });

  // Ordenar las marcas de zapatos más buscadas por cantidad descendente
  const marcasOrdenadas = Object.keys(marcasZapatosMasBuscadas).sort(function(a, b) {
    return marcasZapatosMasBuscadas[b] - marcasZapatosMasBuscadas[a];
  });

  // Obtener las dos marcas más buscadas
  const marca1 = marcasOrdenadas[0];
  const marca2 = marcasOrdenadas[1];

  return [marca1, marca2];
}

// Función auxiliar para obtener la marca de un zapato a partir de su nombre
function obtenerMarcaZapato(consulta) {
  // Aquí puedes implementar la lógica para obtener la marca a partir del nombre del zapato
  // Por simplicidad, asumiremos que la marca se encuentra al inicio del nombre del zapato antes de un espacio en blanco
  const partes = consulta.split(' ');
  return partes[0];
}


// Utilizar la variable en el nuevo archivo JavaScript
console.log('El usuario es:', usuario);

function publicidad() {
  const [marca1, marca2] = obtenerMarcasZapatosMasBuscadasPorUsuario(usuario);
  console.log(`Las dos marcas de zapatos más buscadas por el usuario ${usuario} son: ${marca1} y ${marca2}`);
  let nikeShoes = filterShoesByBrand(marca1);
  let adidasShoes = filterShoesByBrand(marca2);



  var lContainer = document.getElementById('leftContainer');
  var rContainer = document.getElementById('rightContainer');

  nikeShoes.forEach(function (shoe) {
    var box = document.createElement('div');
    box.className = 'shoeBox2';
    box.innerText = shoe;
    lContainer.appendChild(box);
  });

  adidasShoes.forEach(function (shoe) {
    var box = document.createElement('div');
    box.className = 'shoeBox2';
    box.innerText = shoe;
    rContainer.appendChild(box);
  });
}

function filterShoesByBrand(brand) {
  return shoes.filter(function (shoe) {
    return shoe.toLowerCase().includes(brand.toLowerCase());
  });
}

function gotoLogin() {
  localStorage.removeItem('usuario');
  window.location.href = './index.html';
}

// Call the function to display shoe boxes initially
displayShoeBoxes();
publicidad();


function volverArriba() {
  document.body.scrollTop = 0; // Para navegadores antiguos
  document.documentElement.scrollTop = 0; // Para navegadores modernos
}

// Muestra u oculta el botón según la posición de desplazamiento de la página
window.onscroll = function() {
  mostrarOcultarBoton();
};

function mostrarOcultarBoton() {
  var btnVolverArriba = document.getElementById("btnVolverArriba");
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    btnVolverArriba.style.display = "block";
  } else {
    btnVolverArriba.style.display = "none";
  }
}