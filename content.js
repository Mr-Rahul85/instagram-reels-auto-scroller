 // State variables
 let isOnReels = false;
 let appIsRunning = false;
 let autoReelsStart = false;
 
// Check if user is on Instagram Reels page
 function checkURLAndManageApp() {
  const isOnReelsPage = window.location.href.startsWith("https://www.instagram.com/reels/");
  
  if (isOnReelsPage && !isOnReels) {
    isOnReels = true;
    initializeExtension();
  } else if (!isOnReelsPage && isOnReels) {
    isOnReels = false;
    stopApp();
  }
 }
 // Initialize extension when on reels page
 function initializeExtension() {
  if (!appIsRunning) {
    appIsRunning = true;
    console.log("Auto-scroller started on /reels/");
    window.alert("Auto-scroller started on /reels/");
    
    // Load settings from storage
    chrome.storage.sync.get(["autoReelsStart"], (result) => {
      autoReelsStart = result.autoReelsStart;
      if (autoReelsStart) startAutoScrolling();
    });
  }
 }
 // Main auto-scrolling logic
 function startAutoScrolling() {
  const VIDEOS_SELECTOR = "main video";
  
  function beginAutoScrollLoop() {
    setInterval(() => {
      if (autoReelsStart) {
        const currentVideo = getCurrentVideo();
        if (currentVideo) {
          currentVideo.removeAttribute("loop");
          currentVideo.addEventListener("ended", onVideoEnd);
        }
      }
    }, 100);
  }
  
  function onVideoEnd() {
    const currentVideo = getCurrentVideo();
    const nextVideo = getNextVideo(currentVideo);
    
    if (nextVideo && autoReelsStart) {
      scrollToNextVideo(nextVideo);
    }
  }
  
  function scrollToNextVideo(nextVideo) {
    nextVideo.scrollIntoView({
      behavior: "smooth",
block: "center"
 });
 }
 function getCurrentVideo() {
 return Array.from(document.querySelectorAll(VIDEOS_SELECTOR)).find(video => {
 const rect = video.getBoundingClientRect();
 return rect.top >= 0 && rect.bottom <= window.innerHeight;
 });
 }
 function getNextVideo(currentVideo) {
 const videos = Array.from(document.querySelectorAll(VIDEOS_SELECTOR));
 const index = videos.findIndex(vid => vid === currentVideo);
 return videos[index + 1] || null;
 }
 beginAutoScrollLoop();
 }
 // Monitor URL changes
 let lastUrl = window.location.href;
 new MutationObserver(() => {
 if (window.location.href !== lastUrl) {
 lastUrl = window.location.href;
 checkURLAndManageApp();
 }
 }).observe(document.body, { childList: true, subtree: true });
 // Initial check
 checkURLAndManageApp();