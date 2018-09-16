const clarifai = new Clarifai.App({
    apiKey: 'c56d788447e649a9898cab58c3058774'
});

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {

        let imageHolder = document.getElementById("uploadedImages");
        let baseDiv = document.createElement("div");
        let img = document.createElement("img");
        img.src = reader.result;
        imageHolder.appendChild(img);
        console.log('READER', reader.result.substr(23));

        clarifai.models.predict("bd367be194cf45149e75f01d59f77ba7", {
            base64: reader.result.substr(23)
        }).then(
            function (response) {
                response.outputs[0].data.concepts.forEach(element => {
                    console.log(element);
                });
            },
            function (err) {
                alert("ERROR:\n" + err);
            }
        );
    }
    reader.readAsDataURL(file);
}
