document.addEventListener('DOMContentLoaded', () => {
    const inputBuscar = document.getElementById('inputBuscar');
    const btnBuscar = document.getElementById('btnBuscar');
    const contenedor = document.getElementById('contenedor');

    // El evento para el botón de la búsqueda

    btnBuscar.addEventListener('click', () => {
        const query = inputBuscar.value.trim();
        if (!query) {
            alert('Por favor, ingresa un término de búsqueda.');
            return;
        }

        
        contenedor.innerHTML = '';

        // fetch para realizar la solicitud a la API

        fetch(`https://images-api.nasa.gov/search?q=${query}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud a la API');
                }
                return response.json();
            })
            .then((data) => {
                mostrarResultados(data);
            })
            .catch((error) => {
                console.error(error);
                alert('Ocurrió un error al realizar la búsqueda. Por favor, inténtalo de nuevo.');
            });
    });

    /**
     * Esto muestra los resultados en forma de tarjeta.
     * @param {Object} data
     */
    function mostrarResultados(data) {
        const items = data.collection?.items;

        if (!items || items.length === 0) {
            contenedor.innerHTML = '<p class="text-center">No se encontraron resultados.</p>';
            return;
        }

        const row = document.createElement('div');
        row.className = 'row row-cols-1 row-cols-md-3 g-4';

        items.forEach((item) => {
            const { title, description, date_created } = item.data[0];
            const imageUrl = item.links?.[0]?.href || 'https://via.placeholder.com/150';


            const cardCol = document.createElement('div');
            cardCol.className = 'col';

            cardCol.innerHTML = `
        <div class="card h-100">
          <img src="${imageUrl}" class="card-img-top" alt="${title || 'Imagen sin título'}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${title || 'Sin título'}</h5>
            <p class="card-text" style="max-height: 100px; overflow-y: auto;">${description || 'Sin descripción disponible.'}</p>
            <div class="mt-auto">
              <small class="text-muted">Fecha: ${new Date(date_created).toLocaleDateString() || 'Desconocida'}</small>
            </div>
          </div>
        </div>
      `;

            row.appendChild(cardCol);
        });

        contenedor.appendChild(row);
    }
});
