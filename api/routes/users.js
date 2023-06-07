
var express = require('express');
var router = express.Router();
var models = require('../models');

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
var User = models.user;


dotenv.config();

//Se llamará a este método router.get cada vez que se reciba una solicitud get
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Estoy aca");
  //res.send('responder con un recurso');
}); 

//Este método seleccionará la entrada de los datos de publicación y creará un usuario
// Uso de bcrypt como nuestro mecanismo de hash de contraseña
router.post('/',async(req, res, next) => {
  //res.status(201).json(req.body);
  //Agregar nueva usuario y devolver 201(Creado)
  console.log("Esto es OIsttttt");
  const salt = await bcrypt.genSalt(10);
  var usr = {
    ussername : req.body.ussername,
    password : await bcrypt.hash(req.body.password, +salt)
  };
  created_user = await User.create(usr);
  res.status(201).json(created_user);   
  
});


//La función de inicio de sesión esperará el nombre de usuario y la contraseña del usuario.
//En la coincidencia de contraseña exitosa, devolverá un token JWT.
router.post('/login',async(req,res,next)=>{
 const user = await User.findOne({ where : {ussername : req.body.ussername }});
 if(user){
    const password_valid = await bcrypt.compare(req.body.password,user.password);
    if(password_valid){
        token = jwt.sign({ "id" : user.id,"ussername":user.ussername },process.env.SECRET);
        res.status(200).json({ token : token });
    } else {
      res.status(400).json({ error : "Password Incorrecta" });
    }
  
  }else{
    res.status(404).json({ error : "Usuario no existe" });
  }
  
});


router.get('/me',
 async(req,res,next)=>{
  try {
    let token = req.headers['authorization'].split(" ")[1];
    let decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch(err){
    res.status(401).json({"msg":"No se pudo autenticar"});
  }
  },
  async(req,res,next)=>{
    let user = await User.findOne({where:{id : req.user.id},attributes:{exclude:["password"]}});
    if(user === null){
      res.status(404).json({'msg':"User not found"});
    }
    res.status(200).json(user);
}); 

module.exports = router;

