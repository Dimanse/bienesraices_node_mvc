import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import Usuario from '../model/Usuario.js';
import { generarJWT, generarId } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
};

const autenticar = async (req, res) => {
    // console.log('autenticando')

    // Validación
    await check('email').isEmail().withMessage('Debe añadir un email valido').run(req); // comprueba que el campo email sea un email valido
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        // si el arreglo de resultado no esta vacio te renderiza a la página de crear cuenta
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        });
    };

    const {email, password} = req.body
    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({where: {email}})
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: `El email: ${email} no pertenece a ningún usuario registrado`}],
        });
    }

    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: `${usuario.nombre}, tu cuenta aun no ha sido confirmada`}],
        });
    }

    //Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: `${usuario.nombre}, el password es incorrecto`}],
        });
    }

    // Autenticar al usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre})
    console.log(token)

    // Almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true
    }).redirect('/mis-propiedades')
}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req, res) => {
    

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken(),
    })
};

const registrar = async (req, res) => {
    // Validación
    await check('nombre').notEmpty().withMessage('Debe añadir un nombre para registrarse').run(req); // comprueba que el campo nombre no este vacio
    await check('email').isEmail().withMessage('Debe añadir un email valido').run(req); // comprueba que el campo email sea un email valido
    await check('password').isLength({min: 6}).withMessage('Debes añadir un password con al menos 6 caracteres').run(req);
    await check('repite_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req);


    let resultado = validationResult(req);
    // console.log(resultado)
    // return res.json(resultado.array())
    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        // si el arreglo de resultado no esta vacio te renderiza a la página de crear cuenta
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,

            }
        });
    };

    // Extraer los datos
    const { nombre, email, password } = req.body
 
    // Verificar que el usuario no este duplicado
    const existeUsuario = await  Usuario.findOne({ where : { email }})
    if(existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: `${nombre} ya esta Registrado`}], 
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })

       
    }

    
    // Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),

    })

    // Envia mail de confirmación

    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

     // Mostrar mensaje de confirmación
     res.render('templates/mensaje',{
        pagina: 'Cuenta Creada Correctamente',
        mensaje: `${nombre}, te hemos enviado un email de confirmación. Haz click en el enlace`
    

    })

}

// Funcion que comprueba una cuenta

const confirmar = async (req, res) => {
    const { token } = req.params

    //Verificar si el token es valido
        const usuario = await Usuario.findOne({where: {token}})
        
        if(!usuario){
            return res.render ('auth/confirmar-cuenta', {
                pagina: 'Error al confirmar tu cuenta',
                mensaje: 'Hubo un error al confirmar tu cuenta. Intentalo de nuevo.',
                error: true
            })
        }

    //Confirmar la cuenta
        usuario.token = null;
        usuario.confirmado = true;
        await usuario.save();
        const {nombre} = usuario;
        
        res.render ('auth/confirmar-cuenta', {
            pagina: 'Cuenta Confirmada',
            mensaje: `Enhorabuena ${nombre}, tu cuanta ha sido confirmada`,
            
        })
    
}



const formularioOlvidepassword = (req, res) => {
    res.render('auth/olvidePassword', {
        pagina: 'Recupera tu acceso a BienesRaices',
        csrfToken: req.csrfToken(),
        
    })
};

const resetPassword = async(req, res) => {
    
        // Validación
       
        await check('email').isEmail().withMessage('Debe añadir un email valido').run(req); // comprueba que el campo email sea un email valido
    
        let resultado = validationResult(req);
        // console.log(resultado)
        
        // return res.json(resultado.array())
        // Verificar que el resultado este vacio
    
        if(!resultado.isEmpty()){
            // si el arreglo de resultado no esta vacio te renderiza a la página de crear cuenta
            return res.render('auth/olvidePassword', {
                pagina: 'Recupera tu acceso a BienesRaices',
                csrfToken: req.csrfToken(),
                errores: resultado.array(),
            });
        };

        //Buscar el usuario

        const { email } = req.body;

        const usuario = await Usuario.findOne({where: { email }})
        if(!usuario){
            return res.render('auth/olvidePassword', {
                pagina: 'Recupera tu acceso a BienesRaices',
                csrfToken: req.csrfToken(),
                errores: [{msg: `El email: ${email} no esta registrado en nuestra base de datos`}], 
                
            })
        }

    // Generar un token y enviar el email
    usuario.token = generarId();
    await usuario.save();
    
    
    // Enviar un email
    emailOlvidePassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    // Renderizar un mensaje
    res.render('templates/mensaje',{
        pagina: 'Reestablece tu password',
        mensaje: `${usuario.nombre}, te hemos enviado un email con las instrucciones para cambiar tu password`
    

    })
}

const comprobarToken = async (req, res) => {
    //  console.log(req.params)

    const { token } = req.params
    //Verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}})
    // console.log(usuario)

    if(!usuario){
        return res.render ('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu password',
            mensaje: 'Hubo un error al validar tu Password. Intentalo de nuevo.',
            error: true
        })
    }

     // Mostrar formulario para modificar el password
     res.render('auth/reset-password', {
        pagina: 'Reestablece tu password',
        csrfToken: req.csrfToken()
    })


        
}

const nuevoPassword = async (req, res) => {
    // console.log('Guardando password')
    // Validar el password

    await check('password').isLength({min: 6}).withMessage('Debes añadir un password con al menos 6 caracteres').run(req);

    let resultado = validationResult(req);
    // console.log(resultado)
    // return res.json(resultado.array())
    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        // si el arreglo de resultado no esta vacio te renderiza a la página de crear cuenta
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            
        });
    };

    const {token} = req.params;
    const {password} = req.body;
    // Identificar que usuario hace el cambio
    const usuario = await Usuario.findOne({where: {token}})
    // console.log(usuario)

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: `${usuario.nombre}, tu password se guardo correctamente`

    })


    
    
}

export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidepassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}