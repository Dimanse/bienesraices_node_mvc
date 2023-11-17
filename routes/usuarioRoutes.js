import express from 'express';
import { formularioLogin, autenticar, cerrarSesion, formularioOlvidepassword, registrar, confirmar, formularioRegistro,resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioControler.js';

const router = express.Router();

// Routing

router.get('/login', formularioLogin);
router.post('/login', autenticar);

// Cerrar Sesión
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar);

router.get('/olvidePassword', formularioOlvidepassword);
router.post('/olvidePassword', resetPassword);

//Alamacena el nuevo password
router.get('/olvidePassword/:token', comprobarToken);
router.post('/olvidePassword/:token', nuevoPassword);









// Routing
// router.get('/', function(req, res){  // .get() se utiliza cuando un usuario visita un sitio web
//     res.send('Hola Mundo desde Express');
// });

// router.post('/', function(req, res){  //.get() solo busca explicitamente la ruta que se le indique
//     res.json( { msg: 'Respuesta de tipo Post'}); //.post() se utiliza cuando alguien rellena un formualrio
// });

// router.route('/')
//     .get((req, res)=>{  
//         res.send('Hola Mundo desde Express')
//     })
//     .post((req, res)=>{
//         res.json({ msg: 'Respuesta de tipo Post' })
//     })  


export default router;