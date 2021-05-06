document.addEventListener("DOMContentLoaded", function(){

    let cx = document.querySelector("canvas").getContext("2d")

    cx.beginPath()

    cx.strokeStyle = "blue"
    cx.moveTo(10, 100)
    cx.lineTo(100,100)
    cx.fill()
})