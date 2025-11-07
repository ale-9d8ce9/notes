
async function apiRequest(request) {
    app.encryptionKey == '' ? app.encryptionKey = null : undefined
    try {
        let url = app.backend + '?action=' + request.action
        if (app.useEncryption) {
            request = await secure.encrypt(JSON.stringify(request))
        }
        if (request.action != 'saveNote') {
            document.querySelector('body').setAttribute('loading', 'true')
        }
        response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {'Content-Type': 'text/plain'}
        })
        if (!response.ok) {
            throw new Error('response was not ok: ' + response.statusText)
        }
        response = await response.text()
        if (app.useEncryption) {
            response = await secure.decrypt(JSON.parse(response))
        }
        document.querySelector('body').setAttribute('loading', 'false')
        return JSON.parse(response)
    } catch (error) {
        console.error('Error contacting server:', error)
        alert('Error contacting server: ' + error.message)
        document.querySelector('body').setAttribute('loading', 'false')
        return null
    }
}

document.getElementById('add-account-register').onclick = async function () {
    if (await addAccount(true)) {
        alert('User added successfully, logging in...')
        getListNotes(app.user.username, app.user.password)
    }
}

document.getElementById('add-account-login').onclick = async function () {
    if (await addAccount(false)) {
        getListNotes(app.user.username, app.user.password)
    }
}

async function addAccount(register) {
    app.backend = document.getElementById('add-account-backend').value.trim()
    app.useEncryption = document.getElementById('add-account-useEncryption').checked
    if (app.useEncryption) {
        app.encryptionKey = document.getElementById('add-account-encryptionKey').value.trim()
    }
    // check server connection
    let response = await pingServer()
    if (!response) {
        return false
    }
    function saveAccount() { // save to localstorage
        app.accounts.push({
            backend: app.backend,
            username: app.user.username,
            password: app.user.password,
            useEncryption: app.useEncryption,
            encryptionKey: app.useEncryption ? app.encryptionKey : null
        })
        localStorage.setItem('accounts', JSON.stringify(app.accounts))
        updateAccountsList()
    }

    if (register) { // add user
        response = await apiRequest({
            action: 'addUser',
            username: app.user.username = document.getElementById('add-account-username').value.trim(),
            password: app.user.password = document.getElementById('add-account-password').value.trim()
        })
        if (response.result == 'success') {
            saveAccount()
            getListNotes(app.user.username, app.user.password)
            return true
        } else {
            return false
        }

    } else { // login
        response = await getListNotes(
            document.getElementById('add-account-username').value.trim(),
            document.getElementById('add-account-password').value.trim()
        )
        if (response === true) {
            saveAccount()
            return true
        } else {
            return false
        }
    }
}

document.getElementById('close-note').onclick = async function () {
    if (await saveNote(app.noteId).catch(function (error) {
        console.error('Error saving note:', error)
    })) {
        // saved successfully
        noteContent.innerHTML = ''
        edit.selection.element.classList.remove('show')
        note = null
        document.title = app.titleName
        document.querySelector('body').setAttribute('in-overlay', 'true')
        getListNotes(app.user.username, app.user.password)
    }
}
document.getElementById('save-note').onclick = function () {
    saveNote(app.noteId).catch(function (error) {
        console.error('Error saving note:', error)
        alert('Error saving note: ' + error)
    })
}



