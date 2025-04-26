async function serverRequest(request) {
    try {
        url = app.backend + '?username=' + request.username + '&password=' + request.password + '&action='
        switch (request.action) {
            case 'addNote':
                url += 'addNote' + '&noteId=' + request.noteId + '&note=' + JSON.stringify(note)
                break
            case 'saveNote':
                url += 'saveNote' + '&noteId=' + request.noteId
                break
            case 'getNote':
                url += 'getNote' + '&noteId=' + request.noteId
                break
            default:
                url += request.action
                break
        }
        let body = JSON.stringify(request.uploadFile)
        console.log(body)
        response = await fetch(url, {
            method: 'POST',
            body: body,
            headers: {'Content-Type': 'application/json'}
        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const responseText = await response.text()
        let data = JSON.parse(responseText)
        if (data.status == 'error') {
            console.error('Error from server:', data.message)
            return data.message
        } else {
            switch (request.action) {
                case 'addUser':
                    console.log('User added:', data)
                    return data.status == 'success'
                case 'getListNotes':
                    console.log('List of notes:', JSON.parse(data.message))
                    return {status:data.status, message:JSON.parse(data.message)}
                    
                default:
                    console.log(data)
                    return data
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error)
        return null 
    }
}

document.getElementById('register-button').onclick = async function () {
    if ((message = await serverRequest({
        action: 'addUser',
        username: document.getElementById('register-username').value,
        password: document.getElementById('register-password').value
    })) === true) {
        alert('User added successfully')
        document.getElementById('register-username').value = ''
        document.getElementById('register-password').value = ''
    } else {
        alert('Error adding user: ' + message)
    }
}

async function getListNotes(username, password) {
    openOverlay('listNotes')
    notes = await serverRequest({
        action: 'getListNotes',
        username: username,
        password: password
    })
    if (notes.status == 'success') {
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
            <p>${j.date}</p>
            </div>
            `
        }
    } else {
        // show error
        console.error('Error fetching notes:', notes)
    }
}

async function addNote(noteId) {
    delete note.editable
    delete note.elements
    serverRequest({
        action: 'addNote',
        username: app.user.username,
        password: app.user.password,
        noteId: noteId
    })
}


async function saveNote(noteId) {
    if (note.editable) {
        // prepare note
        note.dateModified = (new Date()).toISOString()
        note.version = app.buildVersion
        // send
        result = await serverRequest({
            action: 'saveNote',
            username: app.user.username,
            password: app.user.password,
            noteId: noteId,
            uploadFile: note
        })
    } else {
        alert('Note is not editable')
    }
    return result
}

