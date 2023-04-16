const T2IImageInputElement = document.getElementById("T2IImageFileInput");
T2IImageInputElement.addEventListener("change", T2IShowImage, false);

const T2IImage = new Image();
T2IImage.addEventListener("load", putImageInCanvas, false);

const T2ISelectButton = document.getElementById("T2ISelectButton");
T2ISelectButton.addEventListener("click", T2IClickInput, false);

const T2IHideButton = document.getElementById("T2IHideTextButton")
T2IHideButton.addEventListener("click", putTextIntoImage, false);

function T2IShowImage() {
    // Get image to use as medium for message
    const imageFile = this.files[0];
    const imageURL = window.URL.createObjectURL(imageFile);

    // Activate putImageInCanvas Event Listener
    T2IImage.src = imageURL;

    // Show image
    const T2IBeforeImage = document.getElementById("T2IBeforeImage");
    T2IBeforeImage.src = imageURL;
    T2IBeforeImage.width = 200;
    T2IBeforeImage.height = 200;
}

function putImageInCanvas() {
    const canvasElement = document.getElementById("T2IImageCanvas");
    canvasElement.height = this.height;
    canvasElement.width = this.width;
    const context = canvasElement.getContext("2d");
    context.drawImage(this, 0, 0);
    console.log(context.getImageData(0, 0, canvasElement.width, canvasElement.height).data);
}

function putTextIntoImage() {
    // Get ImageData from canvas
    const canvasElement = document.getElementById("T2IImageCanvas");
    const context = canvasElement.getContext("2d");
    const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
    console.log("Start");
    console.log(imageData.data);

    // Get text from T2ITextArea and UTF-8 encode it.
    const textInputElement = document.getElementById("T2ITextArea");
    const textString = textInputElement.value;
    const textEncoder = new TextEncoder();
    const textStringEncoded = textEncoder.encode(textString);

    console.log(textStringEncoded);
    
    // Check if image is big enough to hold text
    imageDataAvailabeMemory = 3 * imageData.width * imageData.height;
    textNeededMemory = (8 * textStringEncoded.length) + 8;
    if (textNeededMemory > imageDataAvailabeMemory) {
        alert("Text is too long for image provided!");
        return;
    }
    
    // Turns image opaque
    for (let index = 3; index < imageData.data.length; index=index+4) {
        imageData.data[index] = 255;
    }
    //Puts data into image
    let correction = 0;
    for (let index = 0; index < textNeededMemory-8; index++) {
        currentByte = Math.floor(index/8);
        currentBit = index % 8;
        correction = Math.floor((index+correction+1)/4);
        imageData.data[index+correction] = (imageData.data[index+correction] & 254) + ((textStringEncoded[currentByte] >> currentBit) & 1);
    }
    // Puts a NULL character at the end.
    correction = 0;
    for (let index = textNeededMemory-8; index < textNeededMemory; index++) {
        correction = Math.floor((index+correction+1)/4);
        imageData.data[index+correction] = (imageData.data[index+correction] & 254);
    }
    console.log("NULL")
    console.log(imageData.data)

    // Create new canvas and an URL for the output image
    const outputCanvas = document.createElement("canvas");
    outputCanvas.height = imageData.height;
    outputCanvas.width = imageData.width;
    const outputContext = outputCanvas.getContext("2d");
    outputContext.putImageData(imageData, 0, 0);
    outputImageURL = outputCanvas.toDataURL();

    console.log(outputContext.getImageData(0,0,outputCanvas.width,outputCanvas.height).data)

    // Show image
    const T2IAfterImage = document.getElementById("T2IAfterImage");
    T2IAfterImage.src = outputImageURL;
    T2IAfterImage.width = 200;
    T2IAfterImage.height = 200;
    
    const T2IDowloadLink = document.getElementById("T2IDowloadLink");
    T2IDowloadLink.href = outputImageURL;
}

function T2IClickInput() {
    T2IImageInputElement.click();
}

// From here on, it's I2T territory

const I2TSelectButton = document.getElementById("I2TSelectButton");
I2TSelectButton.addEventListener("click", I2TClickInput, false);

const I2TImageInputElement = document.getElementById("I2TImageFileInput");
I2TImageInputElement.addEventListener("change", I2TShowImage, false);

const I2TImage = new Image();
I2TImage.addEventListener("load", I2TPutImageInCanvas, false);

const I2TShowButton = document.getElementById("I2TShowTextButton");
I2TShowButton.addEventListener("click", showText, false);

function I2TClickInput() {
    I2TImageInputElement.click();
}

function I2TShowImage() {
    // Get image to use as medium for message
    const imageFile = this.files[0];
    const imageURL = window.URL.createObjectURL(imageFile);

    // Activate putImageInCanvas Event Listener
    I2TImage.src = imageURL;

    // Show image
    const I2TBeforeImage = document.getElementById("I2TBeforeImage");
    I2TBeforeImage.src = imageURL;
    I2TBeforeImage.width = 200;
    I2TBeforeImage.height = 200;
}

function I2TPutImageInCanvas() {
    const canvasElement = document.getElementById("I2TImageCanvas");
    canvasElement.height = this.height;
    canvasElement.width = this.width;
    const context = canvasElement.getContext("2d");
    context.drawImage(this, 0, 0);
    console.log(context.getImageData(0, 0, canvasElement.width, canvasElement.height).data);
}

function showText() {
    // Get ImageData from canvas
    const canvasElement = document.getElementById("I2TImageCanvas");
    const context = canvasElement.getContext("2d");
    const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
    console.log(imageData.data)

    const bytes = [];
    let currentByte = 0;
    let correction = 0;
    for (let index = 0; index < imageData.data.length; index++) {
        let currentBit = index % 8;
        correction = Math.floor((index+correction+1)/4);
        currentByte = currentByte + ((imageData.data[index+correction] & 1) << currentBit);
        if (currentBit == 7 && currentByte == 0){
            break;
        }
        if (currentBit == 7) {
            bytes.push(currentByte);
            currentByte = 0;
        }
    }
    const utf8Bytes = new Uint8ClampedArray(bytes);
    console.log(utf8Bytes);
    const textDecoder = new TextDecoder();
    const textStringDecoded = textDecoder.decode(utf8Bytes);
    console.log(textStringDecoded)

    const I2TTextArea = document.getElementById("I2TTextArea");
    I2TTextArea.value = textStringDecoded;
}