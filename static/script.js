document.getElementById('process-btn').addEventListener('click', async function() {
    // Create a new FormData object from the 'upload-form' HTML form
    const formData = new FormData(document.getElementById('upload-form'));

    // Send a POST request to the server endpoint ('/') with the FormData containing the uploaded image
    const response = await fetch('/', {
        method: 'POST',
        body: formData
    });

    // Parse the JSON response received from the server
    const data = await response.json();

    // Get the result div element by its ID
    const resultDiv = document.getElementById('result');
    // Clear the result div before appending new content
    resultDiv.innerHTML = '';

    // Create new Image objects for each processed image type: sketch, mosaic, and cartoon
    const sketchImg = new Image();
    const mosaicImg = new Image();
    const cartoonImg = new Image();

    // Define the 'onload' event handler for the sketch image
    sketchImg.onload = function() {
        // Create a container div for sketch image and its button
        const sketchContainer = document.createElement('div');
        sketchContainer.classList.add('image-container');
        
        // Append the sketch image to the container div with a class for styling
        sketchImg.classList.add('sketch-image');
        sketchContainer.appendChild(sketchImg);

        // Create and append download button for sketch image
        const sketchDownloadBtn = createDownloadButton(sketchImg.src, 'sketch.png', 'Download Sketch');
        sketchDownloadBtn.classList.add('sketch-download-button');
        sketchContainer.appendChild(sketchDownloadBtn);

        // Append the container div to the result div
        resultDiv.appendChild(sketchContainer);

        // Define the 'onload' event handler for the mosaic image
        mosaicImg.onload = function() {
            // Create a container div for mosaic image and its button
            const mosaicContainer = document.createElement('div');
            mosaicContainer.classList.add('image-container');

            // Append the mosaic image to the container div with a class for styling
            mosaicImg.classList.add('mosaic-image');
            mosaicContainer.appendChild(mosaicImg);

            // Create and append download button for mosaic image
            const mosaicDownloadBtn = createDownloadButton(mosaicImg.src, 'mosaic.png', 'Download Mosaic');
            mosaicDownloadBtn.classList.add('mosaic-download-button');
            mosaicContainer.appendChild(mosaicDownloadBtn);

            // Append the container div to the result div
            resultDiv.appendChild(mosaicContainer);

            // Define the 'onload' event handler for the cartoon image
            cartoonImg.onload = function() {
                // Create a container div for cartoon image and its button
                const cartoonContainer = document.createElement('div');
                cartoonContainer.classList.add('image-container');

                // Append the cartoon image to the container div with a class for styling
                cartoonImg.classList.add('cartoon-image');
                cartoonContainer.appendChild(cartoonImg);

                // Create and append download button for cartoon image
                const cartoonDownloadBtn = createDownloadButton(cartoonImg.src, 'cartoon.png', 'Download Cartoon');
                cartoonDownloadBtn.classList.add('cartoon-download-button');
                cartoonContainer.appendChild(cartoonDownloadBtn);

                // Append the container div to the result div
                resultDiv.appendChild(cartoonContainer);
            };
            // Set the 'src' attribute of the cartoon image with the base64-encoded cartoon data received from the server
            cartoonImg.src = 'data:image/png;base64,' + data.cartoon;
        };
        // Set the 'src' attribute of the mosaic image with the base64-encoded mosaic data received from the server
        mosaicImg.src = 'data:image/png;base64,' + data.mosaic;
    };
    // Set the 'src' attribute of the sketch image with the base64-encoded sketch data received from the server
    sketchImg.src = 'data:image/png;base64,' + data.sketch;
});

// Function to create download button
function createDownloadButton(imageUrl, filename, buttonText) {
    const downloadBtn = document.createElement('a');
    downloadBtn.textContent = buttonText;
    downloadBtn.classList.add('download-button');
    downloadBtn.href = imageUrl;
    downloadBtn.download = filename;
    return downloadBtn;
}

function displayFileName() {
    const fileInput = document.getElementById('file-input');
    const fileNameSpan = document.getElementById('file-name');
    if (fileInput.files.length > 0) {
        fileNameSpan.textContent = fileInput.files[0].name;
    } else {
        fileNameSpan.textContent = 'No file chosen';
    }
}
