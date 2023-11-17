import bcrypt from 'bcrypt'


const usuarios = [
    {
    nombre: 'Dimanse',
    email: 'dimanse@correo.com',
    password: bcrypt.hashSync('123456', 10),
    confirmado: 1,
    }
]

export default usuarios