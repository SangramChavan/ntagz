const card = document.getElementById('testerCard');
    const badge = document.getElementById('statusBadge');
    const headline = document.getElementById('headline');
    const desc = document.getElementById('textDesc');
    const button = document.getElementById('actionBtn');
    const btnGroup = document.getElementById('btnGroup');

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    function runInitialEnvironmentCheck() {
      if (isIOS) {
        setUnsupportedState("iOS Restriction", "Apple restricts third-party web browsers (Safari/Chrome) from testing NFC antennas directly via websites. While your iPhone contains premium NFC hardware for Apple Pay, you must use a native app to read tags.");
        showHomeFallbackButton();
      } else if (!("NDEFReader" in window)) {
        setUnsupportedState("Not Supported", "Your current web browser configuration or phone hardware does not support the Web NFC API standards. Try accessing this link via Google Chrome on an Android smartphone.");
        showHomeFallbackButton();
      }
    }

    async function verifyNFCHardware() {
      badge.textContent = "Querying Chipset...";
      
      try {
        const reader = new NDEFReader();
        await reader.scan();
        
        card.className = "tester-card state-supported";
        badge.textContent = "NFC Enabled";
        headline.textContent = "Hardware Detected!";
        desc.textContent = "Excellent news. Your smartphone is perfectly optimized with active contactless hardware configurations. You can smoothly scan, program, and interact with all ntagz card and coin tag units.";
        showHomeFallbackButton(true);
      } catch (error) {
        console.error(error);
        if (error.name === "NotAllowedError" || error.name === "PermissionError") {
          badge.textContent = "Permission Denied";
          desc.textContent = "The hardware verification request was cancelled. Please authorize browser permissions if you wish to scan your phone's interior chip layout.";
        } else {
          setUnsupportedState("No Active NFC", "The browser responded successfully, but your physical device antenna appears turned off or absent entirely. Please make sure 'NFC' is toggled ON inside your Android System Settings panel.");
          showHomeFallbackButton();
        }
      }
    }

    function setUnsupportedState(badgeText, descriptionText) {
      card.className = "tester-card state-unsupported";
      badge.textContent = badgeText;
      headline.textContent = "NFC Unavailable";
      desc.textContent = descriptionText;
    }

    function showHomeFallbackButton(isPrimaryStyle = false) {
      button.style.display = "none";
      if(document.getElementById('cardHomeBtn')) return;

      const homeBtn = document.createElement('a');
      homeBtn.href = "index.html";
      homeBtn.id = "cardHomeBtn";
      homeBtn.textContent = "Return to Home";
      homeBtn.className = isPrimaryStyle ? "btn" : "btn btn-secondary";
      
      btnGroup.appendChild(homeBtn);
    }

    runInitialEnvironmentCheck();
