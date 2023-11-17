import {unlink} from 'node:fs/promises';
import { validationResult } from 'express-validator';
import { promiseHooks } from 'node:v8';



import { Precio, Categoria, Propiedad, Usuario, Mensaje } from '../model/index.js' ;
import usuarios from '../seed/usuarios.js';
import { esVendedor, formatearFecha, } from '../helpers/index.js'


const admin = async(req, res) => {

    // Leer Querystring
    const { pagina: paginaActual } = req.query

    const expresion = /^[0-9]$/;
    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1')
    }


    //  console.log(usuarios[0].nombre)
    try {
        // console.log(req.usuario.nombre)
    const { nombre, id } = req.usuario;

    // Limites y offsets para el paginador
    const limit = 5;
    const offset = ((paginaActual * limit) - limit)

    const [propiedades, total] = await Promise.all([
        await Propiedad.findAll({
            limit,
            offset,
            where: {
                usuarioId: id
            },
            include: [
                {model: Categoria, as: 'categoria'},
                { model: Precio, as: 'precio' },
                { model: Mensaje, as: 'mensajes' },
            ],
        }),
        Propiedad.count({
            where: {
                usuarioId: id
            },
        })
    ])

    
    res.render('propiedades/admin', {
        pagina: `${nombre}, bienvenid@ a tus Propiedades`,
        propiedades,
        csrfToken: req.csrfToken(),
        paginas: Math.ceil(total / limit),
        paginaActual: Number(paginaActual),
        total,
        limit,
        offset,
       
    })
    } catch (error) {
        console.log(error)
    }
    
}

// Formulario para crear una nueva propiedad
const crear = async(req, res) => {
    // console.log(usuarios[0].nombre)
    // Consultar modelo de precio y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    const { nombre } = req.usuario;
    return res.render('propiedades/crear', {
        pagina: `${nombre}, crea tu anuncio`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async(req, res) => {
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        res.render('propiedades/crear', {
            pagina: `${req.body.nombre}, crea tu anuncio`,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
            
            
        })
        
    }

    //Crear un registro
    // console.log(req.body)


    const{ titulo, descripcion, categoria: categoriaId, precio: precioId, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body

    const { id: usuarioId } = req.usuario


    // console.log(req.usuario.id)

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo, 
            descripcion, 
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng,
            precioId, 
            categoriaId,
            usuarioId,
            imagen: '' 
        })
        // console.log(propiedadGuardada)
        const { id } = propiedadGuardada
        return res.redirect(`/propiedades/agregar-imagen/${id}`)
        
    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (req, res) => {
    // console.log('Agregando imagen')

    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
     if(!propiedad){
        return res.redirect('/mis-propiedades')
     }

    // Validar que la propiedad no este publicada
     if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
     }

    // Validar que la propiedad pertenece a quien visita esta página
    // console.log(req.usuario)

    // console.log(propiedad.usuarioId.toString())

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }
    const { nombre } = req.usuario;
    const { titulo } = propiedad
    res.render('propiedades/agregar-imagen', {
        pagina: `${nombre}, agrega una imagen al anuncio de: ${titulo}`,
        csrfToken: req.csrfToken(),
        propiedad,
            
    })
}

const almacenarImagen = async (req, res, next) => {
    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
     if(!propiedad){
        return res.redirect('/mis-propiedades')
     }

    // Validar que la propiedad no este publicada
     if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
     }

    // Validar que la propiedad pertenece a quien visita esta página

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    try {
        // console.log(req.file)
        //Almacenar imagen y publicar propiedad
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;

        await propiedad.save();
        next();
        
    } catch (error) {
        console.log(error)
    }
}

const editar = async (req, res) => {
    // console.log('Editando')
    const {id} = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('mis-propiedades');
    }

    // Revisar que quien visita la url es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('mis-propiedades');
    }

    // Consultar modelo de precio y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    const { nombre } = req.usuario;
    const {titulo } = propiedad;
    return res.render('propiedades/editar', {
        pagina: `${nombre}, edita tu propiedad: ${titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req, res) => {
    // console.log('Guardando cambios')

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

    const { nombre } = req.usuario;
  
    return res.render('propiedades/editar', {
        pagina: `${nombre}, edita tu propiedad`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        errores: resultado.array(),
        datos: req.body
    })
            
            
        }
        
    

    const {id} = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('mis-propiedades');
    }

    // Revisar que quien visita la url es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('mis-propiedades');
    }

    // Reescribir el objeto y actualizarlo

    try {
        const{ titulo, descripcion, categoria: categoriaId, precio: precioId, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body

        propiedad.set({
            titulo,
            descripcion,
            categoriaId,
            precioId,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng
        })
        await propiedad.save();

        res.redirect('/mis-propiedades')
        
    } catch (error) {
        console.log(error)
    }
}

const eliminar = async (req, res) =>{
    // console.log('Eliminando anuncio')

    const {id} = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }

    // Revisar que quien visita la url es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades');
    }

    // Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`);
    // console.log(`Se eliminó la imagen: ${propiedad.imagen} de la propiedad: ${propiedad.titulo}`)
    //eliminar la propiedad

    await propiedad.destroy();

    res.redirect('/mis-propiedades')
}

// Modifica el estado de una propiedad
const cambiarEstado = async (req,res) => {
    const {id}=req.params
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/404')
    };

    // Validar que la propiedad pertenece a quien visita esta página
    
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    // Actualizar
    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

    res.json({
        resultado: true
    })

}

// Mostrar una propiedad

const mostrarPropiedad = async(req, res) => {

    const {id} = req.params;
    console.log(id)

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model : Precio, as: 'precio'},
            {model : Categoria, as: 'categoria'},
            
            
        ]
    });

    if(!propiedad || !propiedad.publicado){
        return res.redirect('/404');
    }


   

   
    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
    })
}

const enviarMensaje = async (req, res) => {
    // console.log('enviando mensaje')
    const {id} = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model : Precio, as: 'precio'},
            {model : Categoria, as: 'categoria'},
            
        ]
    });
    console.log(propiedad)

    if(!propiedad){
        return res.redirect('/404');
    }
    
    // Renderizar los errores

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        
        return res.render('propiedades/mostrar', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array(),
        })
        
    }

    // Almacenar el mensaje
    // console.log(req.body)
    // console.log(req.params)
    // console.log(req.usuario)

    const {mensaje} = req.body;
    const {id: propiedadeId} = req.params;
    const {id: usuarioId} = req.usuario;
    console.log(propiedadeId)
    
    await Mensaje.create({
        mensaje,
        propiedadeId,
        usuarioId,
    })
    res.redirect('/')
}

// Leer mensajes recibidos
const verMensajes = async (req, res) => {
 
    
    
    const {id}=req.params
    const propiedad = await Propiedad.findByPk(id,  {
        include: [
            {model : Mensaje, as: 'mensajes', 
                include: [
                    {model : Usuario.scope('eliminarPassword'), as: 'usuario'},
                ]
            },   
               
        ]
    });

    console.log(propiedad.mensajes.length)

    if(!propiedad){
        return res.redirect('/404')
    };

    // Validar que la propiedad pertenece a quien visita esta página
    
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        titulo:`Tienes ${propiedad.mensajes.length} mensajes sin leer`,
        mensajes: propiedad.mensajes,
        formatearFecha,
    })
 
}


export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes,
   
}