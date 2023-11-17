(function() {

    
    // En google maps puedes encontrar la latitud y la longitud para ubicar en el mapa la ciudad que desees. solo ubica al momito naranja en la posoicion del mapa que gustes y en la url aparecera la latitud y la longitud
    const lat = document.querySelector('#lat').value || 9.9388885;
    const lng = document.querySelector('#lng').value || -84.1061096;
    const mapa = L.map('mapa').setView([lat, lng ], 15); // el último número (15), es con el que varias el zoom del mapa en tu aplicacion
    let marker;

    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService()
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //agregar un pin al mapa
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    // Detectar el movimiento del pin
    marker.on('moveend', function(e){
        marker = e.target
        const posicion = marker.getLatLng()
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

    // Obtener la información de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 15).run(function(error, resultado){
            console.log(resultado)
            marker.bindPopup(resultado.address.LongLabel)

            // Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? ''
            document.querySelector('#calle').value = resultado?.address?.Address ?? ''
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''
        })

    })
    

})()