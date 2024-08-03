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
            // Redirect to the result page and store result in localStorage
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