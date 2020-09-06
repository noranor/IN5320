let countryList = document.getElementById("countryList");
let searchWord;
let inputArray = [];
let matchList = [];

/**
 *      This function initiates what will happen when user adds countries to list. The population 
 *      API will be fetched, data from the API to the corresponding country will be contected to the 
 *      country added.
 */
function addButtonEventHandler(){
   
    // THIS FUNCTION DOES NOT!!!! TOUCH COUNTRY LIST AT ALL
   
    let input = document.getElementById("userInput").value;
    inputArray.push(input);
    $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + input + "/today-and-tomorrow/").done(function(data){
            // According to the API format. 
        let today = data.total_population[0].population;
        let tomorrow = data.total_population[1].population;
        console.log("Population for ", input, " is ", today);

        countryList.innerHTML += "<li>" + input + " - " + today + "<button id='deleteButton'>X</button> </li>";

        offlineStorage(inputArray);
    })
    document.getElementById("userInput").value = "";
    display();
    //document.getElementById("userInput").value = "";
}
/**
 *      This function initiates what will happen when the user types in the search field. It will 
 *      intitate the updateDisplay-function based on matched search.
 * 
 * 
 *      @param {searchWord (String) User input to be searched}
 *      @return N/A
 */
function searchFieldEventHandler(searchWord){
    // THIS FUNCTION DOES NOT!!! TOUCH COUNTRY LIST

    searchWord.addEventListener("keyup", function(){
        if(searchWord != ""){
            searchWordL = searchWord.value.toLowerCase();
            matchList = searchFor(searchWordL);
            updateDisplay(matchList);
        }
    });

    display();
}

function display(){
     /// THIS FUNCTION ONLYY!!! CREATES COUNTRY LIST, BASED ON INTERNAL LIST. MAY PRINT SUBSET (MATCHED)
    // if search box is empty
    if(searchWord.value == "" && matchList.length == 0){
        inputArray.forEach(function(stringInput){
            $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + stringInput + "/today-and-tomorrow/").done(function(data){
            // According to the API format. 
                let today = data.total_population[0].population;
                let tomorrow = data.total_population[1].population;
                console.log("Population for ", stringInput, " is ", today);

                countryList.innerHTML += "<li>" + stringInput + " - " + today + "<button id='deleteButton'>X</button> </li>";
            })
        })
    }
      // DRAW LIST SHOWING ALL COUNTRIES --- NO EVENT HANDLERS
    // if search box is not empty, and there are matching results
    if(searchWord != "" && matchList.length != 0){
        matchList.forEach(function(index){
            $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + inputArray[index] + "/today-and-tomorrow/").done(function(data){
            // According to the API format. 
                let today = data.total_population[0].population;
                let tomorrow = data.total_population[1].population;
                console.log("Population for ", inputArray[index], " is ", today);

                countryList.innerHTML += "<li>" + inputArray[index] + " - " + today + "<button id='deleteButton'>X</button> </li>";
            })
        })
        // DRAW LIST SHOWING MATCHED COUNTRIES --- NO EVENT HANDLERS
    }
    // if search box is empty and there are no matching results
    if(searchWord != null && matchList.length == 0){
        countryList.innerHTML = "";
        // DONT DRAW A LIST AT ALL!!! --- NO EVENT HANDLERS
    }
}
/*
function hideAllElements(){
    let list = countryList.getElementsByTagName("li");
    for(let i = 0; i < list.length; i++){
        list[i].style.visibility = "hidden";
    }
    
}*/

/**
 *      This function alter the display of list elements based on search matches.
 * 
 *      @param {matchList (Array - Integer) - Array of indices where search match has been found} 
 *      @return N/A
 */
function updateDisplay(matchList){
    console.log("+++Updating display")
    let list = countryList.getElementsByTagName("li");
    console.log(list);
    for(let i = 0; i < list.length; i++){
        if(matchList.includes(i)){
            console.log("Showing ",list[i]);
            list[i].style.display = "list-item";
        }else{
            console.log("Hiding ",list[i]);
            list[i].style.visibility = "hidden";
        }
    }
}
/**
 *      Function that checks if the list-element mathes a search input. Returns true if it does, 
 *      false if it doesn't.
 * 
 *      @param {li (String) - Element in countryList} 
 *      @param {searchWord (String) - User input to be searched} 
 *      @return {Boolean}
 */
function checkSearchTerm(li, searchWord){
    if(li.toLowerCase().startsWith(searchWord.toLowerCase())){
        return true;
    }else{
        return false;
    }
}
/**
 *      Function that takes in user input, interates through countryList to find <li> elements that 
 *      matches the user input. The function returns an array with int that represents the indexes
 *      of matching <li>'s in countryList.
 * 
 *      @param {searchTerm (String) - Input text to be searched for} 
 *      @return {matches (Integer) - Index of <li> in countryList that match the searchTerm} 
 */
function searchFor(searchWord){
    let list = countryList.getElementsByTagName("li");
    //let matches = [];

    for (let i = 0; i < list.length; i++){
        console.log("checking: ", i)
        let current = list[i].textContent;

        if(checkSearchTerm(current, searchWord) == true){
            matchList.push(i);
        }
    }
    console.log("Matches: ",matchList)
    return matchList;
}
/**
 *      Function that initiates when the delete-button is clicked. It will remove the corresponding 
 *      <li>-element and remove it from the storage.
 */
$("#countryList").on('click', '#deleteButton', function(e){
    $(this).parent().remove();
    inputArray.splice($(this).parent());
    sessionStorage.removeItem($(this).parent());
});
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
        console.log("Running setBrowserStorage, sessionStorage for ", inputArray[i]);
        setBrowserStorage(inputArray[i]);
    }

}
