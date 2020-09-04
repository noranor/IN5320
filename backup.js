window.sessionStorage;

const countryList = document.getElementById("countryList");
let inputArray = [];


function addUserInput(){
    let input = document.getElementById("userInput").value,  
        li = document.createElement("li"), 
        inputTxt = document.createTextNode(input);
    
    inputArray.push(input);
    console.log(inputArray);
    
    const button = document.createElement("button");
    button.innerHTML=" X";
    
    li.appendChild(inputTxt);
    li.appendChild(button);
    countryList.appendChild(li);

    offlineStorage(inputArray, myFunction);

    document.getElementById("userInput").value = "";

    button.addEventListener("click", function removeButton(e){
        button.parentNode.parentNode.removeChild(button.parentNode);
        inputArray.splice(inputArray.indexOf(button.parentNode));
        // Doesn't work
        sessionStorage.removeItem(e)

        console.log(inputArray);
    });
}

function offlineStorage(inputArray, myFunction){
    for(let i = 0; i < inputArray.length; i++){
        console.log("Running myFunction, sessionStorage for " + inputArray[i]);
        myFunction(inputArray[i]);
    }
}

function myFunction(e){
    if (typeof(Storage) !== "undefined") {
         sessionStorage.setItem(e, JSON.stringify(e));  
    } else {
        alert("No web storage support.")
    }
}

/*
    <Insert quick summary of what the function does, 1-2 sentences?>
    parameters:
        param1 (Type)
        word (String)
        poop (ul)
        ...
    return:
        N/A
        (type)
*/
function searchFor(countryList){
    // Store matching list elements
    let matches = [];
    // Fetch the search term value from the search input box, and convert to lower case
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();

    console.log("I am searching for: ", searchTerm)
    // Loop through country list and find matches
    for (let i = 0; i < countryList.getElementsByTagName("li").length; i++)
    {
        let current = countryList.getElementsByTagName("li")[i].firstChild.textContent
        // Force to lowercase, so that search is not case sensetive!
        current = current;
        console.log("(", i, ")", "Is ",current, "a match?")
        if (current.toLowerCase().startsWith(searchTerm))
        {
            console.log("Yes!");
            matches.push(current);
        }
    }

    console.log(matches)
    /*
    for(let i = 0; i < countryList.getElementsByTagName("li").length; i++){
        //console.log(ul.getElementsByTagName("li")[i].innerText.replace("X", ""));
        console.log("The searchFor-method should run now. If no message after this it's not working.")
        if(isSearchTrue(countryList.getElementsByTagName("li")[i].innerText.replace("X", ""), searchWord.value)){
            console.log("hei");
            matches.push(countryList.getElementsByTagName("li")[i].innerText.replace("X", ""));
            console.log("Matches found for " + searchWord.value + ": " + matches);
        }
    }
    */
}