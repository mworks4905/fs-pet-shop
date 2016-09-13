'use strict'

var fs = require('fs')
var path = require('path')
var petsPath = path.join(__dirname, 'pets.json')

var express = require('express')
var app = express()
var port = process.env.PORT || 8000

var bodyParser = require('body-parser')
var morgan = require('morgan')
// var routes = require('./routes/pets')
// app.disable('x-powered-by')
app.use(morgan('short'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function(req, res){
  res.sendStatus(404)
})

app.get('/pets', function(req, res){
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON){
    if(readErr){
      console.error(err.stack, 'err', err)
      return res.sendStatus(404)
    }
    var pets = JSON.parse(petsJSON)
    res.send(pets)
  })
})

app.get('/pets/:id', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, newPetsJSON){
    if(err){
      console.error(err.stack)
      return res.sendStatus(404)
    }
    var id = Number.parseInt(req.params.id)
    var pets = JSON.parse(newPetsJSON)
    if(id < 0 || id >= pets.length || Number.isNaN(id)){
      return res.sendStatus(404)
    }
    // res.set('Content-Type', 'text/plain');
    res.send(pets[id])
  })
})

app.post('/pets', function(req, res){
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON){
    if(readErr){
      console.error(err.stack)
      return res.sendStatus(404)
    }
    var pets = JSON.parse(petsJSON)
    var pet = req.body

    if(!pet){
      return res.sendStatus(404)
    }
    pets.push(pet)
    var newPetsJSON = JSON.stringify(pets)

    fs.writeFile(petsPath, newPetsJSON, function(writeErr){
      if(writeErr){
        console.error(writeErr.stack)
        return res.sendStatus(404)
      }
      res.send(pet)
    })
  })
})

app.put('/pets/:id', function(req, res){
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON){
    if(readErr){
      console.error(readErr.stack)
      return res.sendStatus(404)
    }
    var id = Number.parseInt(req.params.id)
    var pets = JSON.parse(petsJSON)

    if (id < 0 || id >= pets.length ||  Number.isNaN(id)) {
     return res.sendStatus(404);
   }

   var pet = req.body

   if(!pet){
     return res.sendStatus(404)
   }

   pets[id] = pet

   var newPetsJSON = JSON.stringify(pets)

   fs.writeFile(petsPath, newPetsJSON, function(writeErr){
     if(writeErr){
       console.error(writeErr.stack)
       return res.sendStatus(500)
     }

     res.send(pet)
   })
  })
})

app.delete('/pets/:id', function(req, res){
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON){
    if(readErr){
      console.error(err.stack)
      res.sendStatus(500)
    }

    var id = Number.parseInt(req.params.id)
    var pets = JSON.parse(petsJSON)

    if (id < 0 || id >= pets.length ||  Number.isNaN(id)) {
     return res.sendStatus(404);
   }

   var pet = pets.splice(id, 1)[0]
   var newPetsJSON = JSON.stringify(pets)

   fs.writeFile(petsPath, newPetsJSON, function(writeErr){
     if(writeErr){
       console.error(err.stack)
       res.sendStatus(500)
     }
     res.send(pet)
   })
  })
})

app.use(function(req, res){
  res.sendStatus(404)
})

app.listen(port, function(){
  console.log('Listening on port', port);
})
