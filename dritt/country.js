let inputArray = [];
let matchesIndex = [];
const countryList = document.querySelector('#countryList');
/*const url = {
    url: 'https://d6wn6bmjj722w.population.io/1.0/population/Norway/today-and-tomorrow/',
    accept: 'application/json'
}*/
let pop = 0;

/**
 *      This function creates a button with the text "X". Gives the button a delete functionality 
 *      when clicked. Then the button is connected to a specific <li>.
 * 
 *      @param {li (<li> element in ul)} 
 *      @return {button (Object)} 
 */
function createButtonForLi(li){
    const button = document.createElement("button");
    button.innerHTML = " X";

    button.addEventListener("click", function removeButton(e){
        button.parentNode.parentNode.removeChild(button.parentNode);
        inputArray.splice(inputArray.indexOf(button.parentNode));
        // FIX: Doesn't work yet.
        sessionStorage.removeItem(e)
    });

    li.appendChild(button);

    return button;
}

/**
 *      Takes the user input, creates an element (li) and set the user input to the element.
 * 
 *      @param {ul (Unordered list of <li>)} 
 *      @return: N/A 
 */
function addNewLiToUl(ul, input){
    let li = document.createElement("li");
    li.className = "countryInput";
    let inputTxt = document.createTextNode(input);

    inputArray.push(input);

    li.appendChild(inputTxt);
    createButtonForLi(li);

    // .done() for success
    $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + input + "/today-and-tomorrow/").done(function(data){
        // According to the API format. 
        let today = data.total_population[0].population;
        let tomorrow = data.total_population[1].population;

        console.log(today);
    })
    ul.appendChild(li);

    offlineStorage(inputArray);
}
/**
 *      Checks if browser supports for localStorage or sessionStorage. If not browser will return
 *      "undefined" to this function and it will not be execued (elements will not be stored). If
 *      function does find support for Storage it will add an element (string) to sessionStorage.
 * 
 *      @param {element (String) - Element to be set in sessionStorage} 
 *      @return N/A
 */
function setBrowserStorage(element){
    if (typeof(Storage) !== "undefined") {
        sessionStorage.setItem(element, JSON.stringify(element));  
   } else {
       alert("No web storage support.")
   }
}
/**
 *      Iterates through elements (string) in inputArray and runs function setBrowserStorage() 
 *      on them.
 * 
 *      @param {inputArray (Array) - Array of all input}
 *      @return N/A  
 */
function offlineStorage(inputArray){
    for(let i = 0; i < inputArray.length; i++){
        console.log("Running setBrowserStorage, sessionStorage for " + inputArray[i]);
        setBrowserStorage(inputArray[i]);
    }

}
/**
 *      Function that takes in user input, interates through countryList to find <li> elements that 
 *      matches the user input. The function returns an array with int that represents the indexes
 *      of matching <li>'s in countryList.
 * 
 *      @param {searchTerm (String) - Input text to be searched for} 
 *      @return {matchesIndex (Integer) Index of <li> in countryList that match the searchTerm} 
 */
function searchFor(searchTerm){
    searchTerm = searchTerm.value.toLowerCase();
    let list = countryList.getElementsByTagName("li");

    for (let i = 0; i < list.length; i++){
        let current = list[i].firstChild.textContent;
            //let currentLowerCase = current.toLowerCase();

        console.log("(", i, ")", "Is " + current + " a match?");

        if (current.startsWith(searchTerm) && searchTerm != ""){
            console.log("CHECK");
            list[i].style.display = "list-item";
            console.log("Showing - " + current);
        }else if(current.startsWith(searchTerm) == false){
            console.log("CHECK2");
            console.log("Hiding - " + current);
            list[i].style.visibility = "hidden";
        }else{
            // DOESNT WORK
            console.log("CHECK3");
            $("countryList li").show();
        }
    }
}


function getMatchesIndex(searchTerm){
    searchTerm = searchTerm.value.toLowerCase();
    let list = countryList.getElementsByTagName("li");
    for (let i = 0; i < list.length; i++){
        let current = list[i].firstChild.textContent;
        let currentLowerCase = current.toLowerCase();

        console.log("(", i, ")", "Is " + current + " a match?");
        if (currentLowerCase.startsWith(searchTerm.toLowerCase())){
            console.log("YES!");
            matchesIndex.push(i);
        }
    }
    return matchesIndex;
}


// Does things when "add" button has been pressed
function addButtonEventHandler(){
    let input = document.getElementById("userInput").value;
    addNewLiToUl(countryList, input);
    // lage countrylist basert på inputarray
    console.log("Added new li");

    document.getElementById("userInput").value = "";
}

// Does things when search field has been changed in some way
function searchFieldEventHandler(searchTerm){
    searchTerm.addEventListener("keyup", function(){
        //let searchTerm = document.getElementById("searchInput");
        searchFor(searchTerm);
    });
}

// Function which updates which items are going to be displayed to the user
// Takes arguement indices = [0, 1, ..., N-1] or indices = [4] or indices = []
// Must handle empty list being due to either no search term being present OR search yielding no match 

function updateListDisplay(indices, searchTerm){
    // 1. Viser alt
    if (indices.length == 0  && searchTerm == ""){
        console.log("Vanlig countrylist");
        for(let i = 0; i < countryList.length; i++){
            countryList.style.display = "list-item";
        }

    // 2. Viser ingenting
    }else if (indices.length == 0) {
        console.log("Ingen matcher");
        searchFor(searchTerm);
        //searchFieldEventHandler();

    // 3. No matches! display nothing
    }else{
        console.log("Matcher");
        searchFor(searchTerm);

        // Display matching terms (using the indices list), yielding a subset of countryList
    }
}

/*
MÅ GJØRES:

Lage et eget array for updateListDisplay. 
- Arrayet er de <li>-nodene som vises på skjermen. 

- 1. Arrayet vil vise seg med all input/<li> dersom søkefeltet er tomt og/eller det ikke er noen matcher på søkefelt - Ikke søkt etter noe.
- 2. Arrayet vil vise seg helt tomt dersom det ikke er noen matcher.
- 3. Arrayet vil vise de <li>-nodene som matcher dersom søkefeltet gir treff.

Endre konstanten countryList til at den skal være udefinert. Se over metoder om den blir kastet inn i sin helhet uten å være ul-parameter. Dersom det heller brukes parameter, gjør det funksjonene mer generelle.*/
