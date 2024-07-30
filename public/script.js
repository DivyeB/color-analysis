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
    const rgb = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
    const hex = rgbToHex(imageData[0], imageData[1], imageData[2]);
    document.getElementById('color-info').innerText = `Color: ${hex}`;
});

function saver() {
    let color = document.getElementById('color-info').innerText;
    splitedColor = color.split(" ");
    colorToSave = splitedColor[1];
    document.getElementById('color-picked').innerText = 'Color Picked: ' + colorToSave;
}

canvas.addEventListener('click', saver);

document.getElementById('set-facecolor').addEventListener('click', () => {
    facecolor = colorToSave;
    colors.faceColor = facecolor;
    console.log("Face color:", facecolor);
});

document.getElementById('set-haircolor').addEventListener('click', () => {
    haircolor = colorToSave;
    colors.hairColor = haircolor;
    console.log("Hair color:", haircolor);
});

document.getElementById('set-eyecolor').addEventListener('click', () => {
    eyecolor = colorToSave;
    colors.eyeColor = eyecolor;
    console.log("Eye color:", eyecolor);
});

document.getElementById('submit').addEventListener('click', async () => {
    try {
        const serverURL = `${window.location.protocol}//${window.location.host}`;
        console.log("Server URL:", serverURL);
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
            console.log("AI Result:", result);
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