// IN5320, Fall 2020, Nora Skjelstad
let countryList = document.querySelector("#countryList");
let form = document.querySelector('form');
let searchWord;
let population;
let today;
let tomorrow;
let inputArray = [];
let matchList = [];

/* 
This function creates input-variable, add it to a list of inputs, stores it in th browser memory, resets the input field and lastly display the list of input. 
*/ 
function addButtonEventHandler(){
    let input = document.getElementById("userInput").value;
    inputArray.push(input);
    offlineStorage(inputArray);

    document.getElementById("userInput").value = "";
    chooseDisplay("")
}

/*
This function activates whenever user types in the search field. The input is fetched in the parameter and an eventListener updates the display depending on the user input. The list of matches is zeroed out to handle the dynamics of the user input.

        parameter: search (<input>)
*/
function searchFieldEventHandler(search){
    searchWord = search.value;
    matchList = [];

    form.addEventListener("input", chooseDisplay(searchWord));
}

/*
This function updates the shown ul.list based on what input the user sends in.

    parameter: inputString (String) - The search word as string-format.
*/
function chooseDisplay(inputString){
    // If the user sends in something searchable, it will launch display() based on the matches for that seach word, which again will update the display accordingly.
    if(inputString.length != 0){
        searchFor(inputString.toLowerCase());
        display(matchList); 
    
    // If the user sends in nothing or deletes everything in the search field, it will launch display() based on all the countries added to the list.
    }else if(inputString == ""){
        display(inputArray);

    // If the user types in something in the search field that is not to be found in the ul-list, it will lauch resetDisplay() which removes all list items and displays nothing.
    }else if(matchList.length == 0 && inputString.length != 0){
        resetDisplay();
    }
}

// Removes all list items.
function resetDisplay(){
    while(countryList.firstChild){
        countryList.removeChild(countryList.firstChild);
    }
}

/*
First the function reserts the display to create a new one for the sake of dynamics. Then it goes through each element of an array (could be either inputArray or matchList), fetches data from the Population.io API and then initiates another function - setLiHTML - that creates HTML-content based on the input and the API-data.

    parameter: array (Array)
*/ 
function display(array){
    resetDisplay();

    array.forEach(input =>{
        $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + input + "/today-and-tomorrow/").done(function(data){
            // Data from the API is set to some values.
            let todayD = data.total_population[0].population;
            let tomorrowD = data.total_population[1].population;

            setLiHTML(countryList, todayD, input); 
            /*
            Okey, so my idea was to update the innerHTML based on and updated population each time display() is called.

            if(population == undefined){
                setLiHTML(countryList, todayD, input); 
            }else{
                setLiHTML(countryList, population, input);
            }
            // Here I tried to set the API-data to global variables.
            today = todayD;
            tomorrow = tomorrowD; */
        })
    })
}

// Creates HTML content for an element.
function setLiHTML(element, population, country){
    element.innerHTML += "<li id='country'>" + country + " - " + population + "<button id='deleteButton'>X</button> </li>";
}

/* 
Function that is supposed to update the population variable incrementally with the average population update each millisecond.

    parameter: today (Integer) - The current population count
    parameter: populationEachMillisecond (Integer) - from function eachMillisecond() 
*/
function populationUpdate(today, populationEachMillisecond){
    population = today + populationEachMillisecond;
}

/*
Function that takes in the population values for today and tomorrow from the Population.io API, calculates the difference between today and tomorrow, and then calculates the average population rise each milliseconds. Lastly it returns the average population rise each milliseconds as a float with 2 decimals.

    parameter: today (Integer) - The population today (from population.io API)
    parameter: tomorrow (Integer) - The population tomorrow (from population.io API)

    returns: popEachMillisecond (Float) - Average rise of population each millisecond.

*/
function eachMillisecond(today, tomorrow){
    let allNewPopInADay = tomorrow - today;
    // There are 86.400 seconds in 24 hours.
    let popEachMillisecond = allNewPopInADay / 86400;
    return parseFloat(popEachMillisecond.toFixed(2));
}

/*
Function that first checks if the search word is not empty, then checks if the list-element mathes a search input. Returns true if it does,false if it doesn't.

    parameter: li (String) - list-element by name.
    parameter: searchWord (String) - User search input.

    returns: Boolean
*/
function checkSearchTerm(li, searchWord){
    if(searchWord != ""){
        return li.toLowerCase().startsWith(searchWord); 
    }else{
        return false;
    }
}

/*
Function that takes in user input, interates through inputArray to find input elements that matches the user input. The function returns an array with string of the matches found.

    parameter: searchWord (String) - User search input.
*/ 
function searchFor(searchWord){
    inputArray.forEach(input =>{
        if(checkSearchTerm(input, searchWord) == true){
            matchList.push(input);
        }
    })
}

/*
Function that initiates when the delete-button is clicked. It will remove the corresponding <li>-element, remove it from inputArray and remove it from the storage.
*/
$("#countryList").on('click', '#deleteButton', function(e){
    $(this).parent().remove();
    inputArray.splice($(this).parent());
    let remove = $(this).parent().text();
    sessionStorage.removeItem(remove);
});

/*
Checks if browser supports for localStorage or sessionStorage. If not browser will return "undefined" to this function and it will not be execued (elements will not be stored). If function does find support for Storage it will add an element (string) to sessionStorage.

    parameter: element (String) - Element to be set in sessionStorage
*/ 
function setBrowserStorage(element){
    if(typeof(Storage) !== "undefined"){
        sessionStorage.setItem(element, JSON.stringify(element));  
   }else {
       alert("No web storage support.")
   }
}

/*
Iterates through elements (string) in inputArray and runs function setBrowserStorage() on them.

    parameter: inputArray (Array) - Array of all input
*/
function offlineStorage(inputArray){
    for(let i = 0; i < inputArray.length; i++){
        setBrowserStorage(inputArray[i]);
    }
}

// Couldn't quite figure out how to make the script update each second.
setInterval(populationUpdate(population, eachMillisecond(today, tomorrow)), 1000);