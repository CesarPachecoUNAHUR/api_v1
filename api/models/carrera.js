'use strict';
module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define('carrera', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING   
  }, {});
  
  return carrera;
};
