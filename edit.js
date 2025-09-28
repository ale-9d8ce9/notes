edit = {
    vars:{},
    move:{},
    add:{},
    selection:{popup:{}}
}
edit.selection.element = document.getElementById('selection')


edit.selection.element.onmousedown = function () {edit.move.start(event)}


document.getElementById('add-text').onclick = function () {
    noteWrapper.onclick = function (event) {
        edit.add.text(event)
    }
}

edit.add.text = function (event) {
    noteWrapper.onclick = null
    edit.vars.x1 = getMousePosition(event).x
    edit.vars.y1 = getMousePosition(event).y
    note.addElement('text', '', convert.toPoints({x1: edit.vars.x1, y1: edit.vars.y1}))
    document.getElementById('element-data-' + (note.elements.length - 1)).focus()
}

edit.add.image = function (base64String) {
    let img = new Image()
    img.src = base64String
    img.onload = function() {
        note.addElement('image', base64String, {x: 0, y: 0, width: img.naturalWidth/app.initialWindowInnerWidth, height: img.naturalHeight/app.initialWindowInnerWidth})
    }
}


edit.select = function (i) {
    for (let i = 0; i < document.getElementsByClassName('element').length; i++) {
        document.getElementsByClassName('element')[i].classList.remove('selected')
    }
    if (i != -1) {
        document.getElementById('element-' + i).classList.add('selected')
        edit.selection.popup.create(i)
        edit.selection.element.classList.add('show')
    } else {
        edit.selection.element.classList.remove('show')
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
        edit.selection.element.classList.add('show')
    } else {
        edit.selection.element.classList.remove('show')
    }
}

edit.move.start = function (event) {
    edit.move.mouseStartX = event.clientX
    edit.move.mouseStartY = event.clientY
    edit.move.elementStartX = note.elements[app.elementSelected].x
    edit.move.elementStartY = note.elements[app.elementSelected].y
    document.getElementsByClassName('element')[app.elementSelected].classList.add('no-transition')
    noteContent.classList.remove('selectable')
    body.onmousemove = function () {edit.move.move(window.event)}
    body.onmouseup = function() {edit.move.stop()}
}
edit.move.move = function (event) {
    let i = app.elementSelected
    note.elements[i].x = convert.toPoints(getMousePosition(event)).x
    note.elements[i].y = convert.toPoints(getMousePosition(event)).y
    window.requestAnimationFrame(() => {
        render.single(note.elements[app.elementSelected], app.elementSelected)
        edit.selection.updatePosition(app.elementSelected)
    })
}
edit.move.stop = function () {
    document.getElementsByClassName('element')[app.elementSelected].classList.remove('no-transition')
    noteContent.classList.add('selectable')
    body.onmousemove = function () {}
    body.onmouseup = function () {}
}


