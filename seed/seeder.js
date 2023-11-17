import { exit } from 'node:process';
import db from '../config/db.js';
import { Categoria, Precio, Usuario } from '../model/index.js';
import categorias from './categorias.js';
import precio from './precio.js';
import usuarios from './usuarios.js';
 
const importarDatos = async () => {
  try {
    // Autenticsado
    await db.authenticate();
    // Generar las columnas en la base de datos
    await db.sync();
    // Insertar en la basse de datos
    await Promise.all([
        Categoria.bulkCreate(categorias), 
        Precio.bulkCreate(precio),
        Usuario.bulkCreate(usuarios),
    ]);
    console.log('Datos importados correctamente');
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};
 
const eliminarDatos = async () => {
  try {
     await db.sync({ force: true });
 
    //  await Propiedad.truncate();
    //  await Categoria.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null);
    //  await Categoria.truncate();
    //  await Categoria.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null);
    //  await Precio.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null);
    //  await Precio.truncate();
    //  await Precio.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null);
 
    console.log('Datos eliminados correctamente');
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};
 
if (process.argv[2] === '-i') {
  importarDatos();
}
 
if (process.argv[2] === '-e') {
  eliminarDatos();
}