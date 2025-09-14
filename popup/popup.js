const autoUnmute = document.getElementById("autoUnmuteToggle");
const autoCommentsToggle = document.getElementById("autoCommentsToggle");
const autoReelsToggle = document.getElementById("autoReelsToggle");
const startButton = document.getElementById("startStopButton");

chrome.storage.sync.get("autoUnmute", (result) => {
  autoUnmute.checked = result.autoUnmute;
});

chrome.storage.sync.get("autoReelsStart", (result) => {
  autoReelsToggle.checked = result.autoReelsStart;
  startButton.textContent = result.autoReelsStart ? "Stop" : "Start";
});

chrome.storage.sync.get("autoComments", (result) => {
  autoCommentsToggle.checked = result.autoComments;
});

autoUnmute.onclick = () => {
  chrome.runtime.sendMessage({ event: "autoMute", autoUnmuteValue: autoUnmute.checked });
};

autoCommentsToggle.onclick = () => {
  chrome.runtime.sendMessage({ event: "autoComments", autoCommentsValue: autoCommentsToggle.checked });
};

autoReelsToggle.onclick = () => {
  chrome.runtime.sendMessage({ event: "autoReelsStart", autoReelsValue: autoReelsToggle.checked });
};

// Start/Stop button logic
startButton.addEventListener("click", () => {
  const isStarting = startButton.textContent === "Start";
  startButton.textContent = isStarting ? "Stop" : "Start";
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      event: "toggleAutoReels",
      action: isStarting ? "start" : "stop",
    });
  });
});