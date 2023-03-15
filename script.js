const imageInputElement = document.getElementById("imageFileInput");
imageInputElement.addEventListener("change", loadImage, false);

const image = new Image();
image.addEventListener("load", displayImage, false);

function loadImage() {
    const imageFile = this.files[0];
    const imageURL = window.URL.createObjectURL(imageFile);
    image.src = imageURL;
}

function displayImage() {
    const canvasElement = document.getElementById("imageCanvas");
    canvasElement.height = this.height;
    canvasElement.width = this.width;
    const context = canvasElement.getContext("2d");
    context.drawImage(this, 0, 0);

    const _imageData = context.getImageData(0, 0, this.width, this.height);
    console.log(_imageData.data);
}