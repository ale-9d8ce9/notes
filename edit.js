edit = {vars:{},text:{}}

document.getElementById('add-text').onclick = function () {
    noteContent.onclick = edit.text.add
}

edit.text.add = function () {
    noteContent.onclick = null
    edit.vars.x1 = event.clientX
    edit.vars.y1 = event.clientY
    note.addElement('text', '', {x1: edit.vars.x1, y1: edit.vars.y1})
    render.text(note.elements[note.elements.length - 1], note.elements.length - 1)
    document.getElementById('element-data-' + (note.elements.length - 1)).focus()
}




