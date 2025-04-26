window.onload = start
const body = document.querySelector('body')
const noteContent = document.getElementById('note-content')

function start() {
    note = new newNote('test note')
    note.load()
    openOverlay()
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
    for (let i = 0; i < document.getElementsByClassName('overlay-section').length; i++) {
        document.getElementsByClassName('overlay-section')[i].removeAttribute('show')
    }
    if (overlayName) {
        document.querySelector('#'+overlayName+'.overlay-section').setAttribute('show', '')
    }
}
