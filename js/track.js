function handleTracking(e) {
    e.preventDefault();
    const input = document.getElementById('trackingId');
    const trackingId = input.value.trim();
    
    if(trackingId) {
      // Ekart typically tracks via this specific query string or URL route
      // Routing directly to their tracking endpoint with the ID
      const ekartUrl = `https://ekartlogistics.com/shipmenttrack/${encodeURIComponent(trackingId)}`;
      
      // Open securely in new tab
      window.open(ekartUrl, '_blank', 'noopener,noreferrer');
      
      // Optional: clear the input after search
      // input.value = '';
    }
  }
