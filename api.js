async function apiRequest(request) {
    try {
        let url = app.backend + '?action=' + request.action
        response = await (await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {'Content-Type': 'text/plain'}
        })).text()
        console.log(JSON.parse(response))
        return JSON.parse(response)
    } catch (error) {
        console.error('Error fetching data:', error)
        return null 
    }
}

document.getElementById('register-button').onclick = async function () {
    if ((message = await apiRequest({
        action: 'addUser',
        username: document.getElementById('register-username').value.trim(),
        password: document.getElementById('register-password').value.trim()
    })).result === 'success') {
        alert('User added successfully')
        document.getElementById('register-username').value = ''
        document.getElementById('register-password').value = ''
    } else {
        alert('Error adding user: ' + message.message)
    }
}

async function getListNotes(username, password) {
    openOverlay('listNotes')
    notes = await apiRequest({
        action: 'getListNotes',
        username: username,
        password: password
    })
    console.log(notes)
    if (notes.result == 'success') {
        // save login data
        app.user.username = username
        app.user.password = password
        // parse notes
        notes = notes.message
        for (let i = 0; i < notes.length; i++) {
            const j = notes[i];
            document.getElementById('notes-list').innerHTML += `
            <div class="listNoteElement">
            <div class="noteTitle">${j.name}</div>
            <p>${j.dateModified}</p>
            </div>
            `
        }
    } else {
        // show error
        console.error('Error fetching notes:', notes.message)
    }
}

async function addNote() {
    apiRequest({
        action: 'addNote',
        username: app.user.username,
        password: app.user.password,
        note: JSON.stringify(note)
    })
}


async function saveNote() {
    if (note.editable) {
        note.version = app.buildVersion
        // prepare note
        let noteToUpload = JSON.parse(JSON.stringify(note))
        for (let i = 0; i < noteToUpload.files.length; i++) {
            file = noteToUpload.files[i];
            // if file exist
            if (file != null) {
                // if file is not updated
                if (file.updated == false) {
                    // "remove" file from upload
                    noteToUpload.files[i] = null
                } else {
                    // if file is updated it isnt gonna be anymore
                    note.files[i].updated = false
                }
            }
        }
        noteToUpload.dateModified = (new Date()).toISOString()
        // send
        result = await apiRequest({
            action: 'saveNote',
            username: app.user.username,
            password: app.user.password,
            noteId: 0,
            note: JSON.stringify(noteToUpload)
        })
    } else {
        alert('Note is not editable')
    }
    return result
}

