// Top 10 predictions considered
const NUM_MAX_RESPONSES = 10;

const modal = document.getElementById("modal");

const clarifai = new Clarifai.App({
    apiKey: 'c56d788447e649a9898cab58c3058774'
});

let clarifai_query = [];

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {

        let imageHolder = document.getElementById("uploadedImages");
        let baseDiv = document.createElement("div");
        let img = document.createElement("img");
        img.src = reader.result;
        imageHolder.appendChild(img);

        clarifai.models.predict("bd367be194cf45149e75f01d59f77ba7", {
            base64: reader.result.substr(23)
        }).then(
            function (response) {
                let selector = document.getElementById("pred_select");
                for (let i = 0; i < Math.min(NUM_MAX_RESPONSES, response.outputs[0].data.concepts.length); i++) {
                    let element = response.outputs[0].data.concepts[i].name;
                    console.log(element);
                    let choice = document.createElement("button");
                    choice.addEventListener("click", () => {
                        clarifai_query.push(element);
                        let selector = document.getElementById("pred_select");

                        while (selector.hasChildNodes())
                            selector.removeChild(selector.firstChild);

                        console.log(clarifai_query);
                        modal.style.display = "none";
                    });
                    choice.value = element;
                    choice.innerText = element.replace(/^\w/, c => c.toUpperCase());

                    selector.appendChild(choice);
                }

                modal.style.display = "flex";

            },
            function (err) {
                alert("ERROR:\n" + err);
            }
        );
    }
    reader.readAsDataURL(file);
}
