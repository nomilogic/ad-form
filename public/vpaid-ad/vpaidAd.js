class VPAIDAd {
    constructor() {
      this.adWidth = 640;
      this.adHeight = 360;
      this.volume = 1.0;
      this.adDuration = 30;
      this.viewMode = 'normal';
      this.isSkippable = true;
      this.isExpanded = false;
      this.callbacks = {};
    }
  
    // Initialize the VPAID ad
    initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
      this.adWidth = width;
      this.adHeight = height;
      this.viewMode = viewMode;
    
      console.log('Ad initialized with width:', width, 'height:', height);
      this.triggerEvent('AdLoaded');
    }
  
    startAd() {
      console.log('Ad started');
      this.triggerEvent('AdStarted');
  
      // Simulate ad completion after a duration
      setTimeout(() => {
        this.triggerEvent('AdComplete');
      }, this.adDuration * 1000);
    }
  
    stopAd() {
      console.log('Ad stopped');
      this.triggerEvent('AdStopped');
    }
  
    pauseAd() {
      console.log('Ad paused');
      this.triggerEvent('AdPaused');
    }
  
    resumeAd() {
      console.log('Ad resumed');
      this.triggerEvent('AdPlaying');
    }
  
    setAdVolume(volume) {
      this.volume = volume;
      this.triggerEvent('AdVolumeChanged');
    }
  
    getAdVolume() {
      return this.volume;
    }
  
    resizeAd(width, height, viewMode) {
      this.adWidth = width;
      this.adHeight = height;
      this.viewMode = viewMode;
      this.triggerEvent('AdSizeChanged');
    }
  
    expandAd() {
      this.isExpanded = true;
      this.triggerEvent('AdExpanded');
    }
  
    collapseAd() {
      this.isExpanded = false;
      this.triggerEvent('AdCollapsed');
    }
  
    skipAd() {
      this.triggerEvent('AdSkipped');
    }
  
    // Subscribe to VPAID events
    subscribe(event, callback) {
      if (!this.callbacks[event]) {
        this.callbacks[event] = [];
      }
      this.callbacks[event].push(callback);
    }
  
    unsubscribe(event, callback) {
      if (this.callbacks[event]) {
        this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
      }
    }
  
    triggerEvent(event) {
      if (this.callbacks[event]) {
        this.callbacks[event].forEach(callback => callback());
      }
    }
  
    getAdLinear() {
      return true;
    }
  
    getAdSkippableState() {
      return this.isSkippable;
    }
  
    getAdExpanded() {
      return this.isExpanded;
    }
  
    getAdRemainingTime() {
      return this.adDuration;
    }
  
    getAdCompanions() {
      return '';
    }
  
    getAdIcons() {
      return '';
    }
  }
  
  // Expose the getVPAIDAd function for third-party player
  window.getVPAIDAd = function() {
    return new VPAIDAd();
  };
  