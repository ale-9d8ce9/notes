settings = {
    minZoom: 0.05,
    maxZoom: 20,
    gestureSensitivity: {
        moveWithCtrl: 1,
        zoom: 0.01,
        moveWithFinger: 2
    }
}

settings.start = function () {
    document.getElementById("hue-primary-slider").addEventListener("input", function() {
        document.documentElement.style.setProperty("--clr-accent-hue", this.value)
        this.setAttribute("data-value", this.value)
    })
    document.getElementById("saturation-primary-slider").addEventListener("input", function() {
        document.documentElement.style.setProperty("--clr-accent-saturation", this.value)
        this.setAttribute("data-value", this.value)
    })
    document.getElementById("lightness-primary-slider").addEventListener("input", function() {
        document.documentElement.style.setProperty("--clr-accent-lightness", this.value + "%")
        this.setAttribute("data-value", this.value)
    })
    
    document.getElementById("hue-secondary-slider").addEventListener("input", function() {
        document.documentElement.style.setProperty("--clr-hue", this.value)
        this.setAttribute("data-value", this.value)
    })
    document.getElementById("saturation-secondary-slider").addEventListener("input", function() {
        document.documentElement.style.setProperty("--clr-saturation", this.value)
        this.setAttribute("data-value", this.value)
    })
    document.getElementById("lightness-secondary-slider").addEventListener("input", function() {
        document.documentElement.style.setProperty("--clr-lightness", this.value + "%")
        this.setAttribute("data-value", this.value)
    })
    
    document.getElementById("hue-bg-slider").addEventListener("input", function() {
        document.documentElement.style.setProperty("--clr-bg-hue", this.value)
        this.setAttribute("data-value", this.value)
    })
    document.getElementById("saturation-bg-slider").addEventListener("input", function() {
        document.documentElement.style.setProperty("--clr-bg-saturation", this.value)
        this.setAttribute("data-value", this.value)
    })
    document.getElementById("lightness-bg-slider").addEventListener("input", function() {
        document.documentElement.style.setProperty("--clr-bg-lightness", this.value + "%")
        this.setAttribute("data-value", this.value)
    })
    
    document.getElementById("hue-primary-slider").setAttribute("data-value", document.documentElement.style.getPropertyValue("--clr-hue"))
    document.getElementById("saturation-primary-slider").setAttribute("data-value", document.documentElement.style.getPropertyValue("--clr-saturation"))
    document.getElementById("lightness-primary-slider").setAttribute("data-value", document.documentElement.style.getPropertyValue("--clr-lightness"))
    document.getElementById("hue-primary-slider").setAttribute("value", parseFloat(document.documentElement.style.getPropertyValue("--clr-hue")))
    document.getElementById("saturation-primary-slider").setAttribute("value", parseFloat(document.documentElement.style.getPropertyValue("--clr-saturation")))
    document.getElementById("lightness-primary-slider").setAttribute("value", parseFloat(document.documentElement.style.getPropertyValue("--clr-lightness")))

}
    