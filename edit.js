edit = {
    vars:{},
    text:{},
    image:{},
    move:{},
    selection:{popup:{}}
}
edit.selection.element = document.getElementById('selection')


edit.selection.element.onmousedown = function () {edit.move.start()}

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
    note.addElement('image', base64String, convert.toPoints({x1: client.mouseX, y1: client.mouseY, x2: client.mouseX + 100, y2: client.mouseY + 100}))
    render.image(note.elements[note.elements.length - 1], note.elements.length - 1)
}


edit.select = function (i) {
    for (let i = 0; i < document.getElementsByClassName('element').length; i++) {
        document.getElementsByClassName('element')[i].classList.remove('selected')
    }
    document.getElementById('element-' + i).classList.add('selected')
    edit.selection.popup.create(i)

    let pos = document.getElementById('element-' + i).getBoundingClientRect()
    edit.selection.element.style.left = pos.left + 'px'
    edit.selection.element.style.top = pos.top + 'px'
    edit.selection.element.style.width = pos.width + 'px'
    edit.selection.element.style.height = pos.height + 'px'
    
    edit.selection.element.classList.add('show')
    app.elementSelected = i
}


edit.selection.popup.create = function (i) {
    edit.selection.element = document.getElementById('selection')
    switch (note.elements[i].type) {
        case 'text':
            edit.selection.element.innerHTML = (new edit.selection.popup.text(i)).string
            break
    
        default:
            edit.selection.element.innerHTML = ''
            break
    }
}


edit.move.start = function () {
    edit.move.mouseStartX = window.client.mouseX
    edit.move.mouseStartY = window.client.mouseY
    edit.move.elementStartX = note.elements[app.elementSelected].x
    edit.move.elementStartY = note.elements[app.elementSelected].y
    document.getElementsByClassName('element')[app.elementSelected].classList.add('no-transition')
    body.onmousemove = function () {edit.move.move(event)}
    body.onmouseup = edit.move.stop
}
edit.move.move = function (event) {
    let i = app.elementSelected
    note.elements[i].x = convert.toPoints({x: event.clientX}).x
    note.elements[i].y = convert.toPoints({y: event.clientY}).y
    //note.elements[i].y = event.clientY * edit.move.elementStartY / edit.move.mouseStartY
    render.all()
    console.log(note.elements[i].x, note.elements[i].y)

}
edit.move.stop = function () {
    document.getElementsByClassName('element')[app.elementSelected].classList.remove('no-transition')
    body.onmousemove = function () {}
    body.onmouseup = function () {}
}

edit.selection.popup.text = class {
    // this class is used to create the popup for the text element
    // it works i guess :)
    // i wouldn't touch this class if i were you
    constructor(i) {
        this.element = document.createElement('div')
        this.element.className = 'popup'
        this.i = i
        this.data = note.elements[i]
        this.sections = {
            align: this.getAlign(),
            font: this.getFont(),
            size: this.getSize(),
            color: this.getColor()
        }
        this.string = `
            <div id="selection-popup">
                ${this.sections.align}
                ${this.sections.font}
                ${this.sections.size}
            </div>`
    }
    getAlign() {
        this.inputString=''
        for (let j = 0; j < ['left','center','right','justify'].length; j++) {
            const align = ['left','center','right','justify'][j];
            this.inputString+=`<input type="radio" name="element-${this.i}-align" value="${align}" class="align align-${align}"`
            if (this.data.style.align == align) {
                this.inputString += ' checked'
            }
            this.inputString += ` onchange="
                note.elements[${this.i}].style.align = '${align}'
                render.text(note.elements[${this.i}], ${this.i})
                "`
            this.inputString += `>`
        }
        return `<div class="popup-section">${this.inputString}</div>`
    }
    getFont() {
        this.inputString=''
        for (let j = 0; j < ['Arial','Courier','Georgia','Times New Roman','Verdana'].length; j++) {
            const font = ['Arial','Courier','Georgia','Times New Roman','Verdana'][j];
            this.inputString+=`<input type="radio" name="element-${this.i}-font" value="${font}" class="font font-${font}"`
            if (this.data.style.font == font) {
                this.inputString += ' checked'
            }
            this.inputString += ` onchange="
                note.elements[${this.i}].style.font = '${font}'
                render.text(note.elements[${this.i}], ${this.i})
                "`
            this.inputString += `>`
        }
        return `<div class="popup-section">${this.inputString}</div>`
    }
    getSize() {
        this.inputString=''
        for (let j = 0; j < [8,10,12,14,16,18,20].length; j++) {
            const size = [8,10,12,14,16,18,20][j];
            this.inputString+=`<input type="radio" name="element-${this.i}-size" value="${size}" class="size size-${size}"`
            if (this.data.style.textSize == size) {
                this.inputString += ' checked'
            }
            this.inputString += ` onchange="
                note.elements[${this.i}].style.textSize = '${size}'
                render.text(note.elements[${this.i}], ${this.i})
                "`
            this.inputString += `>`
        }
        return `<div class="popup-section">${this.inputString}</div>`
    }
    getColor() {
        this.inputString=''
        for (let j = 0; j < ['#000000','#FF0000','#00FF00','#0000FF','#FFFF00'].length; j++) {
            const color = ['#000000','#FF0000','#00FF00','#0000FF','#FFFF00'][j];
            this.inputString+=`<input type="radio" name="element-${this.i}-color" value="${color}" class="color color-${color}"`
            if (this.data.style.color == color) {
                this.inputString += ' checked'
            }
            this.inputString += ` onchange="
                note.elements[${this.i}].style.color = '${color}'
                render.text(note.elements[${this.i}], ${this.i})
                "`
            this.inputString += `>`
        }
        return `<div class="popup-section">${this.inputString}</div>`
    }
}




