const express = require('express')
const cors = require('cors');
const dotenv = require('dotenv');
const router = express.Router();

const path = __dirname + '/views/';

const app = express()

router.use(function (req,res,next){
  console.log('/' + req.method);
  next();
})

router.get('/', function (req,res){
  res.sendFile(path + 'index-03.html');
})
app.use(express.static('views'));

app.use('/',router);

const port = 8083;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});