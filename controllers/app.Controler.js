
import { Sequelize } from 'sequelize';

import {Precio, Categoria, Propiedad} from '../model/index.js'
import { propiedades } from './apiControler.js';


const inicio = async (req, res) =>{

    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3, 
            where: {
                categoriaId: 1,
            },
            include: [
               {
                model: Precio,
                as: 'precio'
               },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3, 
            where: {
                categoriaId: 2,
            },
            include: [
               {
                model: Precio,
                as: 'precio'
               },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        
    ])

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken(),
        
    })
};

const categoria = async (req, res) =>{
    const {id} = req.params;
    // console.log(id)

    // Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id);
    if(!categoria){
        return res.redirect('/404')
    }

    // Obtener las propiedades de la categoria

    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })
    

    res.render('categoria', {
        pagina: 'Categoria',
        titulo: `${categoria.nombre}s en venta:`,
        propiedades,
        csrfToken: req.csrfToken(),
    })
};

const noEncontrado = (req, res) =>{
    res.render('404', {
        pagina: 'No encontrado',
        csrfToken: req.csrfToken(),
    })
};

const buscador = async (req, res) =>{
    const { termino } = req.body

    if(!termino.trim()){
        res.redirect('back')
    }

    // Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like]: '%' + termino + '%'
            }
        },
        include:[
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('busqueda', {
        pagina: 'Resultado de la Busqueda',
        propiedades,
        csrfToken: req.csrfToken(),
    })
};

export {
    inicio,
    categoria,
    noEncontrado,
    buscador,
}