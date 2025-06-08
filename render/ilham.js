render = {popup: {}}

render.all = function () {
    for (let i = 0; i < note.elements.length; i++) {
        const element = note.elements[i]
        switch (element.type) {
            case 'text':
                render.text(element, i)
                break
            case 'image':
                render.image(element, i)
                break
        }
    }
}

render.text = function (data, i) {
    data = convert.toPx(data)
    render.container(i, 'pre')
    // Set the element data and values
    render.element.style.left = data.x + 'px'
    render.element.style.top = data.y + 'px'
    
    render.elementData.innerText = data.text
    note.editable ? render.elementData.contentEditable = true : undefined
    render.elementData.style.textAlign = data.style.align
    render.elementData.style.fontFamily = data.style.font
    render.elementData.style.fontSize = data.style.textSize + 'px'

    if (!render.alreadyRendered) {
        // If the element does not exist add the new element to the note
        render.element.appendChild(render.elementData)
        noteContent.appendChild(render.element)
        render.elementData.setAttribute('onblur', `
            note.elements[${i}].text = this.innerText;
            note.elements[${i}].width = this.clientWidth;
            note.elements[${i}].height = this.clientHeight;
            render.text(note.elements[${i}], ${i});
        `)
    }
}
render.image = function (data, i) {
    data = convert.toPx(data)
    render.container(i, 'img')
    // Set the element data and values
    render.element.style.left = data.x + 'px'
    render.element.style.top = data.y + 'px'
    render.element.style.width = (data.x2 - data.x1) + 'px'
    render.element.style.height = (data.y2 - data.y2) + 'px'

    render.elementData.src = note.files[i].data

    if (!render.alreadyRendered) {
        // If the element does not exist add the new element to the note
        render.element.appendChild(render.elementData)
        noteContent.appendChild(render.element)
    }
}

render.container = function (i, elementType) {
    if (document.getElementById('element-' + i)) {
        // If the element already exists set the variables to the existing element
        render.element = document.getElementById('element-' + i)
        render.elementData = document.getElementById('element-data-' + i)
        render.alreadyRendered = true
    } else {
        // If the element does not exist create a new one
        render.element = document.createElement('div')
        render.element.className = 'element'
        render.element.id = 'element-' + i

        render.elementData = document.createElement(elementType)
        render.elementData.id = 'element-data-' + i
        render.alreadyRendered = false
    }
    // click to select
    render.element.setAttribute('onmousedown', 'edit.select(' + i + ')')
}
