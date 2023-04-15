const imageInputElement = document.getElementById("imageFileInput");
imageInputElement.addEventListener("change", showImage, false);

const image = new Image();
image.addEventListener("load", putImageInCanvas, false);

const T2ISelectButton = document.getElementById("T2ISelectButton");
T2ISelectButton.addEventListener("click", clickInput, false);

const T2IHideButton = document.getElementById("T2IHideTextButton")
T2IHideButton.addEventListener("click", putTextIntoImage, false);

function showImage() {
    // Get image to use as medium for message
    const imageFile = this.files[0];
    const imageURL = window.URL.createObjectURL(imageFile);

    // Activate putImageInCanvas Event Listener
    image.src = imageURL;

    // Show image
    const T2IBeforeImage = document.getElementById("T2IBeforeImage");
    T2IBeforeImage.src = imageURL;
    T2IBeforeImage.width = 200;
    T2IBeforeImage.height = 200;
}

function putImageInCanvas() {
    const canvasElement = document.getElementById("imageCanvas");
    canvasElement.height = this.height;
    canvasElement.width = this.width;
    const context = canvasElement.getContext("2d");
    context.drawImage(this, 0, 0);
}

function putTextIntoImage() {
    // Get ImageData from canvas
    const canvasElement = document.getElementById("imageCanvas");
    const context = canvasElement.getContext("2d");
    const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);

    // Get text from T2ITextArea and UTF-8 encode it.
    const textInputElement = document.getElementById("T2ITextArea");
    const textString = textInputElement.value;
    const textEncoder = new TextEncoder();
    const textStringEncoded = textEncoder.encode(textString);
    
    // Check if image is big enough to hold text
    imageDataAvailabeMemory = 4 * imageData.width * imageData.height;
    textNeededMemory = 8 * textStringEncoded.length;
    if (textNeededMemory > imageDataAvailabeMemory) {
        alert("Text is too long for image provided!");
        return;
    }

    for (let index = 0; index < textNeededMemory; index++) {
        currentByte = Math.floor(index/8);
        currentBit = index % 8;
        imageData.data[index] = (imageData.data[index] & 254) + ((textStringEncoded[currentByte] >> currentBit) & 1)
    }

    context.putImageData(imageData, 0, 0);
    outputImageURL = canvasElement.toDataURL();

    // Show image
    const T2IAfterImage = document.getElementById("T2IAfterImage");
    T2IAfterImage.src = outputImageURL;
    T2IAfterImage.width = 200;
    T2IAfterImage.height = 200;
    
    const T2IDowloadLink = document.getElementById("T2IDowloadLink");
    T2IDowloadLink.href = outputImageURL;
}

function clickInput() {
    imageInputElement.click();
}


