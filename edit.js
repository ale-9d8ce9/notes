edit = {
    vars:{},
    text:{},
    image:{},
    move:{},
    selection:{popup:{}}
}
edit.selection.element = document.getElementById('selection')


//edit.selection.element.onmousedown = function () {edit.move.start(event)}

edit.selection.element.setAttribute('ondoubleclick', `function () {
    let i = app.elementSelected
    if (note.elements[i].type === 'text') {
        document.getElementById('element-data-' + i).focus()
    }
    console.log('Double clicked on element', i)
}`)

document.getElementById('add-text').onclick = function () {
    noteWrapper.onclick = function (event) {
        console.log('t')
        edit.text.add(event)
    }
}

edit.text.add = function (event) {
    noteWrapper.onclick = null
    edit.vars.x1 = getMousePosition(event).x
    edit.vars.y1 = getMousePosition(event).y
    note.addElement('text', '', convert.toPoints({x1: edit.vars.x1, y1: edit.vars.y1}))
    render.text(note.elements[note.elements.length - 1], note.elements.length - 1)
    document.getElementById('element-data-' + (note.elements.length - 1)).focus()
}

edit.image.add = function (base64String) {
    note.addElement('image', base64String, convert.toPoints({x1: 0, y1: 0, x2: 100, y2: 100}))
    render.image(note.elements[note.elements.length - 1], note.elements.length - 1)
}


edit.select = function (i) {
    for (let i = 0; i < document.getElementsByClassName('element').length; i++) {
        document.getElementsByClassName('element')[i].classList.remove('selected')
    }
    if (i != -1) {
        document.getElementById('element-' + i).classList.add('selected')
        edit.selection.popup.create(i)
        edit.selection.element.classList.add('show')
    }
    edit.selection.updatePosition(i)
    app.elementSelected = i
}
edit.selection.updatePosition = function (i) {
    if (i != -1) {
        let pos = document.getElementById('element-' + i).getBoundingClientRect()
        edit.selection.element.style.left = pos.left + 'px'
        edit.selection.element.style.top = pos.top + 'px'
        edit.selection.element.style.width = pos.width + 'px'
        edit.selection.element.style.height = pos.height + 'px'
        edit.selection.element.style.display = 'inherit'
    } else {
        edit.selection.element.style.display = 'none'
    }
}

edit.move.start = function (event) {
    edit.move.mouseStartX = event.clientX
    edit.move.mouseStartY = event.clientY
    edit.move.elementStartX = note.elements[app.elementSelected].x
    edit.move.elementStartY = note.elements[app.elementSelected].y
    document.getElementsByClassName('element')[app.elementSelected].classList.add('no-transition')
    body.onmousemove = function () {edit.move.move(event)}
    body.onmouseup = edit.move.stop
}
edit.move.move = function (event) {
    let i = app.elementSelected
    //note.elements[i].x = convert.toPoints({x: event.clientX}).x
    //note.elements[i].y = convert.toPoints({y: event.clientY}).y
    note.elements[i].x = event.clientX * edit.move.elementStartX / edit.move.mouseStartX
    note.elements[i].y = event.clientY * edit.move.elementStartY / edit.move.mouseStartY
    render.all()
    console.log(note.elements[i].x, note.elements[i].y)

}
edit.move.stop = function () {
    document.getElementsByClassName('element')[app.elementSelected].classList.remove('no-transition')
    body.onmousemove = function () {}
    body.onmouseup = function () {}
}


edit.selection.popup.create = function (i) {
    edit.selection.element = document.getElementById('selection')
    let popupHTML = edit.selection.popup.newSection({type: 'delete', onrun: `note.removeElement(${i})`}, i)

    switch (note.elements[i].type) {
        case 'text':
             popupHTML += edit.selection.popup.newSection({
                type: 'slider',
                name: 'textSize',
                min: 8,
                max: 50,
                value: note.elements[i].style.textSize,
                onrun: `note.elements[${i}].style.textSize = this.value`
            }, i)
            popupHTML += edit.selection.popup.newSection({
                type: 'radio',
                name: 'align',
                values: ['left', 'center', 'right', 'justify'],
                checked: note.elements[i].style.textAlign,
                onrun: `note.elements[${i}].style.textAlign = this.value`
            }, i)
            popupHTML += edit.selection.popup.newSection({
                type: 'radio',
                name: 'font',
                values: ['Arial', 'Courier', 'Georgia', 'Times New Roman', 'Verdana'],
                checked: note.elements[i].style.font,
                onrun: `note.elements[${i}].style.font = this.value`
            }, i)
            popupHTML += edit.selection.popup.newSection({
                type: 'color',
                value: note.elements[i].style.color,
                onrun: `note.elements[${i}].style.color = this.value`
            }, i)
            break
    
        default:
            edit.selection.element.innerHTML = ''
            break
    }
    edit.selection.element.innerHTML = '<div id="selection-popup">' + popupHTML + '</div>'
}


edit.selection.popup.newSection = function (args, i) {
    // this function creates a new section in the popup
    if (!args || !args.type || !args.onrun) {
        console.error('Invalid arguments for newSection:', args)
        return ''
    }

    let getRenderFunction = function (i) {
        return `render.${note.elements[i].type}(note.elements[${i}], ${i})`
    }

    let string = ''
    switch (args.type) {
        case 'delete':
            string = `<button onclick="${args.onrun.toString()}">Delete</button>`
            break

        case 'slider':
            string = `<input type="range" min="${args.min}" max="${args.max}" value="${args.value}" oninput="${args.onrun.toString()};${getRenderFunction(i)}">`
            break

        case 'color':
            string = `<input type="color" value="${args.value}" onchange="${args.onrun.toString()};${getRenderFunction(i)}">`
            break

        case 'radio':
            for (let j = 0; j < args.values.length; j++) {
                string += `<input type="radio" name="edit-element-${i}-${args.name}" value="${args.values[j]}" onchange="${args.onrun.toString()};${getRenderFunction(i)}" checked="${args.checked == args.values[j]}">`
            }
            break

        default:
            console.error('Unknown section type:', args.type)
    }
    return `
        <div class="popup-section">
            ${string}
        </div>`
}






