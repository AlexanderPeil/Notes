let title = [];
let note = [];

let deletedTitles = [];
let deletedNotes = [];

load();


function render() {

    let content = document.getElementById('content');
    content.innerHTML = '';

    for (let i = 0; i < note.length; i++) {

        content.innerHTML += `
    <div class="notes">
        <b>${title[i]}</b> <br>
           ${note[i]} <br>
           <button onclick="deleteNote(${i})">Löschen</button>
    </div>    
    `;
    }

    document.getElementById('title').value = '';
    document.getElementById('note').value = '';
}


function addNote() {
    let anyTitle = document.getElementById('title').value;
    let anyNote = document.getElementById('note').value;

    title.push(anyTitle);
    note.push(anyNote);

    render();
    save();
    filterNotes();
}


function deleteNote(i) {
    deletedTitles.push(title[i]);
    deletedNotes.push(note[i]);
    title.splice(i, 1);
    note.splice(i, 1);

    render();
    save();
    filterNotes();
}


function save() {
    let titleAsText = JSON.stringify(title);
    localStorage.setItem('title', titleAsText);

    let noteAsText = JSON.stringify(note);
    localStorage.setItem('note', noteAsText);

    let deletedTitlesAsText = JSON.stringify(deletedTitles);
    localStorage.setItem('deletedTitles', deletedTitlesAsText);

    let deletedNotesAsText = JSON.stringify(deletedNotes);
    localStorage.setItem('deletedNotes', deletedNotesAsText);
}


function load() {
    let titleAsText = localStorage.getItem('title');
    let noteAsText = localStorage.getItem('note');

    let deletedTitlesAsText = localStorage.getItem('deletedTitles');
    let deletedNotesAsText = localStorage.getItem('deletedNotes');

    if (titleAsText && noteAsText || deletedTitlesAsText && deletedNotesAsText) {
        title = JSON.parse(titleAsText);
        note = JSON.parse(noteAsText);
        deletedTitles = JSON.parse(deletedTitlesAsText);
        deletedNotes = JSON.parse(deletedNotesAsText);
    }
}


function filterNotes() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();

    let content = document.getElementById('content');
    content.innerHTML = '';

    for (let i = 0; i < note.length; i++) {
        let titles = title[i];
        if (titles.toLowerCase().includes(search)) {
            content.innerHTML += `
    <div class="notes">
        <b>${title[i]}</b> <br>
           ${note[i]} <br>
           <button onclick="deleteNote(${i})">Löschen</button>
    </div>    
    `;
        }
    }
}


function addEventListener() {
    if ((e.code === "Enter" && e.metaKey) || (e.code === "Enter" && e.ctrlKey)) {
        saveNote();
    }
}


// function pushEnterToAdd() {
//     let input = document.getElementById('note');
//     input.addEventListener('keypress', function (event) {
//         if (event.key === 'Enter') {
//             input.innerHTML += addNote();
//         }
//     });
// }


function loadBin() {
    let bin = document.getElementById('bin');
    bin.innerHTML = generateBin();

    for (let i = 0; i < deletedNotes.length; i++) {
        bin.innerHTML += generateBinContent(i);
    }

    // Ganz wichtig: hier habe ich die Funktionen bin() und save() rausgenommen, da ich diese eine FUnktion unten in deleteNotes() bereits eingefügt habe.
}


function generateBin() {
    return `
    <div>
        <div>
         <button class="delete-all" onclick="deleteAll()"><b>Papierkorb leeren</b></button>
        </div>
    </div>
    `;
}


function generateBinContent(i) {
    return ` 
    <div class="notes">
        <b>${deletedTitles[i]}</b> <br>
           ${deletedNotes[i]} <br>
           <button onclick="restoreNotes(${i})" class="restore-button">Wiederherstellen</button>
           <button onclick="deleteOneFromBin(${i})">Löschen</button>
    </div>  
        `;
}


function deleteOneFromBin(i) {
    deletedTitles.splice(i, 1);
    deletedNotes.splice(i, 1);

    loadBin();
    save();
}



function restoreNotes(i) {
    title.push(deletedTitles[i]);
    note.push(deletedNotes[i]);

    deletedTitles.splice(i, 1);
    deletedNotes.splice(i, 1);

    loadBin();
    save();
}


function deleteAll(i) {
    deletedTitles.splice(i);
    deletedNotes.splice(i);

    loadBin();
    save();
}