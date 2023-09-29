const fs = require('fs');

function obtenerMarcasZapatosMasBuscadasPorUsuario(usuario) {
  // Leer el archivo de historiales.json
  const historiales = JSON.parse(fs.readFileSync('./historiales.json', 'utf8'));

  // Objeto para almacenar las marcas de zapatos más buscadas por el usuario
  const marcasZapatosMasBuscadas = {};

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

// Ejemplo de uso
const [marca1, marca2] = obtenerMarcasZapatosMasBuscadasPorUsuario(usuario);
console.log(`Las dos marcas de zapatos más buscadas por el usuario ${usuario} son: ${marca1} y ${marca2}`);
module.exports = obtenerMarcasZapatosMasBuscadasPorUsuario;