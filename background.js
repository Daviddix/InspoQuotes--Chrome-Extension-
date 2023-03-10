chrome.runtime.onMessage.addListener((message)=>{
    if (message.quotesSettings) {
    const categories = message.quotesSettings.categories
    let i = 0
    let url

    if (categories.length == 1 && categories[0] == "Random") {
        url = `https://api.api-ninjas.com/v1/quotes`
    }else{
        url = `https://api.api-ninjas.com/v1/quotes?category=${categories[i]}`
    }
    
    const headers = {"X-Api-Key" : "gJY8u11Am0dTYp9oq0G5Lg==ILAKhRRxmPrPKKVs", "Content-Type" : "application/json"}

        chrome.alarms.create(
            "new inspoQuotes", 
            {periodInMinutes : .2})

    chrome.alarms.onAlarm.addListener(()=>{
        fetch(url, {headers})
        .then((raw)=> raw.json())
        .then((data)=>{
            if (data) {
                if (i == categories.length - 1) {
                    i = 0
                }
        chrome.notifications.create(
        `inspoQuote ${Date.now()}`,
        {
            title:`${data[0].author} - ${data[0].category}`,
            message: data[0].quote,
            type:"basic",
            iconUrl: "/assets/images/test.jpeg",
            priority: 1
        })
        i++
        }else{
            throw new Error
        }
        })
        .catch((err)=>{
            alert(err)
        })       
    })
      
    }else{
        chrome.alarms.clearAll()
    }
})