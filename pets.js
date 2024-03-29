'use strict'

var fs = require('fs')
var path = require('path')
var petsPath = path.join(__dirname, 'pets.json')

var node = path.basename(process.argv[0])
var file = path.basename(process.argv[1])
var cmd = process.argv[2]


if(cmd === 'read'){
  fs.readFile(petsPath, 'utf8', function(readErr, data){
    if(readErr){
      throw readErr
    }
    var pets = JSON.parse(data)
    var index = process.argv[3]

    if(index >= pets.length || index < 0){
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`)
      process.exit(1)
    }
    if(index){
      console.log(pets[index])
    }
    else{
      console.log(pets);
    }
  })
}

else if(cmd === 'create'){
  fs.readFile(petsPath, 'utf8', function(readErr, data){
    if(readErr){
      throw readErr
    }

    var pets = JSON.parse(data)
    var age = Number(process.argv[3])
    var kind = process.argv[4]
    var name = process.argv[5]
    var pet = {
      'age': age,
      'kind': kind,
      'name': name
      }

    if(!name){
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1)
    }

    pets.push(pet)

    var petsJSON = JSON.stringify(pets)

    fs.writeFile(petsPath, petsJSON, function(writeErr){
      if(writeErr){
        throw writeErr
      }
      console.log(pet);
    })
  })
}

else{
  console.error(`Usage: ${node} ${file} ${cmd} [read | create | update | destroy]`)
  process.exit(1)
}