async function getListNotes(username, password) {
    notes = await apiRequest({
        action: 'getListNotes',
        username: username,
        password: password
    })
    document.title = app.titleName
    console.log('listnotes', notes)
    if (notes.result == 'success') {
        // save login data
        app.user.username = username
        app.user.password = password
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
                        <button class="noteActionButton" onclick="deleteNote(${i}); event.stopPropagation();"><img src="icons/delete.svg"></button>
                    </td>
                    <td class="dateCell">${j.dateModified}</td>
                    <td class="dateCell">${j.dateCreated}</td>
                </tr>
            `
        }
        app.noteId = notes.length
        openOverlay('listNotes')
        return true
    } else {
        // show error
        console.error('Error fetching notes:', notes.message)
        return false
    }
}


async function getFullNote(noteId) {
    app.noteId = noteId
    document.querySelector('body').style.pointerEvents = 'none'
    response = await apiRequest({
        action: 'getFullNote',
        username: app.user.username,
        password: app.user.password,
        noteId: noteId
    })
    document.querySelector('body').style.pointerEvents = 'inherit'
    if (response.result == 'success') {
        console.log('Note fetched successfully:', response.message)
        app.noteId = noteId
        response = response.message
        note = new newNote({
            name: response.name,
            isNew: false,
            position: response.position,
            elements: response.elements,
            files: response.files,
            version: response.version
        })
        document.getElementById('note-title').value = note.name
        document.title = app.titleName + ' - ' + note.name
        note.load()
        return true
    } else {
        console.error('Error fetching note:', response.message)
        alert('Error fetching note: ' + response.message)
        return false
    }
}

async function addNote() {
    try {
        await apiRequest({
            action: 'addNote',
            username: app.user.username,
            password: app.user.password,
            note: JSON.stringify(note)
        })
        await saveNote(app.noteId)
    } catch (e) {
        console.error('Error adding note:', e)
        alert('Error adding note: ' + e)

        noteContent.innerHTML = ''
        note = null
        document.querySelector('body').setAttribute('in-overlay', 'true')
        getListNotes(app.user.username, app.user.password)
        return false
    }
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


async function saveNote(noteId) {
    if (note.editable && !app.isSaving) {
        try {
            app.isSaving = true
            updateSaveIcon()
            note.version = app.buildVersion
            // prepare note
            let noteToUpload = JSON.parse(JSON.stringify(note))
            for (let i = 0; i < noteToUpload.files.length; i++) {
                file = noteToUpload.files[i];
                // if file exist
                if (file != null) {
                    if (noteToUpload.elements[i].toUpload == false){
                        // if file is not updated remove its data from upload
                        delete noteToUpload.files[i].data
                    } else if (note.elements[i].toUpload == true) {
                        // if uploading mark as uploading
                        note.elements[i].toUpload = 'uploading'
                    }
                }
            }
            noteToUpload.dateModified = (new Date()).toISOString()
            // send
            result = await apiRequest({
                action: 'saveNote',
                username: app.user.username,
                password: app.user.password,
                noteId: noteId,
                note: JSON.stringify(noteToUpload)
            })
            if (result.result !== 'success') {
                console.error('Error saving note:', result.message)
                app.isSaving = false
                updateSaveIcon()
                alert('Error saving note: ' + result.message)
                return false
            }
            app.isSaving = false
            // after saving remove toUpload tag from all files
            for (let i = 0; i < note.files.length; i++) {
                note.elements[i].toUpload == 'uploading' ? note.elements[i].toUpload = false : undefined
            }
            note.filesToDelete = []

        } catch (error) {
            console.error('Error saving note:', error)
            app.isSaving = false
            updateSaveIcon()
            alert('Error saving note: ' + error.message)
            return false
        }
    } else {
        console.log('Note is not editable or is being saved')
    }
    app.isSaving = false
    updateSaveIcon()
    return result
}
function updateSaveIcon() {
    if (app.isSaving) {
        document.getElementById('save-note').setAttribute('src', 'icons/saving.svg')
        document.getElementById('save-note').setAttribute('show', 'true')
    } else {
        document.getElementById('save-note').setAttribute('src', 'icons/save.svg')
        document.getElementById('save-note').setAttribute('show', 'false')
    }
}



async function pingServer() {
    const response = await apiRequest({
        action: 'ping'
    })
    if (response && response.result === 'success') {
        console.log('Server is reachable')
        return true
    } else {
        console.error('Server is not reachable:', response ? response.message : 'No response')
        alert('Server is not reachable. Error: ' + (response ? response.message : 'No response'))
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