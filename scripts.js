window.onload = start
const body = document.querySelector('body')
const noteContent = document.getElementById('note-content')
const noteWrapper = document.getElementById('note-wrapper')
convert = {}

async function start() {
    if (window.location.search.includes('embed=macos')) {
        document.getElementById('sidebar').style.opacity = 0
        document.getElementById('sidebar').style.pointerEvents = 'none'
        document.getElementById('sidebar').style.scale = 0
    }
    settings.start()
    audio.start()
    // load accounts
    app.accounts = JSON.parse(localStorage.getItem('accounts')) || []
    localStorage.getItem('defaultAccount') ? app.defaultAccount = parseInt(localStorage.getItem('defaultAccount')) : app.defaultAccount = null
    accounts.updateList()
    app.defaultAccount != null ? accounts.load(app.defaultAccount) : openOverlay('accounts')

    // import encryption key (if exists)
    if (app.useEncryption && app.encryptionKey != null) {
        if (app.encryptionKey.length != 32) {
            app.encryptionKey = null
            app.useEncryption = false
            console.error('Error importing encryption key')
        } else {
            try {
                app.encryptionKey = await secure.importKey(app.encryptionKey)
                console.log('Encryption key imported successfully')
            } catch (e) {
                console.error('Error importing encryption key:', e)
                alert('Error importing encryption key:', e)
                app.encryptionKey = null
                app.useEncryption = false
            }
        }
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
                edit.add.image(base64String)
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
        console.error('Error: ', error)
    }
}

async function arrayBufferToBase64 (buffer) {
    const blob = new Blob([buffer])
    const reader = new FileReader()
    return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(blob)
    })
}

async function base64ToArraybuffer (base64String) {
    const blob = await fetch(`data:application/octet-stream;base64,${base64String}`).then(res => res.blob())
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
        reader.readAsArrayBuffer(blob)
    })
}





getMousePosition = function (event) {
    // Get the mouse position relative to the note content
    return {
        x: (event.clientX - note.position.x),
        y: (event.clientY - note.position.y)
    }
}


function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}


convert.toPx = function (values) {
    // Convert the values to pixels based on the current zoom level
    // innerWidth is always used so it doesnt stretch and is independent from the window aspect ratio
    values = JSON.parse(JSON.stringify(values))
    
    values.x ? values.x = values.x * app.initialWindowInnerWidth : undefined
    values.y ? values.y = values.y * app.initialWindowInnerWidth : undefined
    values.x1 ? values.x1 = values.x1 * app.initialWindowInnerWidth : undefined
    values.y1 ? values.y1 = values.y1 * app.initialWindowInnerWidth : undefined
    values.x2 ? values.x2 = values.x2 * app.initialWindowInnerWidth : undefined
    values.y2 ? values.y2 = values.y2 * app.initialWindowInnerWidth : undefined
    values.width ? values.width = values.width * app.initialWindowInnerWidth : undefined
    values.height ? values.height = values.height * app.initialWindowInnerWidth : undefined
    return values
}

convert.toPoints = function (values) {
    // Convert the values to points based on the current zoom level
    // innerWidth is always used so it doesnt stretch and is independent from the window aspect ratio
    values = JSON.parse(JSON.stringify(values))
    
    values.x ? values.x = values.x / app.initialWindowInnerWidth / note.position.scale : undefined
    values.y ? values.y = values.y / app.initialWindowInnerWidth / note.position.scale : undefined
    values.x1 ? values.x1 = values.x1 / app.initialWindowInnerWidth / note.position.scale : undefined
    values.y1 ? values.y1 = values.y1 / app.initialWindowInnerWidth / note.position.scale : undefined
    values.x2 ? values.x2 = values.x2 / app.initialWindowInnerWidth / note.position.scale : undefined
    values.y2 ? values.y2 = values.y2 / app.initialWindowInnerWidth / note.position.scale : undefined
    values.width ? values.width = values.width / app.initialWindowInnerWidth / note.position.scale : undefined
    values.height ? values.height = values.height / app.initialWindowInnerWidth / note.position.scale : undefined
    return values
}

document.querySelectorAll('.overlay-x').forEach(function (element) {
    if (element.onclick) return // Prevent multiple bindings
    // Add click event listener to close the overlay
    element.onclick = function () {openOverlay()}
})

// change fullscreen icon in statusbar
document.addEventListener("fullscreenchange", (event) => {
  document.getElementById('fullscreen-button').setAttribute('src', `icons/${document.fullscreenElement ? 'exit-fullscreen' : 'fullscreen'}.svg`)
})