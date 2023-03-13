chrome.runtime.onMessage.addListener((message)=>{
    if (message.quotesSettings) {
    const categories = message.quotesSettings.categories
    let i = 0
    let url
    let shortQuotes = []

    
    const headers = {"X-Api-Key" : "gJY8u11Am0dTYp9oq0G5Lg==ILAKhRRxmPrPKKVs", "Content-Type" : "application/json"}

        chrome.alarms.create(
            "new inspoQuotes", 
            {periodInMinutes : .2})

    chrome.alarms.onAlarm.addListener(()=>{
        if (categories.length == 1 && categories[0] == "Random") {
            url = `https://api.api-ninjas.com/v1/quotes`
        }else{
            url = `https://api.api-ninjas.com/v1/quotes?category=${categories[i]}&limit=10`
        }
        
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
            iconUrl: "/assets/images/test.jpeg",
            priority: 1
        })
        i++
        console.log(url)
        }else{
            throw new Error
        }
        })
        .catch((err)=>{
            chrome.alarms.clearAll()
            console.log("an error occured");
        })       
    })
      
    }else{
        chrome.alarms.clearAll()
    }
})

