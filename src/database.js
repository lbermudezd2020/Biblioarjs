const mysql = require('mysql');
const { promisify }= require('util'); //codgio de callbaks a codigo de promesas
/*
async/await es simplificar el comportamiento del uso síncrono de promesas y 
realizar algún comportamiento específico en un grupo de Promises. 
*/

const { database } = require('./keys');//propiedada database objetos en paricular

const pool = mysql.createPool(database);//hilos que se van ejectutando y van haciendo una tarea  a la vez

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('La conexión a la base de datos fue cerrada.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('La base de datos tiene muchas conexiones.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Se rechazó la conexión a la base de datos.');
    }
  }

  if (connection) connection.release();
  console.log('Conexion exitosa');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);//cada vez que quira hacer una consulta utilizo promesas

module.exports = pool;
