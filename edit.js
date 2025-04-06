edit = {vars:{},text:{}}

document.getElementById('add-text').onclick = function () {
    noteContent.onclick = edit.text.add
}

edit.text.add = function () {
    noteContent.onclick = null
    edit.vars.x1 = event.clientX
    edit.vars.y1 = event.clientY
    edit.element = document.createElement('pre')
    edit.element.id = 'add-text-preview'
    edit.element.style.left = edit.vars.x1 + 'px'
    edit.element.style.top = edit.vars.y1 + 'px'
    edit.element.contentEditable = true
    noteContent.appendChild(edit.element)
    edit.element.focus()
    edit.element.onblur = function () {
        edit.element.remove()
        if (edit.element.innerText.trim() != '') {
            note.addElement('text', edit.element.innerText, {x1: edit.vars.x1, y1: edit.vars.y1})
            render.text(note.elements[note.elements.length - 1], note.elements.length - 1)
        }
    }
}




