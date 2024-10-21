document.getElementById('ad-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const number = document.getElementById('number').value;
    const server = 'https://salty-proximal-freeze.glitch.me/'
    const localServer ='http://localhost:3000/'

    const response = await fetch(server+'submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, number }),
    });

    const result = await response.json();

    const messageDiv = document.getElementById('message');
    const adForm = document.getElementById('ad-form');

    if (response.ok) {
        adForm.style.display='none';
        messageDiv.textContent = result.message;
        
        // Notify the VPAID player that the ad is stopping
        if (window.getVPAIDAd && typeof window.getVPAIDAd === 'function') {
            const vpaidAd = window.getVPAIDAd();
            vpaidAd.stopAd();  // Triggers the AdStopped event to close the ad
        }
    } else {
        messageDiv.textContent = result.error;
    }
});
