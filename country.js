let inputArray = [];
let matchesIndex = [];
const countryList = document.getElementById("countryList");

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
    let inputTxt = document.createTextNode(input);

    inputArray.push(input);

    li.appendChild(inputTxt);
    createButtonForLi(li);
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

    for (let i = 0; i < countryList.getElementsByTagName("li").length; i++){
        let current = countryList.getElementsByTagName("li")[i].firstChild.textContent;
        
        let currentLowerCase = current.toLowerCase();

        console.log("(", i, ")", "Is " + current + " a match?");

        if (currentLowerCase.startsWith(searchTerm)){
            console.log("Yes!");
            matchesIndex.push(i);
            console.log("Indexes of marching elements: " + matchesIndex);
        }
    }
    return matchesIndex;
}

/**
 *      If user input in the search field this function will activate and alter the list displayed 
 *      on the screen according to the user input.
 * 
 *      @param {searchTerm (String) - User input that activates the function}
 *      @return N/A
 */
function displayList(indicies){
    console.log("Enters function displayList");
    for(let i = 0; i < countryList.getElementsByTagName("li").length; i++){
        console.log("Running displayList for-loop");
        indicies.forEach((index) =>{
            console.log("Running displayList forEach-loop");
            if(i != index){
                console.log("Trying to hide an element");
                countryList.getElementsByTagName("li")[i].style.display = "none";
            }
        })
    }
}

function generateCountryList(inputArray){
    inputArray.forEach((input) =>{
        addNewLiToUl(countryList, input);
    });
}

/// FORSLAG

// Does things when "add" button has been pressed
function addButtonEventHandler(){
    let input = document.getElementById("userInput").value;
    addNewLiToUl(countryList, input);
    // lage countrylist basert på inputarray
    console.log("Added new li");

    document.getElementById("userInput").value = "";
}

// Does things when search field has been changed in some way
function searchFieldEventHandler(){
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    indicies = searchFor(searchTerm);
    displayList(indicies);
}

// Function which updates which items are going to be displayed to the user
// Takes arguement indices = [0, 1, ..., N-1] or indices = [4] or indices = []
// Must handle empty list being due to either no search term being present OR search yielding no match 
function updateListDisplay(indices, searchTerm){
    if (indices.length == 0  && searchTerm == ""){
        console.log("Vanlig countrylist");
        // Display COUNTRY LIST!!!
    }
    else if (indices.length == 0) {
        console.log("Ingen matcher");
        countryList.style.display = "hidden";

        // No matches! display nothing
    }else{
        console.log("Matcher");
        displayList(indicies);

        // Display matching terms (using the indices list), yielding a subset of countryList
    }
}