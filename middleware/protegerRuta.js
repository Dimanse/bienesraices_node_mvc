import jwt from 'jsonwebtoken'
import { Usuario } from '../model/index.js'


const protegerRuta = async (req, res, next ) => {
   
    // console.log(req.cookies._token)

    // Verificar si hay un token
    const { _token } = req.cookies

    if(!_token){
        return res.redirect('/auth/login')
    }

    // Comprobar el token
    try {

        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        console.log(decoded)

        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        // Almacenar el usuario al request

        if(usuario){
            req.usuario = usuario
        }else{
            return res.redirect('/auth/login')
        }

        return next()
        // console.log(usuario)
        
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }

}

export default protegerRuta