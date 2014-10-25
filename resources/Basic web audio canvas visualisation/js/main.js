var freqAnalyser, canvas, canvasContext, flag;
window.addEventListener('load', init, false);

function init() {
    setupWebAudio();
    setupDrawingCanvas();
    draw();
}

function setupWebAudio() {
    var audio = document.getElementById('music');
    var audioContext = new webkitAudioContext();
    freqAnalyser = audioContext.createAnalyser();
    var source = audioContext.createMediaElementSource(audio);
    source.connect(freqAnalyser);
    source.connect(audioContext.destination);
    audio.play();
}

function setupDrawingCanvas() {
    canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 800;
    document.body.appendChild(canvas);
    canvasContext = canvas.getContext('2d');
    canvasContext.fillStyle = '#ffffff';
}

function draw() {
    requestAnimationFrame(draw);
    // Gets the frequency data of the audio
    var freqByteData = new Uint8Array(freqAnalyser.frequencyBinCount);
    freqAnalyser.getByteFrequencyData(freqByteData);

    // Calculates volume by averaging lower end of freq data
    var total = 0;
    for (var v = 0; v < 80; v++) {
        total += freqByteData[v];
    }
    var volume = total;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    equaliser(freqByteData, volume);
}

function equaliser(freqByteData, volume) {
        
    for (var i = 0; i < freqByteData.length; i = i + 17) {
        var value = freqByteData[i];
        var percent = value / 256;
        var height = 200 * percent;
        var offset = 200 - height - 1;
        var barWidth = 1000 / freqAnalyser.frequencyBinCount;
        var hue = i / freqAnalyser.frequencyBinCount;
        var sat = percent;
        // Makes the bars appear in a circle
        canvasContext.save();
        canvasContext.translate(300, 250)
        canvasContext.rotate((0.38) * (i + 1) * Math.PI / 180);
        var rgb = hslToRgb(hue, sat, 0.5);
        var hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        // Makes pretty rainbow colours
        canvasContext.fillStyle = 'hsl(' + hsl[0] * 360 + ', ' + hsl[1] * 100 + '%, ' + hsl[2] * 100 + '%)';
        // Makes the hole of the circle pulse with the music
        canvasContext.fillRect(0, volume / 100, 10, height);
        canvasContext.restore();
    }
}

// Helper functions
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function average(array, start, size) {
    var count = 0;
    for (var i = start; i < start + size; i++) {
        count += array[i];
    };
    var average = count / size;
    return average;
}
