import express from 'express';
import { body } from 'express-validator';
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar,  cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes} from '../controllers/propiedadControler.js'
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';
import identificarUsuario from '../middleware/identificarUsuario.js';

const router = express.Router();

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('Debe añadir un titulo a su anuncio'),
    body('descripcion')
        .notEmpty().withMessage('Una buena descripcción hace que el anuncio sea más atractivo')
        .isLength({max: 200}).withMessage('Esa descripcion es demasiado grande'),
    body('categoria').isNumeric().withMessage('Selecciona una categoría'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona un número de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona el número de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
    )

    router.get('/propiedades/agregar-imagen/:id',
    protegerRuta, 
    agregarImagen)

    router.post('/propiedades/agregar-imagen/:id',
        protegerRuta, 
        upload.single('imagen'),
        almacenarImagen,
    )

    router.get('/propiedades/editar/:id',
        protegerRuta,
        editar
    )

    router.post('/propiedades/editar/:id', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('Debe añadir un titulo a su anuncio'),
    body('descripcion')
        .notEmpty().withMessage('Una buena descripcción hace que el anuncio sea más atractivo')
        .isLength({max: 200}).withMessage('Esa descripcion es demasiado grande'),
    body('categoria').isNumeric().withMessage('Selecciona una categoría'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona un número de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona el número de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarCambios
    )

    router.post('/propiedades/eliminar/:id', 
        protegerRuta,
        eliminar
    )

    router.put('/:id',
        protegerRuta,
        cambiarEstado
    )

    // Area Pública

    router.get('/propiedad/:id', 
    identificarUsuario,
    mostrarPropiedad,
    )

    // Almacenar mensajes

    router.post('/propiedad/:id', 
    identificarUsuario,
    body('mensaje').isLength({min:20}).withMessage('El contenido del mensaje debe ser un poco más largo'),
    enviarMensaje,
    )

    router.get('/mensajes/:id', 
        protegerRuta,
        verMensajes,
    )

export default router