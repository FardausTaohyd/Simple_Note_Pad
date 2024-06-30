document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-note');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const notesList = document.getElementById('notes');
    const searchBar = document.getElementById('search-bar');
    const downloadButton = document.getElementById('download-notes');
    const uploadInput = document.getElementById('upload-notes');

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.classList.add('note-card');
            li.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <small>${note.date}</small>
                <button onclick="deleteNote(${index})">Delete</button>
            `;
            notesList.appendChild(li);
        });
    }

    function saveNote() {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        const date = new Date().toLocaleString(); // Get current date and time
        if (title && content) {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.push({ title, content, date }); // Include date in note object
            localStorage.setItem('notes', JSON.stringify(notes));
            noteTitle.value = '';
            noteContent.value = '';
            loadNotes();
        }
    }

    function deleteNote(index) {
        const notes = JSON.parse(localStorage.getItem('notes'));
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }

    function filterNotes() {
        const filter = searchBar.value.toLowerCase();
        const notes = document.querySelectorAll('.note-card');
        notes.forEach(note => {
            const title = note.querySelector('h3').textContent.toLowerCase();
            if (title.includes(filter)) {
                note.style.display = '';
            } else {
                note.style.display = 'none';
            }
        });
    }

    function downloadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function uploadNotes(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newNotes = JSON.parse(e.target.result);
                const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
                const combinedNotes = existingNotes.concat(newNotes);
                localStorage.setItem('notes', JSON.stringify(combinedNotes));
                loadNotes();
            };
            reader.readAsText(file);
        }
    }

    saveButton.addEventListener('click', saveNote);
    searchBar.addEventListener('input', filterNotes);
    downloadButton.addEventListener('click', downloadNotes);
    uploadInput.addEventListener('change', uploadNotes);
    loadNotes();
});

// Expose deleteNote to global scope
window.deleteNote = function(index) {
    const notes = JSON.parse(localStorage.getItem('notes'));
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
};

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notes');
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.classList.add('note-card');
        li.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>${note.date}</small>
            <button onclick="deleteNote(${index})">Delete</button>
        `;
        notesList.appendChild(li);
    });
}
