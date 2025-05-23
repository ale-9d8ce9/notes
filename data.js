class newNote {
    constructor(name, isNew, elements, files) {
        this.name = name
        this.elements = []
        this.files = []

        this.dateModified = (new Date()).toISOString()

        if (isNew) {
            this.dateCreated = (new Date()).toISOString()
            this.version = app.buildVersion
            this.editable = true
        } else {
            this.elements = elements
            this.files = files
        }
    }
    addElement(type, data, size) {
        if (!this.editable) {
            throw new Error('Note is not editable')
        } else {
            let element
            let file
            switch (type) {
                case 'text':
                    element = new newElement.text(size, data)
                    file = null
                    this.elements.push(element)
                    this.files.push(file)
                    break
                case 'image':
                    element = new newElement.image(size, this.elements.length)
                    file = new newFile.image(data)
                    this.elements.push(element)
                    this.files.push(file)
                    break
                default:
                    throw new Error('Unknown type')
            }
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

newElement = {
    text : class {
        constructor(size, text) {
            this.type = 'text'
            this.x = size.x1
            this.y = size.y1
            
            this.text = text
            
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
    }, image : class {
        constructor(size, i) {
            this.type = 'image'
            
            this.x = size.x1
            this.y = size.y1
            this.width = size.x2 - size.x1
            this.height = size.y2 - size.y1
            this.fileIndex = i

            this.style = {
                opacity: 1,
                border: 'none',
                borderRadius: '0px',
                boxShadow: 'none',
                background: '#ffffff'
            }
        }
    }
}
newFile = {
    image : class {
        constructor(data) {
            this.type = 'image'
            this.data = data
            this.size = data.length
            this.updated = true
            this.deleted = false
        }
    }
}

