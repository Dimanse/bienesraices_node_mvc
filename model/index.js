import Propiedad from './Propiedad.js'
import Usuario from './Usuario.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Mensaje from './Mensaje.js'

Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'})
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'})
Propiedad.hasMany(Mensaje, {foreignkey: 'propiedadId'})


Mensaje.belongsTo(Propiedad, {foreignkey: 'propiedadId'})
Mensaje.belongsTo(Usuario, {foreignkey: 'usuarioId'})




export{
    Propiedad,
    Usuario,
    Precio,
    Categoria,
    Mensaje,
}