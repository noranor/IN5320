let countryList = document.querySelector("#countryList");
let form = document.querySelector('form');
let searchWord;
let inputArray = [];
let matchList = [];

/**
 *      This function initiates what will happen when user adds countries to list. The population 
 *      API will be fetched, data from the API to the corresponding country will be contected to 
 *      the country added.
 */
function addButtonEventHandler(){
   
    // THIS FUNCTION DOES NOT!!!! TOUCH COUNTRY LIST AT ALL
   
    let input = document.getElementById("userInput").value;
    inputArray.push(input);
    console.log("inputArray -> ", inputArray);

    document.getElementById("userInput").value = "";
    offlineStorage(inputArray);
    display();
}
    
/**
 *      This function initiates what will happen when the user types in the search field. It will 
 *      intitate the updateDisplay-function based on matched search.
 * 
 * 
 *      @param {searchWord (String) User input to be searched}
 *      @return N/A
 */
function searchFieldEventHandler(searchedWord){
    searchWord = searchedWord;
    matchList.splice(0, matchList.length);
    //console.log(searchWord.value);
    // THIS FUNCTION DOES NOT!!! TOUCH COUNTRY LIST

    form.addEventListener("input", function(){
        searchWordL = searchWord.value.toLowerCase();
        console.log("searchWord lengde  = ", searchWordL.length)
        if(searchWordL.length != 0){
            matchList = searchFor(searchWordL);
            console.log("Matchlist -> ", matchList);
            display();  
        }else{
            console.log("Dette skal skje når jeg sletter ting fra søkefeltet");
            display();
        }
        //matchList = searchFor(searchWordL);
        //console.log("Matchlist -> ", matchList);
        
    });
    //matchList.splice(0, matchList.length);
    //console.log("MatchList reset? --> ", matchList);
    //document.getElementById("searchInput").value = "";
}

function display(){
    console.log("\n-----")
    console.log("======= Start of display")
    while(countryList.firstChild){
        countryList.removeChild(countryList.firstChild);
    }
    //console.log("inputArray", inputArray)
     /// THIS FUNCTION ONLYY!!! CREATES COUNTRY LIST, BASED ON INTERNAL LIST. MAY PRINT SUBSET (MATCHED)
    // if search box is empty
    if(searchWord == undefined || searchWord == "" && matchList.length == 0){
        console.log("--> Entering 1st IF")
//        inputArray.forEach(function(stringInput){
        inputArray.forEach(stringInput => {
            $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + stringInput + "/today-and-tomorrow/").done(function(data){
            // According to the API format. 
                let today = data.total_population[0].population;
                let tomorrow = data.total_population[1].population;
                countryList.innerHTML += "<li id='country'>" + stringInput + " - " + today + "<button id='deleteButton'>X</button> </li>";
            })
        })
    }else if(searchWord != undefined || searchWord == "" && matchList.length == 0){
        console.log("--> Entering 2nd IF")
        inputArray.forEach(stringInput => {
            $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + stringInput + "/today-and-tomorrow/").done(function(data){
            // According to the API format. 
                let today = data.total_population[0].population;
                let tomorrow = data.total_population[1].population;
                countryList.innerHTML += "<li id='country'>" + stringInput + " - " + today + "<button id='deleteButton'>X</button> </li>";
            })
        })
    }else if(searchWord != undefined && matchList.length != 0){
        console.log("--> Entering 3rd IF")
        matchList.forEach(matchingInput => {
            $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + matchingInput + "/today-and-tomorrow/").done(function(data){
            // According to the API format. 
                let today = data.total_population[0].population;
                let tomorrow = data.total_population[1].population;
                countryList.innerHTML += "<li id='country'>" + matchingInput + " - " + today + "<button id='deleteButton'>X</button> </li>";
            })
        })
        matchList = [];
        // DRAW LIST SHOWING MATCHED COUNTRIES --- NO EVENT HANDLERS
    }else{
        console.log("NO match on searchWord ", searchWord)
        for(let i = 0; i < countryList.getElementsByTagName("li").length; i ++){
            countryList.getElementsByTagName("li")[i].innerHTML += "";
        }
    }
    console.log("======= End of display")
    // if search box is empty and there are no matching results
      // DRAW LIST SHOWING ALL COUNTRIES --- NO EVENT HANDLERSs
    // if search box is not empty, and there are matching results
    // if search box is empty and there are no matching results
    /*if(searchWord != undefined || searchWord != "" && matchList.length == 0){
        console.log("NO match on searchWord ", searchWord)
        for(let i = 0; i < countryList.getElementsByTagName("li").length; i ++){
            countryList.getElementsByTagName("li")[i].innerHTML += "";
        }
        // DONT DRAW A LIST AT ALL!!! --- NO EVENT HANDLERS
    }*/
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
    console.log("Checking search term; ", searchWord);
    if(searchWord != "" || searchWord != undefined){
        if(li.toLowerCase().startsWith(searchWord.toLowerCase())){
            return true;
        }else{
            return false;
        }
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
    //let list = countryList.getElementsByTagName("li");
    //let matches = [];
    inputArray.forEach(function(input){
        if(checkSearchTerm(input, searchWord) == true){
            matchList.push(input);
            //console.log("Pushed ", input, " to matchList");
        }
    })
    //console.log("Matches: ",matchList)
    return matchList;
}
/**
 *      Function that initiates when the delete-button is clicked. It will remove the corresponding 
 *      <li>-element and remove it from the storage.
 */
$("#countryList").on('click', '#deleteButton', function(e){
    $(this).parent().remove();
    inputArray.splice($(this).parent());
    let remove = $(this).parent().text();
    sessionStorage.removeItem(remove);
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
        //console.log("Running sessionStorage for ", inputArray[i]);
        setBrowserStorage(inputArray[i]);
    }

}
