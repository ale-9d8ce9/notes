class newNote {
    constructor(obj) {
        this.name = obj.name
        this.elements = []
        this.files = []
        
        this.filesToDelete = []
        this.dateModified = (new Date()).toISOString()

        if (obj.isNew) {
            this.dateCreated = (new Date()).toISOString()
            this.version = app.buildVersion
            this.editable = true
            this.position = {
                x: 0,
                y: 0,
                scale: 1
            }
        } else {
            this.position = obj.position
            this.elements = obj.elements
            this.files = obj.files
            this.version = obj.version
            for (let i = 0; i < this.files.length; i++) {
                this.elements[i].toUpload = false
            }
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
                    element = new newElement.image(size)
                    file = new newFile(data)
                    this.elements.push(element)
                    this.files.push(file)
                    break
                default:
                    throw new Error('Unknown type')
            }
            edit.select(this.elements.length - 1)
        }
    }
    removeElement(i) {
        if (!this.editable) {
            throw new Error('Note is not editable')
        } else {
            if (i < 0 || i >= this.elements.length) {
                throw new Error('Index out of bounds')
            }
            if (this.elements[i].toUpload == false) {
                this.filesToDelete.push(i)
            }
            this.elements.splice(i, 1)
            this.files.splice(i, 1)
            render.delete(i)
            edit.select(-1)
        }
    }
    load() {
        this.versionCheck()
        document.querySelector('body').setAttribute('in-overlay', 'false')
        openOverlay()
        render.all()
    }
    versionCheck() {
        if (this.version != app.buildVersion) {
            loadScript('render/' + app.history[this.version].versionName + '.js')
            this.editable = false
        } else {
            this.editable = true
        }
    }
}

newElement = {
    text : class {
        constructor(size, text) {
            this.type = 'text'
            this.x = size.x1
            this.y = size.y1
            this.width = -1
            this.height = -1
            this.text = text

            this.toUpload = true

            this.style = {
                align: 'left',
                font: app.fonts[0],
                textSize: 12,
                color: '#ffffff',
                background: '#ffffff00',
                opacity: 1,
                underline: false,
                bold: false,
                italic: false,
                strikethrough: false,
            }
        }
    }, image : class {
        constructor(size) {
            this.type = 'image'
            
            this.x = size.x1
            this.y = size.y1
            this.width = size.x2 - size.x1
            this.height = size.y2 - size.y1

            this.toUpload = true

            this.style = {
                opacity: 1,
                border: 'none',
                borderRadius: '0px',
                boxShadow: 'none',
                background: '#ffffff00'
            }
        }
    }
}
class newFile {
    constructor(data) {
        this.data = data
    }
}

