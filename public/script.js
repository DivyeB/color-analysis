document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('upload').addEventListener('change', handleImageUpload);

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let faceColor = null;
    let hairColor = null;
    let eyeColor = null;
    let colorToSave = null;

    const colors = {
        faceColor,
        hairColor,
        eyeColor
    };

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

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

    function saveColor() {
        const colorInfoText = document.getElementById('color-info').innerText;
        const [_, hexColor] = colorInfoText.split(" ");
        colorToSave = hexColor;
        document.getElementById('color-picked').innerText = `Color Picked: ${colorToSave}`;
    }

    canvas.addEventListener('click', saveColor);

    document.getElementById('set-facecolor').addEventListener('click', () => {
        faceColor = colorToSave;
        colors.faceColor = faceColor;
        console.log("Face color:", faceColor);
    });

    document.getElementById('set-haircolor').addEventListener('click', () => {
        hairColor = colorToSave;
        colors.hairColor = hairColor;
        console.log("Hair color:", hairColor);
    });

    document.getElementById('set-eyecolor').addEventListener('click', () => {
        eyeColor = colorToSave;
        colors.eyeColor = eyeColor;
        console.log("Eye color:", eyeColor);
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
                body: JSON.stringify(colors)
            });
    
            if (response.ok) {
                const result = await response.text();
                localStorage.setItem('result', result);
                window.location.href = 'result.html';
            } else {
                console.error("Error fetching AI result:", response.statusText);
            }
        } catch (error) {
            console.error("Error sending request:", error);
        }
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
                body: JSON.stringify(colors)
            });

            if (response.ok) {
                const result = await response.text();
                localStorage.setItem('result', result);
                window.location.href = 'result.html';
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
});
