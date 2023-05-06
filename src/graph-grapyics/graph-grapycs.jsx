export default UseGraphGraphics


function UseGraphGraphics({width, height})
{
    const canvas = <canvas></canvas>

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    function circle({x, y, r, border:{color:borderColor, width},color}) {
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = borderColor
        ctx.lineWidth = width
        ctx.stroke()
    }
    function line({x1, y1, x2, y2, color, width}) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.stroke()
    }

    function clear() {
        ctx.clearRect(0, 0, width, height)
    }

    function save()
    {
        var url = canvas.toDataURL("image/png")
        var link = document.createElement('a')
        link.download = 'image.png'
        link.href = url
        link.click()
    }

    function useRecord()
    {
        var recordedChunks = [];
        var stream = canvas.captureStream(25 /*fps*/);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm;codecs=opus,vp8"
        });
        
        mediaRecorder.start(100);

        mediaRecorder.ondataavailable = function (event) {
            recordedChunks.push(event.data);
        }

        function stop()
        {
            mediaRecorder.stop();
            return new Promise((resolve, reject) => {
                mediaRecorder.onstop = function (event) {
                    var blob = new Blob(recordedChunks, {type: "video/webm" });
                    var url = URL.createObjectURL(blob);
                    resolve(url);
                }
            })
        }
        return {stop}
    }

    return {canvas,useRecord,clear,save, circle, line}
}