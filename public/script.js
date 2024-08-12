document.getElementById('upload').addEventListener('change', handleImageUpload);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let facecolor;
let haircolor;
let eyecolor;
let colors = {
    faceColor: facecolor,
    hairColor: haircolor,
    eyeColor: eyecolor
};
let colorToSave;

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
    };

    img.onerror = () => {
        document.getElementById('error-info').innerText = "Error loading image. Please check the file.";
    };

    img.src = url;
}

canvas.addEventListener('mousemove', (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(imageData[0], imageData[1], imageData[2]);
    document.getElementById('color-info').innerText = `Color: ${hex}`;
});

function saver() {
    const color = document.getElementById('color-info').innerText;
    const splitedColor = color.split(" ");
    colorToSave = splitedColor[1];
    document.getElementById('color-picked').innerHTML = `Color Picked: <span style="color:${colorToSave};">${colorToSave}</span>`;
}

canvas.addEventListener('click', saver);

document.getElementById('set-facecolor').addEventListener('click', () => {
    facecolor = colorToSave;
    colors.faceColor = facecolor;
    document.getElementById('face-color').innerHTML = `Face Color: <span style="color:${facecolor};">${facecolor}</span>`;
});

document.getElementById('set-haircolor').addEventListener('click', () => {
    haircolor = colorToSave;
    colors.hairColor = haircolor;
    document.getElementById('hair-color').innerHTML = `Hair Color: <span style="color:${haircolor};">${haircolor}</span>`;
});

document.getElementById('set-eyecolor').addEventListener('click', () => {
    eyecolor = colorToSave;
    colors.eyeColor = eyecolor;
    document.getElementById('eye-color').innerHTML = `Eye Color: <span style="color:${eyecolor};">${eyecolor}</span>`;
});

document.getElementById('submit').addEventListener('click', async () => {
    try {
        const serverURL = `${window.location.protocol}//${window.location.host}`;
        const response = await fetch(`${serverURL}/colors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                faceColor: colors.faceColor,
                hairColor: colors.hairColor,
                eyeColor: colors.eyeColor
            })
        });

        if (response.ok) {
            const result = await response.text();
            localStorage.setItem('result', result);
            window.location.href = '/result';
        } else {
            console.error("Error fetching AI result:", response.statusText);
        }
    } catch (error) {
        console.error("Error sending request:", error);
    }
});


function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

//GSAP animations
gsap.from(".card", { opacity: 0, y: 50, duration: 1.5, ease: "power2.out", delay: 0.5 });
gsap.from(".btn-custom", { scale: 0.8, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.7)", delay: 1 });

// Locomotive Scroll initialization
const scroll = new LocomotiveScroll({
    el: document.querySelector('body'),
    smooth: true,
    lerp: 0.1,
});

// WebGL effect on canvas
const vertexShaderSrc = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;
const fragmentShaderSrc = `
precision mediump float;
void main() {
    gl_FragColor = vec4(0.0, 0.8, 1.0, 1.0);
}`;
const gl = canvas.getContext("webgl");
if (gl) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSrc);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSrc);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Smooth scrolling with Locomotive Scroll
scroll.on("scroll", (position) => {
    console.log(position.scroll.y);  // For debug purposes, you can remove this line
});
