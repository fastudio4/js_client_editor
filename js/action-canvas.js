var image;
var imgObj = new Image();
var scaleImage = 1.0;
var imageAngle = 0;
var filterImage;
var canvas = new fabric.Canvas('base-layout', {
    preserveObjectStacking: true // disable bouncing layers on canvas
});
canvas.setHeight(400);
canvas.setWidth(400);
disabledEditor();

document.getElementById('load-image').onchange = function handleImage(e) {
    var nameImage = document.getElementById('load-image').files[0].name;
    if (securityFormat(nameImage.toLowerCase()) == true) {
        enableEditor();
        document.getElementById('error-loading-file').innerHTML = '';
        var reader = new FileReader();
        reader.onload = function (event) {
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                image = new fabric.Image(imgObj);
                image.set({
                    hasRotatingPoint: false,
                    zIndex: 999
                });
                image.left = canvas.width / 2 - image.width / 2;
                image.top = canvas.height / 2 - image.height / 2;
                canvas.add(image);
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    }
};


canvas.on('object:selected', function(options) {
    if (options.target.type == 'text') {
        console.log('Selected text')
    }
});

function disabledEditor() {
    var elements = document.getElementById("image-editor").getElementsByTagName('button');
    for(var i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
        elements[i].className = "btn btn-default btn-lg"
    }
    document.getElementById('add-image').className = "btn btn-warning btn-lg btn-file";
    document.getElementById('load-image').disabled = false;
}

function enableEditor() {
    var elements = document.getElementById("image-editor").getElementsByTagName('button');
    for(var i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
        elements[i].className = "btn btn-warning btn-lg"
    }
    document.getElementById('add-image').className = "btn btn-default btn-file btn-lg disabled";
    document.getElementById('load-image').disabled = true;
}

function removeImage() {
    canvas.remove(image);
    disabledEditor();
}

function pushImage() {
    if (scaleImage > 0 && scaleImage < 5) {
        scaleImage += 0.1;
        image.scale(scaleImage, scaleImage);
        canvas.centerObject(image);
        image.setCoords();
        canvas.renderAll();

    }
}

function pullImage() {
    if (scaleImage > 0.3 ) {
        scaleImage -= 0.1;
        image.scale(scaleImage, scaleImage);
        canvas.centerObject(image);
        image.setCoords();
        canvas.renderAll();
    }
}

function rotateImage() {
    imageAngle += 90;
    image.rotate(imageAngle);
    if (imageAngle > 360) {
        imageAngle = 0;
    }
    image.setCoords();
    canvas.renderAll();
}

function maskImage() {
    filterImage = document.getElementById('filter-image');
    filterImage.src = imgObj.src;
    filterImage.className = 'img-thumbnail'
}

function securityFormat(name) {
    var acceptFormat = 'jpg jpeg png';
    var nameFile = name.split('/').pop();
    var formatFile = name.split('.').pop();
    if (nameFile != formatFile) {
        if (acceptFormat.indexOf(formatFile) >= 0) {
            return true;
        }
        else {
            document.getElementById('error-loading-file').innerHTML = 'Недопустимый формат файла!';
            return false;
        }
    }
    else {
        document.getElementById('error-loading-file').innerHTML = 'Ошибка чтения файла!';
        return false;
    }
}

function addText() {
    var inputText = document.getElementById('text-input').value;
    if (document.getElementById('text-input').value != '') {
        document.getElementById('text-input').value = '';
        var text = new fabric.Text(inputText);
        text.left = canvas.width / 2 - text.width / 2;
        text.top = canvas.height / 2 - text.height / 2;
        canvas.add(text);
    }
}

function activeFilter() {
    filterImage.className = 'img-thumbnail' + ' ' + document.getElementById('filters').value;
}
