import { Dropzone } from 'dropzone'


const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')



Dropzone.options.imagen = {
    dictDefaultMessage: 'Arrastra las imagenes aqui para subirlas',
    aceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false, // Sube la imagen automaticamente si le ponemos un true
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar imagen',
    dictMaxFilesExceeded: 'El limite es 1 arcvhivo', 
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this;
        const btnPublicar = document.querySelector('#publicar');
        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue()
        })
        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = 'mis-propiedades'
            }
        })
    }

}