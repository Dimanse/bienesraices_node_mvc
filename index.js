import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import db from './config/db.js';



//crear la app

const app = express();

// Habilitar lectura de datos de formularios
app.use( express.urlencoded({extended: true}) )

// Habilitar cookie-parser

app.use(cookieParser())

// Habilitar CSRF
app.use(csrf({cookie: true}))

// conexión a la base de datos

const conectarDb = async ()=>{
     try {
        await db.authenticate();
        db.sync();
        console.log('Conexión correcta a la base de datos')
    } catch (error) {
        console.log(error, 'error al conectarse con la base de datos');
    }
} 
conectarDb()

//Habilitar pug
app.set('view engine', 'pug');  // decimos que vamos a usar pug
app.set('views', './views'); // le decimos que va estar en la carpeta ./views

// Carpeta Pública (archivos estáticos)

app.use(express.static('public'));

// Routing
app.use('/', appRoutes);  
app.use('/auth', usuarioRoutes);  //.use() busca todas las rutas que comiencen con una diagonal.
app.use('/', propiedadesRoutes); 
app.use('/api', apiRoutes) 



const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log( `El servidor esta funcionando en el puerto: ${port}` );
});