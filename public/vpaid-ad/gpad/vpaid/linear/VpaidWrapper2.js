class VpaidWrapper {
    static defaultCSS = `
      #__element {
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        position: absolute;
        z-index: 10;
      }
      #__element-el {
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        position: absolute;
        z-index: 5;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      #__element .aso-vpaid-background {
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        position: absolute;
        opacity: 1;
        background: #000;
      }
      #__element .aso-vpaid-skip-btn,
      #__element .aso-vpaid-act-btn {
        font-family: Arial;
        display: block;
        position: absolute;
        z-index: 10000;
        border: 1px solid #fff;
        padding: 10px;
        color: #fff;
        font-size: 14px;
        text-decoration: none;
        cursor: pointer;
        user-select: none;
      }
      #__element .aso-vpaid-skip-btn {
        right: 0;
        bottom: 50px;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      #__element .aso-vpaid-act-btn {
        left: 0;
        bottom: 50px;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
      #__element .aso-vpaid-skip-btn span {
        font-weight: bold;
      }
      #__element .aso-vpaid-hint {
        font-family: Arial;
        display: block;
        position: absolute;
        left: 0;
        top: 65%;
        width: 100%;
        text-align: center;
        z-index: 10000;
        color: #fff;
        font-size: 12px;
        text-decoration: none;
        user-select: none;
        opacity: 0;
        transition: opacity 1s ease-in;
      }
      #__element .aso-vpaid-hint span.hint {
        display: inline-block;
        border-radius: 3px;
        border: 1px solid #fff;
        padding: 7px;
        background: rgba(0, 0, 0, 0.6);
      }
    `;
  
    constructor() {
      this.slot_ = null;
      this.eventsCallbacks_ = {};
      this.attributes_ = {
        companions: '',
        desiredBitrate: 256,
        duration: 10,
        remainingTime: 0,
        expanded: false,
        height: 0,
        icons: '',
        linear: true,
        skippableState: false,
        viewMode: 'normal',
        width: 0,
        volume: 50,
      };
      this.startTime_ = 0;
      this.codeUrl_ = null;
      this.banner_ = null;
      this.idad_ = null;
      this.idzone_ = null;
      this.allowSkip_ = null;
      this.skipDelay_ = null;
      this.skipTitle_ = null;
      this.videos_ = [];
      this.actionTitle_ = null;
      this.hint_ = null;
      this.customCSS_ = '';
      this.skipButtonInitialized = false;
      this.timerPaused = false;
      this.stopped = false;
    }
  
    // Initialize the ad with parameters
    initAd(width, height, viewMode, desiredBitrate, adParameters, slot) {
      this.attributes_.width = width;
      this.attributes_.height = height;
      this.attributes_.viewMode = viewMode;
      this.attributes_.desiredBitrate = desiredBitrate;
      this.slot_ = slot.slot;
      this.videoSlot_ = slot.videoSlot;
  
      const params = JSON.parse(adParameters);
      this.attributes_.duration = params.duration;
      this.id_ = params.id;
      this.element_ = `${params.id}-el`|| '<div><div>';
      this.codeUrl_ = params.codeUrl || null;
      this.clickUrl_ = params.clickUrl || null;
      this.banner_ = params.banner || null;
      this.idzone_ = params.idzone || null;
      this.idad_ = params.idad || null;
      this.allowSkip_ = !("allow_skip" in params) || params.allow_skip;
      this.skipDelay_ = params.skip_delay || 5;
      this.skipTitle_ = params.skip_title || 'Skip →';
      this.actionTitle_ = params.action_title || null;
      this.hint_ = params.hint || null;
      this.skipWaitTitle_ = params.skip_wait_title || 'Skip in {timer} sec.';
      this.customCSS_ = params.custom_css || '';
      this.stopped = false;
      this.timerPaused = false;
      this.skipButtonInitialized = false;
  
      this.callEvent_('AdLoaded');
    }
  
    // Update video player size
    updateVideoPlayerSize_() {
      this.videoSlot_.setAttribute('width', this.attributes_.width);
      this.videoSlot_.setAttribute('height', this.attributes_.height);
    }
  
    // Handshake version
    handshakeVersion() {
      return '2.0';
    }
  
    // Start the ad
    startAd() {
      this.log('Starting ad');
      this.startTime_ = Date.now();
  
      const adHTML = `
        <style type="text/css">
          ${VpaidWrapper.defaultCSS + this.customCSS_}.replace(/#__element/g, "#${this.id_}")
        </style>
        <div class="aso-vpaid-background"></div>
        
      `;
  
      const adContainer = document.createElement('div');
      adContainer.setAttribute('id', this.id_);
      this.slot_.appendChild(adContainer);
  
  //     const adElement = document.createElement('div');
  //     adElement.className = `aso-vpaid aso-aid-${this.idad_}`;
  //     adElement.innerHTML = adHTML;
  //     adContainer.appendChild(adElement);
  
  //     const scriptElement = document.createElement('script');
  //     scriptElement.type = 'text/javascript';
  //     scriptElement.src = this.codeUrl_;
  //     scriptElement.onload = () => this.onAdScriptLoaded(adElement);
  
  //     document.head.appendChild(scriptElement);
    }
  
    // Handle ad script load
    onAdScriptLoaded(adElement) {
      try {
        parent.window._ASO = parent.window._ASO || _ASO;
      } catch (error) {}
  
      _ASO.Utils.initZone(this.idzone_, adElement);
  
      const messageHandler = (event) => {
        if (event.data === `_ASO_VPAID_Play${this.element_}`) {
          console.log('play received');
          this.timerPaused = false;
          this.initSkipButton();
        } else if (event.data === `_ASO_VPAID_Stop${this.element_}`) {
          console.log('stop received');
          this.stopAd();
        } else if (event.data === `_ASO_VPAID_Pause${this.element_}`) {
          console.log('pause received');
          this.timerPaused = true;
        }
      };
  
      _ASO.Utils.bindEvent(window, 'message', messageHandler);
      try {
        _ASO.Utils.bindEvent(parent.window, 'message', messageHandler);
      } catch (error) {}
  
      this.callEvent_('AdStarted');
      this.callEvent_('AdImpression');
  
      if (this.getAdDuration() > 0) {
        setTimeout(() => this.stopAd(), 1000 * this.getAdDuration());
      }
  
      if (this.allowSkip_) {
        this.initSkipButton();
      } else if (this.hint_) {
        this.showHint();
      }
    }
  
    // Show hint if available
    showHint() {
      if (this.hint_) {
        const hintElement = this.findElement_(`#${this.id_} .aso-vpaid-hint`);
        hintElement.innerHTML = `<span class="hint">${this.hint_}</span>`;
        setTimeout(() => {
          hintElement.style.opacity = 1;
        }, 200);
      }
    }
  
    // Hide the hint
    hideHint() {
      if (this.hint_) {
        this.findElement_(`#${this.id_} .aso-vpaid-hint`).style.display = 'none';
      }
    }
  
    // Initialize the skip button
    initSkipButton() {
      if (this.skipButtonInitialized) return;
  
      this.hideHint();
      this.skipButtonInitialized = true;
  
      const skipButton = this.findElement_(`#${this.id_} .aso-vpaid-skip-btn`);
      let remainingTime = this.skipDelay_;
  
      const updateSkipButton = (time) => {
        if (this.skipWaitTitle_ && time !== 0) {
          skipButton.innerHTML = this.skipWaitTitle_.replace('{timer}', `<span>${time}</span>`);
          skipButton.classList.add('wait');
        } else {
          skipButton.innerHTML = this.skipTitle_;
          skipButton.classList.remove('wait');
        }
      };
  
      updateSkipButton(remainingTime);
  
      const intervalId = setInterval(() => {
        remainingTime -= 1;
        if (remainingTime <= 0) {
          clearInterval(intervalId);
          updateSkipButton(remainingTime);
          skipButton.onclick = () => this.skipAd();
        } else {
          updateSkipButton(remainingTime);
        }
      }, 1000);
    }
  
    // Skip the ad
    skipAd() {
      this.callEvent_('AdSkipped');
      this.stopAd();
    }
  
    // Stop the ad
    stopAd() {
      if (this.stopped) return;
  
      this.stopped = true;
      this.callEvent_('AdStopped');
      this.slot_.innerHTML = ''; // Clear the ad slot
    }
  
    getAdIcons(){
        return this.attributes_.icons;
      }
    // Get the ad duration
    getAdDuration() {
      return this.attributes_.duration;
    }
  
    // Get the ad width
    getAdWidth() {
      return this.attributes_.width;
    }
  
    // Get the ad height
    getAdHeight() {
      return this.attributes_.height;
    }
  
    // Get the view mode
    getViewMode() {
      return this.attributes_.viewMode;
    }
  
    // Get the desired bitrate
    getDesiredBitrate() {
      return this.attributes_.desiredBitrate;
    }
  
    // Get the remaining time
    getRemainingTime() {
      return this.attributes_.remainingTime;
    }
  
    // Get the volume
    getVolume() {
      return this.attributes_.volume;
    }
  
    // Subscribe to events
    subscribe(context, eventName, callback) {
      if (!(eventName in this.eventsCallbacks_)) {
        this.eventsCallbacks_[eventName] = [];
      }
      this.eventsCallbacks_[eventName].push(callback.bind(context));
    }
  
    // Unsubscribe from events
    unsubscribe(eventName, callback) {
      if (!(eventName in this.eventsCallbacks_)) return;
  
      this.eventsCallbacks_[eventName] = this.eventsCallbacks_[eventName].filter(
        (cb) => cb !== callback
      );
    }
  
    // Call event callbacks
    callEvent_(eventName) {
      if (eventName in this.eventsCallbacks_) {
        this.eventsCallbacks_[eventName].forEach(callback => callback());
      }
    }
  
    // Log messages
    log(message) {
      console.log(`[VpaidWrapper] ${message}`);
    }
  
    // Find a DOM element by selector
    findElement_(selector) {
      return document.querySelector(selector);
    }
  
    expandAd() {
      this.isExpanded = 1;
      this.callEvent_("AdExpanded");
    }
  
    collapseAd() {
      this.isExpanded = !1;
      this.callEvent_("AdCollapsed");
    }
  }
  
  
  // Export function to create a VPAID ad
  function getVPAIDAd() {
      return new VpaidWrapper();
  }