const fs = require('fs');
const path = require('path');
const notes = require('./db/db');
const express = require('express');
const PORT = process.env.PORT || 3002;
const app = express();

// Middleware: serve static assets:
app.use(express.static('public'));

// Functions:
function createNewNotes(body, notesArray){
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );
    return note;
}


// routing apis:
app.get('/api/notes', (req, res)=>{
    let results = notes;
    //console.log(results);
    res.json(results);
});

// routing post api:
app.post('/api/notes', (req, res)=>{
    
    // if any data in req.body is incorrect:
    const note = createNewNotes(req.body, notes);
    res.json(note);
});

// routing notes.html
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