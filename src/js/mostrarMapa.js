(function() {
    const lat = document.querySelector('#lat').textContent;
    const lng = document.querySelector('#lng').textContent;
    const titulo = document.querySelector('#titulo').textContent;
    const calle = document.querySelector('#calle').textContent;
    const mapa = L.map('mapa').setView([lat, lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Agregsr el pin de ubicación

    L.marker([lat, lng])
        .addTo(mapa)
        .bindPopup(`${titulo} en la calle: ${calle}`)

})()