settings = {
    minZoom: 0.05,
    maxZoom: 20,
    gestureSensitivity: {
        moveWithCtrl: 1,
        zoom: 0.01,
        moveWithFinger: 2
    },
    audioConstraints: {
        betterBgAudio: {
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                sampleRate: 44100
            },
        },
        normal: {
            audio: true
        },
    }
}

settings.start = function () {
    document.getElementById("settings-moveWithCtrl").value = settings.gestureSensitivity.moveWithCtrl
    document.getElementById("settings-moveWithCtrl").onchange = function () {
        settings.gestureSensitivity.moveWithCtrl = parseFloat(this.value)
    }

    document.getElementById("settings-moveWithFinger").value = settings.gestureSensitivity.moveWithFinger
    document.getElementById("settings-moveWithFinger").onchange = function () {
        settings.gestureSensitivity.moveWithFinger = parseFloat(this.value)
    }

    document.getElementById("settings-zoom").value = settings.gestureSensitivity.zoom
    document.getElementById("settings-zoom").onchange = function () {
        settings.gestureSensitivity.zoom = parseFloat(this.value)
    }

    document.getElementById("settings-clr").value = getComputedStyle(document.documentElement).getPropertyValue('--clr').trim()
    document.getElementById("settings-clr").onchange = function () {
        document.documentElement.style.setProperty('--clr', this.value)
    }

    document.getElementById("settings-clr-secondary").value = getComputedStyle(document.documentElement).getPropertyValue('--clr-secondary').trim()
    document.getElementById("settings-clr-secondary").onchange = function () {
        document.documentElement.style.setProperty('--clr-secondary', this.value)
    }

    settings.audioConstraints.default = settings.audioConstraints.betterBgAudio
}
    