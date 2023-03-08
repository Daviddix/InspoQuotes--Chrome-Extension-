const notificationOptions = {
    title:"Herert Mecurley",
    message: "Today is a great day",
    type:"basic",
    iconUrl: "/assets/images/test.jpeg",
    priority: 1
}

chrome.runtime.onMessage.addListener((message)=>{
    if (message.quotesSettings) {
        console.log(message.quotesSettings.interval)
         chrome.alarms.create(
            "new inspoQuotes", 
            {periodInMinutes : .2})

    chrome.alarms.onAlarm.addListener(()=>{
        chrome.notifications.create(
            `inspoQuote ${Date.now()}`,
            notificationOptions
       )
    })    
    }else{
        chrome.alarms.clearAll()
    }
})