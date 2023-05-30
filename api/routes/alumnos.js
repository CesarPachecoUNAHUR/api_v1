var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", async(req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  try {
    const users = await models.alumno.findAll({
      offset,
      limit,
      attributes: ["id", "nombre", "apellido", "id_carrera", "id_materia"],
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]},
              {as:'Materia-Relacionada', model:models.materia, attributes: ["id","nombre"]}  
      ]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los usuarios.' });
  }
  

});

router.post("/", (req, res) => {
  models.alumno
    .create({ 
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      id_carrera: req.body.id_carrera,
      id_materia: req.body.id_materia     
    })
    .then(alumno => res.status(201).send({ id: alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .update(
        { nombre: req.body.nombre,
          apellido: req.body.apellido,
          id_carrera: req.body.id_carrera,
          id_materia: req.body.id_materia 
         },
        { fields: ["nombre", "apellido", "id_carrera", "id_materia"]}
      )
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = alumno =>
  alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
