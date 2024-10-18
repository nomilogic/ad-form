var VPAIDAd = function() {
    this.eventsCallbacks = {};
};

VPAIDAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this.callEvent('AdLoaded');
};

VPAIDAd.prototype.startAd = function() {
    this.callEvent('AdStarted');
};

VPAIDAd.prototype.stopAd = function() {
    this.callEvent('AdStopped');
};

VPAIDAd.prototype.callEvent = function(eventType) {
    if (this.eventsCallbacks[eventType]) {
        this.eventsCallbacks[eventType]();
    }
};

VPAIDAd.prototype.subscribe = function(callback, eventType) {
    this.eventsCallbacks[eventType] = callback;
};

window.getVPAIDAd = function() {
    return new VPAIDAd();
};
