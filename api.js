async function apiRequest(request) {
    try {
        let url = app.backend + '?action=' + request.action
        response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {'Content-Type': 'text/plain'}
        })
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText)
        }
        response = await response.text()
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
        alert('User added successfully, logging in...')
        document.getElementById('register-username').value = ''
        document.getElementById('register-password').value = ''
        getListNotes(message.message.username, message.message.password)
    } else {
        alert('Error adding user: ' + message.message)
    }
}

document.getElementById('login-button').onclick = async function () {
    let username = document.getElementById('login-username').value.trim()
    let password = document.getElementById('login-password').value.trim()
    if (username === '' || password === '') {
        alert('Username and password cannot be empty')
        return
    }
    // get list of notes
    if (!await getListNotes(username, password)) {
        openOverlay('login')
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
        localStorage.setItem('username', username)
        app.user.password = password
        localStorage.setItem('password', password)
        // parse notes
        notes = notes.message
        document.getElementById('notes-list').innerHTML = `
            <tr>
                <th>Name</th>
                <th></th>
                <th>Date Modified</th>
                <th>Date Created</th>
            </tr>`
        for (let i = 0; i < notes.length; i++) {
            const j = notes[i];

            j.date = (new Date(j.dateModified))
            j.dateModified = `<div class="dateDate">${j.date.toLocaleDateString()}</div><div class="dateTime">${j.date.toLocaleTimeString()}</div>`
            j.date = (new Date(j.dateCreated))
            j.dateCreated = `<div class="dateDate">${j.date.toLocaleDateString()}</div><div class="dateTime">${j.date.toLocaleTimeString()}</div>`


            document.getElementById('notes-list').innerHTML += `
                <tr class="listNoteElement" onclick="getFullNote(${i})">
                <td class="noteTitle">${j.name}</td>
                <td class="noteActions">
                    <button class="noteActionButton" onclick="deleteNote(${i}); event.stopPropagation();">Delete</button>
                </td>
                <td class="dateCell">${j.dateModified}</td>
                <td class="dateCell">${j.dateCreated}</td>
                </tr>
            `
        }
        return true
    } else {
        // show error
        console.error('Error fetching notes:', notes.message)
        return false
    }
}


async function getFullNote(noteId) {
    response = await apiRequest({
        action: 'getFullNote',
        username: app.user.username,
        password: app.user.password,
        noteId: noteId
    })
    if (response.result == 'success') {
        console.log('Note fetched successfully:', response.message)
        response = response.message
        note = new newNote(response.name, false, response.elements, response.files)
        note.version = response.version
        note.editable = true
        note.load()
        return true
    } else {
        console.error('Error fetching note:', note.message)
        return false
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


async function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        response = await apiRequest({
            action: 'deleteNote',
            username: app.user.username,
            password: app.user.password,
            noteId: noteId
        })
        if (response.result == 'success') {
            console.log('Note deleted successfully')
            getListNotes(app.user.username, app.user.password)
        } else {
            console.error('Error deleting note:', response.message)
            alert('Error deleting note: ' + response.message)
        }
    }
}


async function saveNote() {
    if (note.editable && !app.isSaving) {
        app.isSaving = true
        note.version = app.buildVersion
        // prepare note
        let noteToUpload = JSON.parse(JSON.stringify(note))
        for (let i = 0; i < noteToUpload.files.length; i++) {
            file = noteToUpload.files[i];
            // if file exist
            if (file != null) {
                if (file.updated == false && file.deleted != true) {
                    // if file is not updated "remove" file from upload
                    noteToUpload.files[i] = null
                } else if (file.deleted == true) {
                    // if file is deleted remove its data from upload
                    delete noteToUpload.files[i].data
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
        if (result.result !== 'success') {
            alert('Error saving note: ' + result.message)
            return false
        }

        // after response
        let filesToDelete = []
        for (let i = 0; i < note.files.length; i++) {
            // remove updated flag from files
            if (note.files[i] != null) {
                note.files[i].updated = false
            }
            // schedule deletion of files / elements
            if ((note.files[i] != null && note.files[i].deleted) || note.elements[i].deleted) {
                filesToDelete.push(i)
            }
        }

        // delete files / elements
        for (let i = filesToDelete.length - 1; i >= 0; i--) {
            const j = filesToDelete[i];
            note.files.splice(j, 1)
            note.elements.splice(j, 1)
        }

        // if any files were deleted refresh the note
        if (filesToDelete.length > 0) {
            render.all()
        }
        delete filesToDelete
        app.isSaving = false

    } else {
        console.log('Note is not editable or is being saved')
    }
    return result
}

function decrypt(i) {
    return atob(i)
}

function encrypt(i) {
    return btoa(i)
}

async function pingServer(callback, errorCallback) {
    const response = await apiRequest({
        action: 'ping'
    })
    if (response && response.result === 'success') {
        console.log('Server is reachable')
        if (callback) callback()
        return true
    } else {
        console.error('Server is not reachable:', response ? response.message : 'No response')
        alert('Server is not reachable. Error: ' + (response ? response.message : 'No response'))
        if (errorCallback) errorCallback()
        return false
    }
}

function deleteLocalStorage() {
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            localStorage.removeItem(key)
        }
    }
}