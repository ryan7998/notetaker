const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db');
const express = require('express');
const PORT = process.env.PORT || 3002;
const app = express();

// Middleware: serve static assets:
app.use(express.static('public'));
// parse incoming string or array data:
app.use(express.urlencoded({extended:true}));
// parse incoming JSON data
app.use(express.json());


// Functions:
function createNewNotes(body, notesArray){

    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return note;
}

function deleteById(id, notesArray){
    // delete notesArray[0];

   for(let i=0; i<notesArray.length; i++){
       if(notesArray[i].id == id){
           notesArray.splice(i, 1);
       }
   }
    /* notesArray.splice(0,1);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    ); */
    return id;
}

// routing apis:
app.get('/api/notes', (req, res)=>{
    let results = notes;
    // console.log(results);
    res.json(results);
});

// routing post api:
app.post('/api/notes', (req, res)=>{
    req.body.id = uuidv4();
    // console.log(req.body);
    // if any data in req.body is incorrect:
    const note = createNewNotes(req.body, notes);
    res.json(note);
    //console.log(note);
});

// routing delete api:
app.delete('/api/notes/:id', (req, res)=>{
    const deleteNote = deleteById(req.params.id, notes);
    res.json(deleteNote);
})


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
    console.log('API server now in port 3002');
});