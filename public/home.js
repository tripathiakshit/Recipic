// Top 10 predictions considered
const NUM_MAX_RESPONSES = 10;

const modal = document.getElementById("modal");
const loader = document.getElementById("loading_spinner");
const recipe_placeholder = document.getElementById("recipe_placeholder");

const clarifai = new Clarifai.App({
    apiKey: 'c56d788447e649a9898cab58c3058774'
});

let clarifai_query = [];

// Convert image to Base64 to send to Clarifai
function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {

        let imageHolder = document.getElementById("uploadedImages");

        // Create an image and set its src to the Base64 data. Add this image to the image strip
        let img = document.createElement("img");
        img.src = reader.result;
        imageHolder.appendChild(img);

        // Call clarifai with the data and get results
        clarifai.models.predict("bd367be194cf45149e75f01d59f77ba7", {
            base64: reader.result.substr(23)
        }).then(
            function (response) {
                // If results are true, add top 10 results as selection chips to modal
                let selector = document.getElementById("pred_select");
                for (let i = 0; i < Math.min(NUM_MAX_RESPONSES, response.outputs[0].data.concepts.length); i++) {
                    let element = response.outputs[0].data.concepts[i].name;
                    let choice = document.createElement("button");
                    choice.addEventListener("click", () => {

                        // If this chip is selected, add its item to the query list, and destroy chips in the modal
                        clarifai_query.push(element);
                        let selector = document.getElementById("pred_select");

                        clearChildren(selector);

                        console.log(clarifai_query.toString());

                        // Hide the modal and call Edamam API to get recipes
                        modal.style.display = "none";

                        getRecipeData();

                    });
                    choice.value = element;
                    choice.innerText = element;

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

function getRecipeData() {
    // Clear previous recipe list and display loader
    let recipeList = document.getElementById("recipes");
    clearChildren(recipeList);

    loader.style.display = "block";
    recipe_placeholder.style.display = "block";
    recipe_placeholder.innerText = "Loading...";

    let clarifai_request = new XMLHttpRequest();
    clarifai_request.addEventListener("loadend", (response) => {
        loadRecipeData(response.currentTarget.responseText);
    });

    clarifai_request.open("GET",
        "https://api.edamam.com/search?q=" +
        clarifai_query.toString() +
        "&app_id=2975d92a&app_key=ac7be2df3bd3c4628e30389a935b2cf8");

    clarifai_request.send();
}

function loadRecipeData(res) {
    let recipeList = document.getElementById("recipes");
    let data = JSON.parse(res);

    loader.style.display = "none";
    recipe_placeholder.style.display = "none";

    data.hits.forEach(element => {
        // Create div to hold recipe
        let recipeContainer = document.createElement("div");
        recipeContainer.classList.add("recipe");
        // recipeContainer.addEventListener("click", () => {
        //     location.href = element.recipe.url;
        // });

        // Create recipe image
        let recipeImage = document.createElement("img");
        recipeImage.classList.add("recipeImage");
        recipeImage.src = element.recipe.image;

        let recipeInfo = document.createElement("div");
        recipeInfo.classList.add("recipeInfo");

        // Create recipe title text
        let recipeTitle = document.createElement("span");
        recipeTitle.classList.add("recipeTitle");
        recipeTitle.innerText = element.recipe.label;

        // Create recipe source text
        let recipeSource = document.createElement("span");
        recipeSource.classList.add("recipeSource");
        recipeSource.innerText = "by " + element.recipe.source;

        // Add all elements to container
        recipeContainer.appendChild(recipeImage);
        recipeInfo.appendChild(recipeTitle);
        recipeInfo.appendChild(recipeSource);
        recipeContainer.appendChild(recipeInfo);

        // Add container to recipes
        recipeList.appendChild(recipeContainer);

        console.log(element.recipe.label + " by " + element.recipe.source);
    });
}

function clearChildren(obj) {
    while (obj.hasChildNodes())
        obj.removeChild(obj.firstChild);
}
