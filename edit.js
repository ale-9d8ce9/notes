edit = {
    vars:{},
    move:{},
    add:{},
    selection:{popup:{}, enableTransitions: true}
}
edit.selection.element = document.getElementById('selection')
edit.selection.popupElement = document.getElementById('selection-popup')


edit.selection.element.onmousedown = function () {edit.move.start(event)}


document.getElementById('add-text').onclick = function () {
    noteWrapper.onclick = function (event) {
        edit.add.text(event)
    }
}
document.getElementById('add-image').onclick = function () {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = e => {
        let file = e.target.files[0]
        imageToBase64(file, function(base64String) {
            // create image
            edit.add.image(base64String)
        })
    }
    input.click()
}
document.getElementById('add-audio').onclick = function () {
    openOverlay('add-audio')
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
        let width = img.naturalWidth/app.initialWindowInnerWidth
        let height = img.naturalHeight/app.initialWindowInnerWidth
        // get center position
        let x = window.innerWidth / 2 - width / 2
        let y = window.innerHeight / 2 - height / 2
        let position = convert.toPoints(getMousePosition({clientX: x, clientY: y}))

        note.addElement('image', base64String, {
            x: position.x,
            y: position.y,
            width: width,
            height: height
        })
    }
}


edit.select = function (i) {
    if (i != -1) {
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
        edit.selection.element.style.setProperty('--min-hitbox-width', document.getElementById('selection-popup').offsetWidth + 'px') // hitbox always at least as wide as popup
        edit.selection.element.classList.add('show')
        if (edit.selection.enableTransitions) {
            edit.selection.element.classList.remove('no-transition')
        } else {
            edit.selection.element.classList.add('no-transition')
        }
    } else {
        edit.selection.element.classList.remove('show')
    }
}

edit.move.start = function (event) {
    edit.move.mouseStartX = event.clientX
    edit.move.mouseStartY = event.clientY
    edit.move.elementStartX = note.elements[app.elementSelected].x
    edit.move.elementStartY = note.elements[app.elementSelected].y
    edit.selection.enableTransitions = false
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
    edit.selection.enableTransitions = true
    edit.selection.updatePosition(app.elementSelected)
    body.onmousemove = function () {}
    body.onmouseup = function () {}
}


edit.selection.popup.create = function (i) {
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
                max: 3,
                value: note.elements[i].scale ** (1/3),
                onrun: `note.elements[${i}].scale = parseFloat(this.value) ** 3`
            }, i)
        default:
            break
    }
    edit.selection.popupElement.innerHTML = popupHTML
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
                    class="icon no-scale" name="edit-element-${i}-${args.name}"
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
            string += `<ul class="select-list v">`
            for (let j = 0; j < args.values.length; j++) {
                string += `<li class="font-${args.values[j]}" onclick="${args.onrun.replace('this.value', `'${args.values[j]}'`)};${getRenderFunction(i)};">${args.values[j]}</li>`
            }
            string += `</ul>`
            break

        default:
            console.error('Unknown section type:', args.type)
    }
    return `
        <div class="popup-icon icon no-scale" style="background-image: url('./icons/${args.icon}.svg')">
            <div class="popup-section${args.type == 'radio' ? ' select-list h' : ''}">
                ${string}
            </div>
        </div>`
}






