window.onload = start
const body = document.querySelector('body')
const noteContent = document.getElementById('note-content')
const noteWrapper = document.getElementById('note-wrapper')
client = {mouseX: 0, mouseY: 0}
convert = {}

noteContent.addEventListener('mousemove', function (event) {
    client.mouseX = event.clientX
    client.mouseY = event.clientY
})

async function start() {
    // check backend
    if (app.backend = localStorage.getItem('backend')) {
        if (await pingServer()) {
            // if backend respond try log in
            app.user.username = localStorage.getItem('username') || ''
            app.user.password = localStorage.getItem('password') || ''
            if (app.user.username != '' && app.user.password != '') {
                if (await getListNotes(app.user.username, app.user.password) == false) {
                    // if login fails
                    openOverlay('login')
                }
            } else {
                openOverlay('login')
            }
        } else {
            app.backend = ''
            openOverlay('setup')
        }
    } else {
        app.backend = ''
        openOverlay('setup')
    }
}


function createNewNote(name) {
    note = new newNote({name: name, isNew: true})
    openOverlay()
    document.querySelector('body').setAttribute('in-overlay', 'false')
    render.all()
    addNote()
}


function loadScript(path) {
    const script = document.createElement('script')
    script.src = './' + path
    script.type = 'text/javascript'
    script.id = 'script-' + path
    script.onload = function () {
        console.log('Script loaded successfully!')
    }
    document.body.appendChild(script)
}

function openOverlay(overlayName) {
    for (let i = 0; i < document.getElementsByClassName('overlay').length; i++) {
        document.getElementsByClassName('overlay')[i].removeAttribute('show')
    }
    if (overlayName) {
        document.querySelector('#'+overlayName+'.overlay').setAttribute('show', '')
    }
}


document.addEventListener('paste', function(event) {
    const items = (event.clipboardData || window.clipboardData).items
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const imageFile = items[i].getAsFile()
            imageToBase64(imageFile, function(base64String) {
                // create image
                edit.image.add(base64String)
            })
        }
    }
})

function imageToBase64(imageFile, callback) {
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onload = function () {
        callback(reader.result)
    }
    reader.onerror = function (error) {
        console.log('Error: ', error)
    }
}

getMousePosition = function (event) {
    const rect = noteContent.getBoundingClientRect()
    return {
        x: (event.clientX - rect.left) / note.position.scale,
        y: (event.clientY - rect.top) / note.position.scale
    }
}

document.getElementById('close-note').onclick = function () {
    saveNote().then(function () {
        noteContent.innerHTML = ''
        note = null
        document.querySelector('body').setAttribute('in-overlay', 'true')
        openOverlay('listNotes')
    }
    ).catch(function (error) {
        console.error('Error saving note:', error)
    })
}



convert.toPx = function (values) {
    // Convert the values to pixels based on the current zoom level
    // innerWidth is always used so it doesnt stretch and is independent from the window aspect ratio
    values = JSON.parse(JSON.stringify(values))
    
    values.x ? values.x = values.x * window.innerWidth * note.position.scale : undefined
    values.y ? values.y = values.y * window.innerWidth * note.position.scale : undefined
    values.x1 ? values.x1 = values.x1 * window.innerWidth * note.position.scale : undefined
    values.y1 ? values.y1 = values.y1 * window.innerWidth * note.position.scale : undefined
    values.x2 ? values.x2 = values.x2 * window.innerWidth * note.position.scale : undefined
    values.y2 ? values.y2 = values.y2 * window.innerWidth * note.position.scale : undefined
    values.width ? values.width = values.width * window.innerWidth * note.position.scale : undefined
    values.height ? values.height = values.height * window.innerWidth * note.position.scale : undefined
    return values
}

convert.toPoints = function (values) {
    // Convert the values to points based on the current zoom level
    // innerWidth is always used so it doesnt stretch and is independent from the window aspect ratio
    values = JSON.parse(JSON.stringify(values))
    
    values.x ? values.x = values.x / window.innerWidth / note.position.scale : undefined
    values.y ? values.y = values.y / window.innerWidth / note.position.scale : undefined
    values.x1 ? values.x1 = values.x1 / window.innerWidth / note.position.scale : undefined
    values.y1 ? values.y1 = values.y1 / window.innerWidth / note.position.scale : undefined
    values.x2 ? values.x2 = values.x2 / window.innerWidth / note.position.scale : undefined
    values.y2 ? values.y2 = values.y2 / window.innerWidth / note.position.scale : undefined
    values.width ? values.width = values.width / window.innerWidth / note.position.scale : undefined
    values.height ? values.height = values.height / window.innerWidth / note.position.scale : undefined
    return values
}



document.querySelectorAll('.overlay-x').forEach(function (element) {
    if (element.onclick) return // Prevent multiple bindings
    // Add click event listener to close the overlay
    element.onclick = function () {openOverlay()}
})
