window.onload = start
add = {vars:{},text: {}}
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

document.getElementById('add-text').onclick = function () {
    window.setTimeout(function () {
        body.onclick = add.text.start
    }, 0)
}

add.text.start = function () {
    body.onclick = null
    add.vars.x1 = event.clientX
    add.vars.y1 = event.clientY
    add.element = document.createElement('pre')
    add.element.id = 'add-text-preview'
    add.element.style.left = add.vars.x1 + 'px'
    add.element.style.top = add.vars.y1 + 'px'
    add.element.contentEditable = true
    noteContent.appendChild(add.element)
    add.element.focus()
    add.element.onblur = function () {
        add.vars.x2 = add.vars.x1 + add.element.clientWidth
        add.element.remove()
        if (add.element.innerText.trim() != '') {
            note.addElement('text', add.element.innerText, {x1: add.vars.x1, y1: add.vars.y1, x2: add.vars.x2}, {})
            renderText(note.elements[note.elements.length - 1])
        }
    }
}