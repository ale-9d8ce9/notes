window.onload = start
const body = document.querySelector('body')
const noteContent = document.getElementById('note-content')

function start() {
    note = new newNote('test note', true)
    note.load()
    openOverlay()
}

function loadScript(path) {
    const script = document.createElement('script')
    script.src = './' + path
    script.type = 'text/javascript'
    script.id = 'script-' + path
    script.onload = function () {
        console.log('Script loaded successfully!')
    }
    document.body.appendChild(script)
}

function openOverlay(overlayName) {
    for (let i = 0; i < document.getElementsByClassName('overlay-section').length; i++) {
        document.getElementsByClassName('overlay-section')[i].removeAttribute('show')
    }
    if (overlayName) {
        document.querySelector('#'+overlayName+'.overlay-section').setAttribute('show', '')
    }
}


document.addEventListener('paste', function(event) {
    const items = (event.clipboardData || window.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const imageFile = items[i].getAsFile();
            imageToBase64(imageFile, function(base64String) {
                console.log('Base64 string:', base64String);
                // create image
                note.addElement('image', base64String, {x1: event.clientX, y1: event.clientY, x2: event.clientX + 100, y2: event.clientY + 100});
            });
        }
    }
});

function imageToBase64(imageFile, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}
