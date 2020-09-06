const countryList = document.getElementById("countryList");
let inputArray = [];


function addButtonEventHandler(){
    let input = document.getElementById("userInput").value;
    inputArray.push(input);
    $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + input + "/today-and-tomorrow/").done(function(data){
        // According to the API format. 
        let today = data.total_population[0].population;
        let tomorrow = data.total_population[1].population;
        console.log("Population for ", input, " is ", today);

        //let li = document.createElement("li");
        countryList.innerHTML += "<li>" + input + " - " + today + "<button id='deleteButton'>X</button> </li>";
        //countryList.appendChild(li);

        offlineStorage(inputArray);
    })
    document.getElementById("userInput").value = "";
}

function searchFieldEventHandler(searchWord){
    searchWord.addEventListener("keyup", function(){
        //console.log("Registrert aktivitet på key")
        if(searchWord != ""){
            searchWordL = searchWord.value.toLowerCase();
            //console.log("HER: ", countryList.innerText.replace("X", ""));
            matchList = searchFor(searchWordL);
            //console.log("Liste med matcher", matchList);
            updateDisplay(matchList);
        }
    });
}

function updateDisplay(matchList){
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

function checkSearchTerm(li, searchWord){
    //console.log("--------------", li, " ",searchWord);

    if(li.toLowerCase().startsWith(searchWord.toLowerCase())){
        //console.log("Likt!");
        return true;
    }else{
        //console.log("Ikke likt!");
        return false;
    }
}

function searchFor(searchWord){
    let list = countryList.getElementsByTagName("li");
    let matches = [];
    //console.log("Entering search for")
    //console.log("list =", list)
    for (let i = 0; i < list.length; i++){
        console.log("checking: ", i)
        let current = list[i].textContent;
        //console.log(i + ") Er " + current + " en match?");
        if(checkSearchTerm(current, searchWord) == true){
            matches.push(i);
        }
    }
    //console.log("Exiting search for")
    console.log("Matches: ",matches)
    return matches;
}

$("#countryList").on('click', '#deleteButton', function(e){
    $(this).parent().remove();
    sessionStorage.removeItem($(this).parent());
});

function setBrowserStorage(element){
    if (typeof(Storage) !== "undefined") {
        sessionStorage.setItem(element, JSON.stringify(element));  
   } else {
       alert("No web storage support.")
   }
}

function offlineStorage(inputArray){
    for(let i = 0; i < inputArray.length; i++){
        console.log("Running setBrowserStorage, sessionStorage for ", inputArray[i]);
        setBrowserStorage(inputArray[i]);
    }

}
