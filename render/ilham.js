render = {
    gesture: {}
}

render.all = function () {
    noteContent.style.transform = `translate(${note.position.x}px, ${note.position.y}px) scale(${note.position.scale})`
    for (let i = 0; i < note.elements.length; i++) {
        const element = note.elements[i]
        if (!element.deleted) {
            switch (element.type) {
                case 'text':
                    render.text(element, i)
                    break
                case 'image':
                    render.image(element, i)
                    break
            }
        } else {
            // If the element is deleted, remove it from the DOM
            render.delete(i)
        }
    }
}

render.single = function (data, i) {
    if (!data.deleted) {
        switch (data.type) {
            case 'text':
                render.text(data, i)
                break
            case 'image':
                render.image(data, i)
                break
        }
    } else {
        // If the element is deleted, remove it from the DOM
        render.delete(i)
    }
}

render.delete = function (i) {
    const element = document.getElementById('element-' + i)
    if (element) {
        element.remove()
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
    render.elementData.style.color = data.style.color
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



// gesture to move / scale
render.gesture.wheel = function (event) {
    event.preventDefault()

    if (event.ctrlKey) {
        let mousex = (event.clientX - noteContent.getBoundingClientRect().left) / note.position.scale
        let mousey = (event.clientY - noteContent.getBoundingClientRect().top) / note.position.scale
        let c = event.deltaY * 0.008 * note.position.scale

        note.position.scale -= c
        note.position.scale < 0.1 ? note.position.scale = 0.1 : undefined
        note.position.scale > 10 ? note.position.scale = 10 : undefined
        
        if (note.position.scale < 10 && note.position.scale > 0.1) {
            note.position.x += mousex * c
            note.position.y += mousey * c
        }
    } else {
        note.position.x -= event.deltaX * (note.position.scale ** 0.1 * 2)
        note.position.y -= event.deltaY * (note.position.scale ** 0.1 * 2)
    }

    render.gesture.position()
}


render.gesture.moveWithCtrl = function (event) {
    if (event.ctrlKey) {
        note.position.x -= render.gesture.oldMouseX - event.clientX
        note.position.y -= render.gesture.oldMouseY - event.clientY

        render.gesture.position()
    }
    render.gesture.oldMouseX = event.clientX
    render.gesture.oldMouseY = event.clientY
}


render.gesture.position = function () {
    window.requestAnimationFrame(() => {
        noteContent.style.transform = `translate(${note.position.x}px, ${note.position.y}px) scale(${note.position.scale})`
        app.elementSelected != -1 ? edit.selection.updatePosition(app.elementSelected) : undefined
    })
}


noteWrapper.addEventListener('mousemove', (event) => {render.gesture.moveWithCtrl(event)})
noteWrapper.addEventListener('wheel', (event) => {render.gesture.wheel(event)})

render.gesture.selectionElement = document.querySelector('#selection')
render.gesture.selectionElement.addEventListener('wheel', (event) => {render.gesture.wheel(event)})

