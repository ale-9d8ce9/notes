render = {}
render.all = function () {
    for (let i = 0; i < note.element.length; i++) {
        const element = note.element[i];
        switch (element.type) {
            case 'text':
                render.text(element, i)
                break
            case 'image':
                const imgElement = document.createElement('img')
                imgElement.src = element.src
                imgElement.style.position = 'absolute'
                imgElement.style.left = element.x + 'px'
                imgElement.style.top = element.y + 'px'
                imgElement.style.width = element.width + 'px'
                imgElement.style.height = element.height + 'px'
                noteContent.appendChild(imgElement)
                break
        }
    }
}

render.text = function (data, i) {
    if (document.getElementById('text-element-' + i)) {
        // If the element already exists set the variables to the existing element
        render.element = document.getElementById('text-element-' + i)
        render.elementPopup = document.getElementById('text-element-popup-' + i)
        render.elementData = document.getElementById('text-element-data-' + i)
        render.alreadyRendered = true
    } else {
        // If the element does not exist create a new one
        render.element = document.createElement('div')
        render.element.className = 'text-element element'
        render.element.id = 'text-element-' + i

        render.elementPopup = document.createElement('div')
        render.elementPopup.className = 'popup'
        render.elementPopup.id = 'text-element-popup-' + i

        render.elementData = document.createElement('pre')
        render.elementData.id = 'text-element-data-' + i
        render.alreadyRendered = false
    }
    // Set the element data and values
    render.element.style.left = data.x + 'px'
    render.element.style.top = data.y + 'px'
    
    render.elementPopup.innerHTML = new textPopup(data, i).string

    render.elementData.innerText = data.text
    note.editable ? render.elementData.contentEditable = true : undefined
    render.elementData.style.textAlign = data.style.align
    render.elementData.style.fontFamily = data.style.font
    render.elementData.style.fontSize = data.style.textSize + 'px'

    if (!render.alreadyRendered) {
        // If the element does not exist add the new element to the note
        note.editable ? render.element.appendChild(render.elementPopup) : undefined
        render.element.appendChild(render.elementData)
        noteContent.appendChild(render.element)
        render.elementData.onblur = function () {
            note.elements[i].text = render.elementData.innerText
            render.text(note.elements[i], i)
        }
    }
}

class textPopup {
    // this class is used to create the popup for the text element
    // it works i guess :)
    // i wouldn't touch this class if i were you
    constructor(data, i) {
        this.element = document.createElement('div')
        this.element.className = 'popup'
        this.i = i
        this.data = data
        this.sections = {
            align: this.getAlign(),
            font: this.getFont(),
            size: this.getSize(),
            color: this.getColor()
        }
        this.string = `
            <div class="popup-content">
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
