var VpaidWrapper = function () {
    (this.slot_ = null),
      (this.eventsCallbacks_ = {}),
      (this.attributes_ = {
        companions: "",
        desiredBitrate: 256,
        duration: 10,
        remainingTime: 0,
        expanded: !1,
        height: 0,
        icons: "",
        linear: !0,
        skippableState: !1,
        viewMode: "normal",
        width: 0,
        volume: 50,
      }),
      (this.startTime_ = 0),
      (this.codeUrl_ = null),
      (this.banner_ = null),
      (this.idad_ = null),
      (this.idzone_ = null),
      (this.allowSkip_ = null),
      (this.skipDelay_ = null),
      (this.skipTitle_ = null),
      (this.videos_ = []);
  },
  getVPAIDAd =
    ((VpaidWrapper.defaultCSS =
      "#__element    {height:100%;width:100%;top:0;left:0;position:absolute;z-index:10}#__element-el {height:100%;width:100%;top:0;left:0;position:absolute;z-index:5;display:flex;justify-content:center;align-items: center; }#__element .aso-vpaid-background {height:100%;width:100%;top:0;left:0;position:absolute;opacity:1;background: #000}#__element .aso-vpaid-skip-btn {font-family:Arial; display:none;position:absolute;right:0;bottom:50px;z-index:10000;border-top-left-radius:3px;border-bottom-left-radius:3px;border:1px solid #fff;border-right: none; padding:10px;color:#fff;font-size:14px;text-decoration:none;cursor:pointer;user-select: none;}#__element .aso-vpaid-act-btn {font-family:Arial; display:block;position:absolute;left:0;bottom:50px;z-index:10000;border-top-right-radius:3px;border-bottom-right-radius:3px;border:1px solid #fff;border-left: none; padding:10px;color:#fff;font-size:14px;text-decoration:none;cursor:pointer;user-select: none;}#__element .aso-vpaid-skip-btn span {font-weight: bold;}#__element .aso-vpaid-skip-btn.wait {color: #888;font-size: 12px;border-color:#888;cursor:not-allowed;}#__element .aso-vpaid-skip-btn.wait:hover {}#__element .aso-vpaid-hint{font-family:Arial;display:block;position:absolute;left:0;top:65%;width:100%;text-align:center;z-index:10000;color:#fff;font-size:12px;text-decoration:none;user-select:none;opacity:0;transition:opacity 1s ease-in;}#__element .aso-vpaid-hint span.hint{display:inline-block;border-radius:3px;border:1px solid #fff;padding:7px;background: rgba(0, 0, 0, 0.6);}"),
    (VpaidWrapper.prototype.initAd = function (t, e, i, n, a, s) {
      (this.attributes_.width = t),
        (this.attributes_.height = e),
        (this.attributes_.viewMode = i),
        (this.attributes_.desiredBitrate = n),
        (this.slot_ = s.slot),
        (this.videoSlot_ = s.videoSlot);
      t = JSON.parse(a.AdParameters);
      (this.attributes_.duration = t.duration),
        (this.id_ = t.id),
        (this.element_ = t.id + "-el"),
        (this.codeUrl_ = t.codeUrl || null),
        (this.clickUrl_ = t.clickUrl || null),
        (this.banner_ = t.banner || null),
        (this.idzone_ = t.idzone || null),
        (this.idad_ = t.idad || null),
        (this.allowSkip_ = !("allow_skip" in t) || t.allow_skip),
        (this.skipDelay_ = t.skip_delay || 5),
        (this.skipTitle_ = t.skip_title || "Skip â†’"),
        (this.actionTitle_ = t.action_title || null),
        (this.hint_ = t.hint || null),
        (this.skipWaitTitle_ = t.skip_wait_title || "Skip in {timer} sec."),
        (this.customCSS_ = t.custom_css || ""),
        (this.stopped = !1),
        (this.timerPaused = !1),
        (this.skipButtonInitialized = !1),
        this.callEvent_("AdLoaded");
    }),
    (VpaidWrapper.prototype.updateVideoPlayerSize_ = function () {
      this.videoSlot_.setAttribute("width", this.attributes_.width),
        this.videoSlot_.setAttribute("height", this.attributes_.height);
    }),
    (VpaidWrapper.prototype.handshakeVersion = function (t) {
      return "2.0";
    }),
    (VpaidWrapper.prototype.startAd = function () {
      this.log("Starting ad");
      var t = new Date();
      this.startTime_ = t.getTime();
      var t =
          '<style type="text/css">' +
          (VpaidWrapper.defaultCSS + this.customCSS_).replace(
            /#__element/g,
            "#" + this.id_
          ) +
          '</style><div class="aso-vpaid-background"></div><div id="' +
          this.element_ +
          '"></div><div class="aso-vpaid-skip-btn"></div><div class="aso-vpaid-hint"></div>',
        i =
          (this.clickUrl_ &&
            this.actionTitle_ &&
            (t +=
              '<a href="' +
              this.clickUrl_ +
              '" class="aso-vpaid-act-btn" target="_blank">' +
              this.actionTitle_ +
              " </a>"),
          document.createElement("div")),
        n =
          (i.setAttribute("id", this.id_),
          this.slot_.appendChild(i),
          document.createElement("div")),
        a =
          ((n.className = "aso-vpaid aso-aid-" + this.idad_),
          (n.innerHTML = t),
          this),
        t = document.createElement("script");
      (t.type = "text/javascript"),
        (t.src = this.codeUrl_),
        (t.onload = function () {
          try {
            parent.window._ASO = parent.window._ASO || _ASO;
          } catch (t) {}
          _ASO.Utils.initZone(a.idzone_, n, i);
          function t(t) {
            t.data === "_ASO_VPAID_Play" + a.element_ &&
              (console.log("play received"),
              (a.timerPaused = !1),
              a.initSkipButton()),
              t.data === "_ASO_VPAID_Stop" + a.element_ &&
                (console.log("stop received"), a.stopAd()),
              t.data === "_ASO_VPAID_Pause" + a.element_ &&
                (console.log("pause received"), (a.timerPaused = !0));
          }
          var e = document.createElement("script");
          n.appendChild(e),
            _ASO.Utils.injectCode("direct", e, a.banner_.content),
            a.callEvent_("AdStarted"),
            a.callEvent_("AdImpression"),
            0 < a.getAdDuration() &&
              setTimeout(function () {
                a.stopAd();
              }, 1e3 * a.getAdDuration()),
            a.allowSkip_ ? a.initSkipButton() : a.hint_ && a.showHint();
          _ASO.Utils.bindEvent(window, "message", t);
          try {
            _ASO.Utils.bindEvent(parent.window, "message", t);
          } catch (t) {}
        }),
        document.head.appendChild(t);
    }),
    (VpaidWrapper.prototype.showHint = function () {
      var t;
      this.hint_ &&
        (((t = this.findElement_(
          "#" + this.id_ + " .aso-vpaid-hint"
        )).innerHTML = '<span class="hint">' + this.hint_ + "</span>"),
        setTimeout(function () {
          t.style.opacity = 1;
        }, 200));
    }),
    (VpaidWrapper.prototype.hideHint = function () {
      this.hint_ &&
        (this.findElement_("#" + this.id_ + " .aso-vpaid-hint").style.display =
          "none");
    }),
    (VpaidWrapper.prototype.initSkipButton = function () {
      var e, i, n, t, a, s;
      this.skipButtonInitialized ||
        (this.hideHint(),
        (this.skipButtonInitialized = !0),
        (i = "wait"),
        (n = (e = this).findElement_("#" + e.id_ + " .aso-vpaid-skip-btn")),
        (t = function (t) {
          e.skipWaitTitle_ && 0 !== t
            ? ((n.innerHTML = e.skipWaitTitle_.replace(
                "{timer}",
                "<span>" + t + "</span>"
              )),
              n.classList.add(i))
            : ((n.innerHTML = e.skipTitle_), n.classList.remove(i));
        })(this.skipDelay_),
        (a = this.skipDelay_),
        (s = setInterval(function () {
          e.timerPaused || (0 === --a && clearInterval(s), t(a));
        }, 1e3)),
        (n.onclick = function (t) {
          t.preventDefault(),
            0 < a || ((e.attributes_.skippableState = !0), e.skipAd());
        }),
        (n.style.display = "block"));
    }),
    (VpaidWrapper.prototype.stopAd = function () {
      var t;
      this.stopped ||
        ((this.stopped = !0),
        this.log("Stopping ad"),
        (t = this.callEvent_.bind(this)),
        setTimeout(t, 75, ["AdStopped"]));
    }),
    (VpaidWrapper.prototype.setAdVolume = function (t) {}),
    (VpaidWrapper.prototype.getAdVolume = function () {}),
    (VpaidWrapper.prototype.resizeAd = function (t, e, i) {
      this.log("resizeAd " + t + "x" + e + " " + i),
        (this.attributes_.width = t),
        (this.attributes_.height = e),
        (this.attributes_.viewMode = i),
        this.callEvent_("AdSizeChange");
    }),
    (VpaidWrapper.prototype.pauseAd = function () {
      this.log("pauseAd"), this.videoSlot_.pause(), this.callEvent_("AdPaused");
    }),
    (VpaidWrapper.prototype.resumeAd = function () {
      this.log("resumeAd"),
        this.videoSlot_.play(),
        this.callEvent_("AdResumed");
    }),
    (VpaidWrapper.prototype.expandAd = function () {
      this.log("expandAd"),
        (this.attributes_.expanded = !0),
        elem.requestFullscreen && elem.requestFullscreen(),
        this.callEvent_("AdExpanded");
    }),
    (VpaidWrapper.prototype.getAdExpanded = function () {
      return this.log("getAdExpanded"), this.attributes_.expanded;
    }),
    (VpaidWrapper.prototype.getAdSkippableState = function () {
      return this.log("getAdSkippableState"), this.attributes_.skippableState;
    }),
    (VpaidWrapper.prototype.collapseAd = function () {
      this.log("collapseAd"), (this.attributes_.expanded = !1);
    }),
    (VpaidWrapper.prototype.skipAd = function () {
      this.attributes_.skippableState &&
        ((this.stopped = !0), this.callEvent_("AdSkipped"));
    }),
    (VpaidWrapper.prototype.subscribe = function (t, e, i) {
      this.eventsCallbacks_[e] = t.bind(i);
    }),
    (VpaidWrapper.prototype.unsubscribe = function (t) {
      this.eventsCallbacks_[t] = null;
    }),
    (VpaidWrapper.prototype.getAdWidth = function () {
      return this.attributes_.width;
    }),
    (VpaidWrapper.prototype.getAdHeight = function () {
      return this.attributes_.height;
    }),
    (VpaidWrapper.prototype.getAdRemainingTime = function () {
      var t = new Date().getTime();
      return this.getAdDuration() - (t - this.startTime_) / 1e3;
    }),
    (VpaidWrapper.prototype.getAdDuration = function () {
      return this.log("get duration"), this.attributes_.duration;
    }),
    (VpaidWrapper.prototype.getAdCompanions = function () {
      return this.attributes_.companions;
    }),
    (VpaidWrapper.prototype.getAdIcons = function () {
      return this.attributes_.icons;
    }),
    (VpaidWrapper.prototype.getAdLinear = function () {
      return this.attributes_.linear;
    }),
    (VpaidWrapper.prototype.log = function (t) {}),
    (VpaidWrapper.prototype.callEvent_ = function (t) {
      t in this.eventsCallbacks_ && this.eventsCallbacks_[t]();
    }),
    (VpaidWrapper.prototype.findElement_ = function (t) {
      var e = document.querySelector(t);
      if (null == e)
        try {
          e = parent.document.querySelector(t);
        } catch (t) {
          return null;
        }
      return e;
    }),
    function () {
      return new VpaidWrapper();
    });
