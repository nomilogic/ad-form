
// Load VAST URL or XML
function loadVAST() {
    const input = document.getElementById("vastInput").value;
    const videoPlayer = videojs("vastVideo");

    // Check if input is a URL or XML content
    if (isValidURL(input)) {
        // VAST URL
        fetchVAST(input, videoPlayer);
    } else {
        // VAST XML string input
        parseVASTXML(input, videoPlayer);
    }
}

// Check if the input is a valid URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Fetch VAST from URL
function fetchVAST(url, player) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            parseVASTXML(data, player);
        })
        .catch(error => console.error("Error fetching VAST:", error));
}

// Parse VAST XML and load the ad
function parseVASTXML(vastXML, player) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(vastXML, "application/xml");

    // Get the MediaFile URL (assuming a single linear ad)
    const mediaFileTag = xmlDoc.getElementsByTagName("MediaFile")[0];
    const mediaFileUrl = mediaFileTag.textContent.trim();

    // Set the source of the video player to the ad media file
    player.src({ src: mediaFileUrl, type: "video/mp4" });
    player.play();
}
