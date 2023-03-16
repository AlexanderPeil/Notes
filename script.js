let title = [];
let note = [];

let deletedTitles = [];
let deletedNotes = [];

load();


/**
 * It's a body onload function. First the old content is deleted, then the function renderContent is executed with the param content.
 */
function init() {
    let content = document.getElementById('content');
    content.innerHTML = '';

    renderContent(content);

    document.getElementById('title').value = '';
    document.getElementById('note').value = '';
}


/**
 * This function renders a list of notes.
 * @param {HTMLElement} content - The container which contains the content of all written notes. 
 */
function renderContent(content) {
    for (let i = 0; i < note.length; i++) {

        content.innerHTML += `
    <div class="notes">
        <b><h3>${title[i]}</h3></b> <br>
        <span contenteditable="true">${note[i]}</span> <br>
           <button onclick="deleteNote(${i})">Löschen</button>
    </div>    
    `;
    }
}


/**
 * Add a new note to an array of notes and call other functions to initialize, save and filter notes. 
 */
function addNote() {
    let anyTitle = document.getElementById('title').value;
    let anyNote = document.getElementById('note').value;

    title.push(anyTitle);
    note.push(anyNote);

    init();
    save();
    filterNotes();
}


/**
 * Delete a note from the array of notes by the splice method and push them into the arays deleted (bin.html). 
 * Re-initialize saved notes and call the fucntion save. Furthermore filterNotes function is called too. 
 * @param {for-loop} i - Fetches the right note from the array notes which has to be deleted. 
 */
function deleteNote(i) {
    deletedTitles.push(title[i]);
    deletedNotes.push(note[i]);
    title.splice(i, 1);
    note.splice(i, 1);

    init();
    save();
    filterNotes();
}


/**
 * save the notes to the local storage. 
 */
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


/**
 * Load the notes from the local storage.
 */
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


/**
 * A function to filter the notes based on a search term entered by the user.
 * toLowerCase is used to write all chars small and find filtered notes anyway.
 */
function filterNotes() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();

    let content = document.getElementById('content');
    content.innerHTML = '';

    renderFilteredNotes(search, content);
}


/**
 * Render the filtered notes. 
 * @param {value} search - Value from the input field of filterNotes function.
 * @param {HTMLElement} content - This content contains all written notes. 
 */
function renderFilteredNotes(search, content) {
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


/**
 * This function is adds an eventListener. If the user press 'Enter' the note is saved (so call teh saveNote function).
 */
function addEventListener() {
    if ((e.code === "Enter" && e.metaKey) || (e.code === "Enter" && e.ctrlKey)) {
        saveNote();
    }
}


/**
 * Load the bin which contains all deleted notes.
 */
function loadBin() {
    let bin = document.getElementById('bin');
    bin.innerHTML = generateBin();

    for (let i = 0; i < deletedNotes.length; i++) {
        bin.innerHTML += generateBinContent(i);
    }
}


/**
 * This function renders the bin page.
 * @returns bin menu.
 */
function generateBin() {
    return `
    <div>
        <div>
         <button class="delete-all" onclick="deleteAll()"><b>Papierkorb leeren</b></button>
        </div>
    </div>
    `;
}


/**
 * Render function to render the content with deleted notes.
 * @param {for-loop} i - To show the right notes from the arrays deleted. 
 * @returns HTML Content with deleted notes.
 */
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


/**
 * This function allows to delete one note from the bin by Using the splice method.
 * @param {for-loop} i - To delete the right content from the arrays deleted.
 */
function deleteOneFromBin(i) {
    deletedTitles.splice(i, 1);
    deletedNotes.splice(i, 1);

    loadBin();
    save();
}


/**
 * This function restores single notes from bin to save content.
 * @param {for-loop} i - To restore the right notes from array deleted to array notes.  
 */
function restoreNotes(i) {
    title.push(deletedTitles[i]);
    note.push(deletedNotes[i]);

    deletedTitles.splice(i, 1);
    deletedNotes.splice(i, 1);

    loadBin();
    save();
}


/**
 * This function empty the whole bin content. 
 * @param {for-loop} i - To delete the right notes from bin. 
 */
function deleteAll(i) {
    deletedTitles.splice(i);
    deletedNotes.splice(i);

    loadBin();
    save();
}