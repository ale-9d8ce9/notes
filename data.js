class newNote {
    constructor(name) {
        this.name = name
        this.elements = []
        this.date = new Date()
        this.version = app.buildVersion
        this.editable = true
    }
    addElement(type, data, size) {
        if (!this.editable) {
            throw new Error('Note is not editable')
        } else {
            let element
            switch (type) {
                case 'text':
                    element = new text(size, data)
                    break
                case 'image':
                    element = new image(size, data)
                    break
                default:
                    throw new Error('Unknown type')
            }
            element.type = type
            this.elements.push(element)
        }
    }
    load() {
        this.versionCheck()
    }
    versionCheck() {
        if (this.version != app.buildVersion) {
            loadScript('render/' + app.history[this.version].versionName + '.js')
            this.editable = false
        }
    }
}

class text {
    constructor(size, text) {
        this.text = text
        this.x = size.x1
        this.y = size.y1
        this.style = {
            align: 'left',
            font: 'Arial',
            textSize: 12,
            color: '#000000',
            background: '#ffffff',
            opacity: 1,
            underline: false,
            bold: false,
            italic: false,
            strikethrough: false,
        }
    }
}


class image {
    constructor(size, src, style) {
        this.src = src
        this.x = size.x1
        this.y = size.y1
        this.width = size.x2 - size.x1
        this.height = size.y2 - size.y1
    }
}


