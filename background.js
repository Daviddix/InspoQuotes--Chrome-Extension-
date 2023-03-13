chrome.runtime.onMessage.addListener((message)=>{
    if (message.quotesSettings) {
    const categories = message.quotesSettings.categories
    const interval = message.quotesSettings.interval
    let i = 0
    let url
    let shortQuotes = []
    const headers = {"X-Api-Key" : "gJY8u11Am0dTYp9oq0G5Lg==ILAKhRRxmPrPKKVs", "Content-Type" : "application/json"}

    chrome.alarms.create("new inspoQuotes", {periodInMinutes : interval})

    if (categories.includes("Random") === true) {
       chrome.alarms.onAlarm.addListener(()=>{
        url = `https://api.api-ninjas.com/v1/quotes?category=&limit=10`
    
        fetch(url, {headers})
        .then((raw)=> raw.json())
        .then((data)=>{
            if (data) {
        data.forEach((quote)=>{
            if (quote.quote.length <= 130) {
                shortQuotes.push(quote)
            }
        })
        let num = Math.floor(Math.random() * shortQuotes.length - 1)
        chrome.notifications.create(
        `inspoQuote ${Date.now()}`,
        {
            title:`${shortQuotes[num].author} - ${shortQuotes[num].category}`,
            message: shortQuotes[num].quote,
            type:"basic",
            iconUrl: "/assets/images/logo-64.png",
            priority: 1
        })
        }else{
            throw new Error
        }
        })
        .catch((err)=>{
            chrome.alarms.clearAll()
            chrome.runtime.sendMessage("turnAppOff");
            console.log("an error occured");
        })       
    })
    }else if(categories.includes("Random") === false){
        chrome.alarms.onAlarm.addListener(()=>{
        url = `https://api.api-ninjas.com/v1/quotes?category=${categories[i]}&limit=10`    
    
        fetch(url, {headers})
        .then((raw)=> raw.json())
        .then((data)=>{
            if (data) {
                if (i == categories.length - 1) {
                    i = 0
                }
        data.forEach((quote)=>{
            if (quote.quote.length <= 130) {
                shortQuotes.push(quote)
            }
        })
        let num = Math.floor(Math.random() * shortQuotes.length - 1)
        chrome.notifications.create(
        `inspoQuote ${Date.now()}`,
        {
            title:`${shortQuotes[num].author} - ${shortQuotes[num].category}`,
            message: shortQuotes[num].quote,
            type:"basic",
            iconUrl: "/assets/images/logo-64.png",
            priority: 1
        })
        
        i++
        }else{
            throw new Error
        }
        })
        .catch((err)=>{
            chrome.alarms.clearAll()
            chrome.runtime.sendMessage("turnAppOff");
            console.log("an error occured");
        })       
    })
      
    }}
})