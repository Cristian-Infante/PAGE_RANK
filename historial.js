var fs = require('fs');

var usuarios = ['160004518', '160004519']; // Lista de usuarios
var zapatos = ['Nike Air Max 90', 'Nike Air Force 1', 'Nike Dunk Low', 'Nike Air Max 270', 'Nike Cortez',
'Adidas Stan Smith', 'Adidas Superstar', 'Adidas Gazelle', 'Adidas Ultra Boost', 'Adidas Yeezy Boost 350',
'Puma Suede Classic', 'Puma Basket Classic', 'Puma RS-X', 'Puma Clyde', 'Puma Cali',
'Reebok Club C 85', 'Reebok Classic Leather', 'Reebok Aztrek', 'Reebok Workout', 'Reebok Kamikaze II',
'Jordan Retro 1', 'Jordan Retro 3', 'Jordan Retro 4', 'Jordan Retro 6', 'Jordan Retro 11',
'New Balance 574', 'New Balance 990', 'New Balance 997', 'Vans Old Skool', 'Vans Authentic',
'Converse Chuck Taylor', 'Converse One Star', 'Converse Jack Purcell'
]; // Lista de zapatos

var historiales = []; // Lista para almacenar los historiales

// Generar historiales aleatorios
for (var i = 0; i < 30; i++) {
    var usuarioIndex = Math.floor(Math.random() * usuarios.length); // Índice aleatorio para seleccionar un usuario
    var zapatoIndex = Math.floor(Math.random() * zapatos.length); // Índice aleatorio para seleccionar un zapato
    var consulta = zapatos[zapatoIndex]; // Zapato consultado
  
    // Verificar si el historial ya existe
    var existingHistorialIndex = historiales.findIndex(h => h.usuario === usuarios[usuarioIndex] && h.consulta === consulta);
  
    // Si el historial ya existe, incrementar la cantidad de veces consultadas
    if (existingHistorialIndex !== -1) {
      historiales[existingHistorialIndex].veces++;
    } else {
      // Crear nuevo historial
      var flag = Math.abs(Math.floor(Math.random() * zapatos.length-10));
      var historial = {
        usuario: usuarios[usuarioIndex],
        consulta: consulta,
        veces: flag
      };
  
      historiales.push(historial); // Agregar historial a la lista
    }
  }
  
  // Guardar historiales en archivo JSON
  fs.writeFileSync('historiales.json', JSON.stringify(historiales, null, 2));
  
  console.log('Archivo de historiales generado correctamente.');