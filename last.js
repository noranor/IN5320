let countryList = document.querySelector("#countryList");
let form = document.querySelector('form');
let searchWord;
let population;
let inputArray = [];
let matchList = [];

function addButtonEventHandler(){
    let input = document.getElementById("userInput").value;
    inputArray.push(input);
    offlineStorage(inputArray);

    document.getElementById("userInput").value = "";
    chooseDisplay("")
}

function searchFieldEventHandler(search){
    searchWord = search.value;
    matchList = [];

    form.addEventListener("input", chooseDisplay(searchWord));
}

// input__str == string!!!
function chooseDisplay(input_str){
    console.log("Current searchWord: ", input_str);
    // Hvis det er et søk
    if(input_str.length != 0){
        searchFor(input_str.toLowerCase());
        console.log("Displaying matchList: ", matchList);
        display(matchList); 
    
    // Hvis søkefeltet er tomt
    }else if(input_str == ""){
        console.log("Displaying inputArray: ", inputArray);
        display(inputArray);

    // Hvis det ikke er noen treff på søk
    }else if(matchList.length == 0 && input_str.length != 0){
        resetDisplay();
    }
}


function resetDisplay(){
    while(countryList.firstChild){
        countryList.removeChild(countryList.firstChild);
    }
}

function display(array){
    
    resetDisplay();

    array.forEach(input =>{
        $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + input + "/today-and-tomorrow/").done(function(data){
            let today = data.total_population[0].population;
            let tomorrow = data.total_population[1].population;
            console.log("Tomorrow: ", tomorrow);
            let populationEachMillisecond = eachMillisecond(today, tomorrow);
            //populationUpdate(today, populationEachMillisecond);

            // There are 1000 millisecons each second.
            //window.setInterval(populationUpdate(today, populationEachMillisecond), 1000);
                countryList.innerHTML += "<li id='country'>" + input + " - " + today + "<button id='deleteButton'>X</button> </li>";
            
            //countryList.innerHTML += "<li id='country'>" + input + " - " + today + "<button id='deleteButton'>X</button> </li>";
        })
    })
    console.log(document.querySelectorAll("#countryList li"));
}

function populationUpdate(today, populationEachMillisecond){
    population = today + populationEachMillisecond;
}

function eachMillisecond(today, tomorrow){
    let allNewPopInADay = tomorrow - today;
    console.log("All new pop in a day: ", allNewPopInADay);
    // There are 86.400 seconds in 24 hours.
    let popEachMillisecond = allNewPopInADay / 86400;
    console.log("each mili; ", parseFloat(popEachMillisecond.toFixed(2)));
    return parseFloat(popEachMillisecond.toFixed(2));
}

function checkSearchTerm(li, searchWord){
    if(searchWord != ""){
        return li.toLowerCase().startsWith(searchWord); 
    }else{
        return false;
    }
}

function searchFor(searchWord){
    inputArray.forEach(input =>{
        if(checkSearchTerm(input, searchWord) == true){
            matchList.push(input);
        }
    })
}

$("#countryList").on('click', '#deleteButton', function(e){
    $(this).parent().remove();
    inputArray.splice($(this).parent());
    let remove = $(this).parent().text();
    sessionStorage.removeItem(remove);
});

function setBrowserStorage(element){
    if(typeof(Storage) !== "undefined"){
        sessionStorage.setItem(element, JSON.stringify(element));  
   }else {
       alert("No web storage support.")
   }
}

function offlineStorage(inputArray){
    for(let i = 0; i < inputArray.length; i++){
        setBrowserStorage(inputArray[i]);
    }
}