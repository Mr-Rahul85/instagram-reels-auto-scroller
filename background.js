 chrome.runtime.onInstalled.addListener(() => {
 console.log('Extension installed');
 
 // Set default values
 chrome.storage.sync.get(["autoReelsStart", "autoComments"], (result) => {
 if (result.autoReelsStart === undefined) {
 chrome.storage.sync.set({ autoReelsStart: true });
 }
 if (result.autoComments === undefined) {
 chrome.storage.sync.set({ autoComments: false });
 }
 });
 });
 // Listen for messages from popup
 chrome.runtime.onMessage.addListener(data => {
 switch(data.event) {
 case "autoReelsStart":
 chrome.storage.sync.set({"autoReelsStart": data.autoReelsValue});
 break;
 case "autoComments":
 chrome.storage.sync.set({"autoComments": data.autoCommentsValue});
 break;
 }
 });