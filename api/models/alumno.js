'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define('alumno', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {});
  alumno.associate = function(models) {
    // associations can be defined here
    alumno.belongsTo(models.carrera// modelo al que pertenece
    ,{
      as : 'Carrera-Relacionada',  // nombre de mi relacion
      foreignKey: 'id_carrera'     // campo con el que voy a igualar
    }),
    alumno.belongsTo(models.materia,
      {
      as : 'Materia-Relacionada',  // nombre de mi relacion
      foreignKey: 'id_materia'     // campo con el que voy a igualar
    })  
    
  }
  
  return alumno;
};