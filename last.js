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
    display(inputArray);
}

function searchFieldEventHandler(search){
    searchWord = search;
    console.log("---- Matchlist før sletting: ", matchList);
    matchList = [];
    console.log("---- Matchlist ETTER sletting: ", matchList);

    form.addEventListener("input", chooseDisplay(searchWord));
}

function chooseDisplay(searchWord){
    if(searchWord.length != 0 && searchWord != ""){
        searchFor(searchWord.value.toLowerCase());
        console.log("Displaying matchList: ", matchList);
        display(matchList); 
    }else{
        console.log("Displaying inputArray: ", inputArray);
        display(inputArray);
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
            
            countryList.innerHTML += "<li id='country'>" + input + " - " + today + "<button id='deleteButton'>X</button> </li>";
        })
    })
}

function checkSearchTerm(li, searchWord){
    if(searchWord != ""){
        return li.toLowerCase().startsWith(searchWord); 
    }
}
    /*
    if(searchWord != "" || searchWord != undefined){
        if(li.toLowerCase().startsWith(searchWord.toLowerCase())){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }*/

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