console.log('Inicio de script.js - mi-casita1');
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado');
  const busqueda = document.getElementById('busqueda');
  const resultados = document.getElementById('resultados');
  if (!busqueda || !resultados) {
    console.error('Error: Elementos busqueda o resultados no encontrados');
    resultados.innerHTML = '<p>Error: No se encontraron los elementos de búsqueda.</p>';
    return;
  }
  console.log('Elementos busqueda y resultados encontrados');
  fetch('./data_muestra.json')
    .then(response => {
      console.log('Cargando data_muestra.json, status:', response.status, 'URL:', response.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Datos cargados (primeras 10 entradas):', data.slice(0, 10));
      console.log('Total de entradas:', data.length);
      if (!Array.isArray(data)) {
        throw new Error('data_muestra.json no es un array');
      }
      if (data.length === 0) {
        throw new Error('data_muestra.json está vacío');
      }
      busqueda.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        console.log('Búsqueda iniciada para:', query);
        resultados.innerHTML = '';
        if (!query) {
          resultados.innerHTML = '<p>Ingresa una palabra para buscar...</p>';
          return;
        }
        const filtered = data.filter(entry => {
          if (!entry.lema || typeof entry.lema !== 'string') {
            console.warn('Entrada inválida ignorada:', entry);
            return false;
          }
          return entry.lema.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query);
        });
        console.log('Entradas filtradas:', filtered.length, 'Ejemplo:', filtered.slice(0, 2));
        if (filtered.length === 0) {
          resultados.innerHTML = '<p>No se encontraron resultados para "' + query + '".</p>';
          return;
        }
        filtered.forEach(entry => {
          const div = document.createElement('article');
          div.innerHTML = [
            '<h2>' + (entry.lema || 'Sin lema') + '</h2>',
            '<p>' + (entry.definicion || 'Sin definición') + '</p>',
            entry.notas && entry.notas.length ? '<p class="nota">' + entry.notas.join('; ') + '</p>' : '',
            entry.enlaces && entry.enlaces.length ? '<p>Ver: ' + entry.enlaces.map(function(e) { return '<a href="#' + e + '">' + e + '</a>'; }).join(', ') + '</p>' : ''
          ].join('');
          resultados.appendChild(div);
        });
      });
    })
    .catch(function(err) {
      console.error('Error al cargar data_muestra.json: ', err);
      resultados.innerHTML = '<p>Error al cargar los datos: ' + err.message + '. Verifica que data_muestra.json esté en la raíz del repositorio.</p>';
    });
});
console.log('Fin de script.js - mi-casita1');
