
(function(){
    const lat = 9.9388885;
    const lng = -84.1061096;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15); // el último número (15), es con el que varias 

    let markers = new L.featureGroup().addTo(mapa)

    let propiedades = [];

    // Filtros
    const filtros = {
        categoria: '',
        precio: '',
    }

    const categoriaSelect = document.querySelector('#categorias');
    const precioSelect = document.querySelector('#precios');


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


    // Filtrado por precios y categorias

    categoriaSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value
        // console.log(+e.target.value)
        filtrarPropiedades()
    })
    precioSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value
        // console.log(+e.target.value)
        filtrarPropiedades()
    })

    const obtenerPropiedades = async () => {
        try {
            const url = "/api/propiedades"
            const respuesta = await fetch(url)
            propiedades = await respuesta.json() 

            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {
        propiedades.forEach( propiedad => {
            // Agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true,
            })
                .addTo(mapa)
                .bindPopup(`
                <div class="space-y-3>
                    <p class="text-center font-bold text-gray-800"> Categoria: <span class=" font-extrabold text-indigo-600"> ${propiedad.categoria.nombre} </span> </p>
                    <h1 class=" text-center text-xl font-extrabold my-3 uppercase">${propiedad?.titulo}</h1>
                    <img src="/uploads/${propiedad?.imagen}" alt="imagen de la propiedad: ${propiedad?.titulo}">
                    <p class="text-center font-bold text-gray-800"> Precio: <span class=" font-extrabold text-indigo-600"> ${propiedad.precio.nombre} </span> </p>
                    <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 p-2 font-bold hover:bg-indigo-700 uppercase text-center block"> Ver Propiedad </a>
                </div>
                    
                `)

                markers.addLayer(marker)
            
        })
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategorias).filter(filtrarPrecios)
        console.log(resultado)
    }

    const filtrarCategorias = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad

    const filtrarPrecios = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad
    

    

    obtenerPropiedades()
    

})()