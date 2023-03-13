const intervalDivs = document.querySelectorAll(".intervals >div")
const categoryDivs = document.querySelectorAll(".categories-container > div:not(.show-more)")
let categoriesContainer = document.querySelector(".categories-container")
const showMoreButton = document.querySelector(".show-more")
const extras = document.querySelectorAll(".extra")
const submitButton = document.querySelector(".submit")
const themeSwitcher = document.querySelector(".theme-switcher")
let quotesSettings = {}
let interval = 30
let categories = []
let categoriesFromLocalStorage = []
let intervalFromLocalStorage = ""
let active = false



refillDataFromLocalStorage()
getThemeFromLocalStorage()


function refillDataFromLocalStorage(){
    chrome.storage.local.get(["intervalFromLocalStorage"])
    .then((result)=>{
        if(result.intervalFromLocalStorage){
            intervalFromLocalStorage = result.intervalFromLocalStorage

            intervalDivs.forEach((div)=>{
                if (div.dataset.value == result.intervalFromLocalStorage) {
                    classRemoverForDivs(intervalDivs)
                    div.classList.add("selected")
                }
            })
        }
    })


    chrome.storage.local.get(["categoriesFromLocalStorage"])
    .then((result)=>{
        if(result.categoriesFromLocalStorage){
            categoriesFromLocalStorage = result.categoriesFromLocalStorage
            categories = categoriesFromLocalStorage

            categoriesFromLocalStorage.map((category)=>{
                categoryDivs.forEach((div)=>{
                    if (div.firstElementChild.innerText == category) {
                        div.classList.add("selected")
                    }
                })
            })
            
        }
    })

    chrome.storage.local.get(["active"])
    .then((result) => {
        if(result.active && result.active == true){            
            active = result.active
            submitButton.innerHTML = `<p> Stop Inspiring Me🙁</p>`
            disableButtons(categoryDivs)
            disableButtons(intervalDivs)
        }
    })
}

function getThemeFromLocalStorage(){
    chrome.storage.local.get(["theme"])
    .then((result) =>{
        if(result.theme){
            document.body.classList.add(result.theme)
            themeSwitcher.src = "/assets/images/sun.svg"
        }
    })
}

function classRemoverForDivs(divsNodelist){
    divsNodelist.forEach((div)=>{
        div.classList.remove("selected")
    })
}

function classAdderForDivs(clickedDiv){
    clickedDiv.classList.add("selected")
}

function showMoreClicked(e){
    extras.forEach((div)=>{
        div.style.display = "block"
    })
    e.currentTarget.firstElementChild.innerText = "Show Less..."
    e.currentTarget.lastElementChild.classList.add("rotate")
}

function showLessClicked(e){
    extras.forEach((div)=>{
        div.style.display = "none"
    })
e.currentTarget.firstElementChild.innerText = "Show More..."
e.currentTarget.lastElementChild.classList.remove("rotate")
}

function disableButtons(nodeList){
    nodeList.forEach((div)=>{
        div.classList.add("disabled")
    })
}

function enableButtons(nodeList){
    nodeList.forEach((div)=>{
        div.classList.remove("disabled")
    })
}

themeSwitcher.addEventListener("click", (e)=>{
    if (document.body.classList.contains("dark")) {
    e.currentTarget.src = "/assets/images/moon.svg"
    document.body.classList.remove("dark")
    chrome.storage.local.remove("theme")
    } else {
    e.currentTarget.src = "/assets/images/sun.svg"
    document.body.classList.add("dark")
    chrome.storage.local.set({theme:"dark"})
    }
    
})

intervalDivs.forEach((div)=>{
    div.addEventListener("click", ()=>{
        classRemoverForDivs(intervalDivs)
        classAdderForDivs(div)
        interval = parseInt(div.dataset.value)
        chrome.storage.local.set({intervalFromLocalStorage: interval})
    })
})

categoryDivs.forEach((div)=>{    
    div.addEventListener("click", (e)=>{
        if (e.currentTarget.classList.contains("selected") 
        ){
        e.currentTarget.classList.remove("selected")
         categories = categories.filter((category) =>
            category !== div.firstElementChild.textContent
         )
         chrome.storage.local.set({categoriesFromLocalStorage:categories})
        } else { 
        classAdderForDivs(div)
         categories.push(div.firstElementChild.textContent)
         chrome.storage.local.set({categoriesFromLocalStorage:categories})  
        }
    })
}
)

showMoreButton.addEventListener("click", (e)=>{
    if (e.currentTarget.firstElementChild.innerText == "Show More...") {
      showMoreClicked(e)
    } 
    else {
      showLessClicked(e)
    }
    
})

submitButton.addEventListener("click", (e)=>{
    if (categories.length <= 0 && active == false) {
        alert("Please select at least one category")
    }
    else if(categories.length > 0 && active == false){
        active = true
       quotesSettings = {
        interval: interval,
        categories : categories
    } 
    e.currentTarget.innerHTML = `<p> Stop Inspiring Me🙁</p>`
    disableButtons(categoryDivs)
    disableButtons(intervalDivs)
    chrome.runtime.sendMessage({quotesSettings})
    chrome.storage.local.set({active : active})
    } 
    else if(active == true){
        chrome.runtime.sendMessage("stop-app")
        active = false
        enableButtons(categoryDivs)
        enableButtons(intervalDivs)
        e.currentTarget.innerHTML = `<p>Inspire Me</p>
        <img src="/assets/images/bell coloured.svg">`
        classRemoverForDivs(categoryDivs)
        chrome.storage.local.set({active : active})
        refillDataFromLocalStorage()
    }
})

// chrome.storage.local.clear()