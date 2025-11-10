settings = {
    minZoom: 0.05,
    maxZoom: 20,
    gestureSensitivity: {
        moveWithCtrl: 1,
        zoom: 0.015,
        moveWithFinger: 2.5
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
    },
    theme: {
        clrAccent: '',
        clr: '',
        ballsNotebg: true
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

    document.getElementById("settings-balls-notebg").checked = settings.theme.ballsNotebg
    document.getElementById("settings-balls-notebg").onchange()

    settings.theme.clrAccent = getComputedStyle(document.documentElement).getPropertyValue('--clr-accent').trim()
    document.getElementById("settings-clr-accent").value = settings.theme.clrAccent
    document.getElementById("settings-clr-accent").onchange = function () {
        document.documentElement.style.setProperty('--clr-accent', this.value)
        settings.theme.clrAccent = this.value
    }

    settings.theme.clr = getComputedStyle(document.documentElement).getPropertyValue('--clr').trim()
    document.getElementById("settings-clr").value = settings.theme.clr
    document.getElementById("settings-clr").onchange = function () {
        document.documentElement.style.setProperty('--clr', this.value)
        settings.theme.clr = this.value
    }

    settings.audioConstraints.default = settings.audioConstraints.betterBgAudio
    document.getElementById("settings-betterBgAudio").checked = true

}

settings.setValues = function () {
    document.getElementById("settings-moveWithCtrl").value = settings.gestureSensitivity.moveWithCtrl
    document.getElementById("settings-moveWithFinger").value = settings.gestureSensitivity.moveWithFinger
    document.getElementById("settings-zoom").value = settings.gestureSensitivity.zoom
    document.getElementById("settings-clr-accent").value = settings.theme.clrAccent
    document.getElementById("settings-clr").value = settings.theme.clr
    document.getElementById("settings-balls-notebg").checked = settings.theme.ballsNotebg
    document.getElementById("settings-balls-notebg").onchange()
    document.getElementById("settings-betterBgAudio").checked = settings.audioConstraints.default === settings.audioConstraints.betterBgAudio
    document.getElementById("settings-betterBgAudio").onchange()
}