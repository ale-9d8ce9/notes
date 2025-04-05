function render() {
    note.elements.forEach(function (element) {
        switch (element.type) {
            case 'text':
                renderText(element)
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
    })
}
function renderText(element) {
    const textElement = document.createElement('div')
    textElement.className = 'text-element element'
    textElement.innerHTML = '<pre>'+element.text+'</pre>'
    textElement.style.left = element.x + 'px'
    textElement.style.top = element.y + 'px'
    textElement.style.width = element.width + 'px'
    noteContent.appendChild(textElement)
}
