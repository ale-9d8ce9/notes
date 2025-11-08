audio = {available: false, chunks: []}

audio.start = function () {
    if (navigator.audioSession.type) {
        navigator.audioSession.type = 'play-and-record'
    }
    audio.bubbleElement = document.getElementById('audio-bubble')
    audio.bubbleElement.onmouseenter = function () {
        audio.startRecording()
    }
    audio.bubbleElement.onmouseleave = function () {
        audio.stopRecording()
    }
    
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.")
        
        navigator.mediaDevices.getUserMedia(settings.audioConstraints.default)
        .then((stream) => {
            audio.mediaRecorder = new MediaRecorder(stream)

        }).catch((err) => {
            console.error(`The following getUserMedia error occurred: ${err}`)
            alert(`The following getUserMedia error occurred: ${err}`)
        })

        audio.available = true
    } else {
        console.log("getUserMedia not supported on your browser!")
        alert("getUserMedia not supported on your browser!")
    }
}


audio.startRecording = function () {
    if (audio.mediaRecorder && audio.mediaRecorder.state === "inactive") {
        audio.chunks = []
        audio.mediaRecorder.start()
        audio.mediaRecorder.ondataavailable = function (e) {
            audio.chunks.push(e.data)
        }
        console.log("Recording started.")
    }
}


audio.stopRecording = function () {
    if (audio.mediaRecorder && audio.mediaRecorder.state === "recording") {
        audio.mediaRecorder.stop()
        audio.mediaRecorder.onstop = function () {
            let blob = new Blob(audio.chunks, {'type': 'audio/mp4'})
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onload = function () {
                console.log("adding audio")
                const base64String = reader.result
                edit.add.audio(base64String)
            }
            console.log("Recording stopped.")
        }
    }
}

function imageToBase64(imageFile, callback) {
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onload = function () {
        callback(reader.result)
    }
    reader.onerror = function (error) {
        console.error('Error: ', error)
    }
}