edit.selection.popup.create = function (i) {
    edit.selection.element = document.getElementById('selection')
    let popupHTML = edit.selection.popup.newSection({type: 'delete', onrun: `note.removeElement(${i})`, icon: 'delete'}, i)

    switch (note.elements[i].type) {
        case 'text':
            popupHTML += edit.selection.popup.newSection({
                icon: 'rotate',
                type: 'slider',
                name: 'rotation',
                min: -180,
                step: 15,
                max: 180,
                value: note.elements[i].style.rotation,
                onrun: `note.elements[${i}].style.rotation = parseFloat(this.value)`
            }, i)
            popupHTML += edit.selection.popup.newSection({
                icon: 'fontSize',
                type: 'slider',
                name: 'textSize',
                min: 1,
                max: 150,
                value: note.elements[i].style.textSize,
                onrun: `note.elements[${i}].style.textSize = parseFloat(this.value)`
            }, i)
            popupHTML += edit.selection.popup.newSection({
                icon: 'align/' + note.elements[i].style.align,
                icons: ['align/left', 'align/center', 'align/right', 'align/justify'],
                type: 'radio',
                name: 'align',
                values: ['left', 'center', 'right', 'justify'],
                checked: note.elements[i].style.align,
                onrun: `note.elements[${i}].style.align = this.value`
            }, i)
            popupHTML += edit.selection.popup.newSection({
                icon: 'font',
                type: 'font',
                values: app.fonts,
                checked: note.elements[i].style.font,
                onrun: `note.elements[${i}].style.font = this.value`
            }, i)
            popupHTML += edit.selection.popup.newSection({
                icon: 'color',
                type: 'color',
                value: note.elements[i].style.color,
                onrun: `note.elements[${i}].style.color = this.value`
            }, i)
            break

        case 'image':
            popupHTML += edit.selection.popup.newSection({
                icon: 'rotate',
                type: 'slider',
                name: 'rotation',
                min: -180,
                step: 15,
                max: 180,
                value: note.elements[i].style.rotation,
                onrun: `note.elements[${i}].style.rotation = parseFloat(this.value)`
            }, i)
            popupHTML += edit.selection.popup.newSection({
                icon: 'scale',
                type: 'slider',
                name: 'scale',
                min: 0.05,
                step: 0.05,
                max: 10,
                value: note.elements[i].scale,
                onrun: `note.elements[${i}].scale = parseFloat(this.value)`
            }, i)
        default:
            edit.selection.element.innerHTML = ''
            break
    }
    edit.selection.element.innerHTML = '<div id="selection-popup" class="iconSet-h" onmousedown="event.stopPropagation()">' + popupHTML + '</div>'
}


edit.selection.popup.newSection = function (args, i) {
    // this function creates a new section in the popup
    if (!args || !args.type || !args.onrun || !args.icon) {
        console.error('Invalid arguments for newSection:', args)
        return ''
    }

    let getRenderFunction = function (i) {
        return `render.${note.elements[i].type}(note.elements[${i}], ${i});edit.selection.updatePosition(${i})`
    }

    let string = ''
    switch (args.type) {
        case 'delete':
            string = `<button onclick="${args.onrun}">Delete</button>`
            break

        case 'slider':
            string = `<input type="range" min="${args.min}" max="${args.max}" value="${args.value}" ${args.step ? `step="${args.step}"` : ''}oninput="${args.onrun};${getRenderFunction(i)}">`
            break

        case 'color':
            string = `<input type="color" value="${args.value}" onchange="${args.onrun};${getRenderFunction(i)}">`
            break

        case 'radio':
            for (let j = 0; j < args.values.length; j++) {
                string += `<input type="radio"
                    style="background-image: url('./icons/${args.icons[j]}.svg')"
                    class="icon" name="edit-element-${i}-${args.name}"
                    value="${args.values[j]}"
                    onchange="${args.onrun};${getRenderFunction(i)};this.parentElement.parentElement.style.backgroundImage='url(./icons/${args.icons[j]}.svg)'" ${args.checked == args.values[j] ? 'checked' : ''}
                >`
            }
            break
        
        case 'select':
            for (let j = 0; j < args.values.length; j++) {
                string += `<option value="${args.values[j]}" onchange="${args.onrun};${getRenderFunction(i)}" selected="${args.checked == args.values[j]}">${args.values[j]}</option>`
            }
            string = `<select onchange="${args.onrun};${getRenderFunction(i)}">${string}</select>`
            break
        
        case 'font':
            string += `<ul class="font-list">`
            for (let j = 0; j < args.values.length; j++) {
                string += `<li class="font-${args.values[j]}" onclick="${args.onrun.replace('this.value', `'${args.values[j]}'`)};${getRenderFunction(i)};">${args.values[j]}</li>`
            }
            string += `</ul>`
            break

        default:
            console.error('Unknown section type:', args.type)
    }
    return `
        <div class="popup-icon icon" style="background-image: url('./icons/${args.icon}.svg')">
            <div class="popup-section${args.type == 'radio' ? ' iconSet-h' : ''}">
                ${string}
            </div>
        </div>`
}






