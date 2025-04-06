window.onload = start
const body = document.querySelector('body')
const noteContent = document.getElementById('note-content')

function start() {
    note = new newNote('test note')
    note.load()
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


