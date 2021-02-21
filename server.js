// used uuid for unique ids
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware: serve static assets:
app.use(express.static('public'));
// parse incoming string or array data:
app.use(express.urlencoded({extended:true}));
// parse incoming JSON data
app.use(express.json());


// Functions:

// function to update file into the json file:
function writeFile(notesArray){
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
}

// function to create new notes:
function createNewNotes(body, notesArray){

    const note = body;
    notesArray.push(note);
    writeFile(notesArray);
    return note;
}

function deleteById(id, notesArray){

   for(let i=0; i<notesArray.length; i++){
       if(notesArray[i].id == id){
           notesArray.splice(i, 1);
       }
   }
   return notesArray;
}

// routing apis:
app.get('/api/notes', (req, res)=>{
    let results = notes;
    res.json(results);
});

// routing post api:
app.post('/api/notes', (req, res)=>{
    req.body.id = uuidv4();
    const note = createNewNotes(req.body, notes);
    res.json(note);
});

// routing delete api:
app.delete('/api/notes/:id', (req, res)=>{
    const newNotesArray = deleteById(req.params.id, notes);
    writeFile(newNotesArray);
    res.json(newNotesArray);
})


// ROUTING
// routing html:
app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// routing index.html
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});



// listening in port 3002
app.listen(PORT, ()=>{
    console.log(`API server now in port ${PORT}`);
});