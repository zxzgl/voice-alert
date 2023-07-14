if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  var httpurl = "";
  uni.getStorage({
    key: "HTTPURL",
    success: function(res) {
      httpurl = res.data;
    },
    fail: function(res) {
    }
  });
  const audioUrl = "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3";
  const _sfc_main$1 = {
    data() {
      return {
        title: "innerAudioContext",
        isPlaying: false,
        isPlayEnd: false,
        currentTime: 0,
        duration: 100,
        timer: null,
        // 定时器名称 
        url: httpurl
      };
    },
    computed: {
      // position() {
      // 	return this.isPlayEnd ? 0 : this.currentTime;
      // },
      playImage() {
        return this.isPlaying ? "/static/pause.png" : "/static/play.png";
      }
    },
    onLoad() {
      this._isChanging = false;
      this._audioContext = null;
      this.createAudio();
    },
    onUnload() {
      if (this._audioContext != null && this.isPlaying) {
        this.stop();
      }
    },
    // mounted() {
    // 	window.play = this.play;
    // 	window.neverStop = this.neverStop;
    // },
    methods: {
      formSubmit: function(e) {
        formatAppLog("log", "at pages/index/index.vue:89", "form发生了submit事件，携带数据为：" + JSON.stringify(e.detail.value));
        uni.setStorage({
          key: "HTTPURL",
          data: e.detail.value.input
        });
        uni.showToast({
          title: "配置成功",
          duration: 500
        });
        this.neverStop();
      },
      formReset: function(e) {
        formatAppLog("log", "at pages/index/index.vue:101", "清空数据");
      },
      createAudio() {
        var innerAudioContext = this._audioContext = uni.createInnerAudioContext();
        innerAudioContext.autoplay = false;
        innerAudioContext.src = audioUrl;
        innerAudioContext.obeyMuteSwitch = false;
        innerAudioContext.onPlay(() => {
          formatAppLog("log", "at pages/index/index.vue:109", "开始播放");
        });
        innerAudioContext.onTimeUpdate((e) => {
          if (this._isChanging === true) {
            return;
          }
          this.currentTime = innerAudioContext.currentTime || 0;
          this.duration = innerAudioContext.duration || 0;
        });
        innerAudioContext.onEnded(() => {
          this.currentTime = 0;
          this.isPlaying = false;
          this.isPlayEnd = true;
        });
        innerAudioContext.onError((res) => {
          this.isPlaying = false;
          formatAppLog("log", "at pages/index/index.vue:125", res.errMsg);
          formatAppLog("log", "at pages/index/index.vue:126", res.errCode);
        });
        return innerAudioContext;
      },
      onchanging() {
        this._isChanging = true;
      },
      onchange(e) {
        this._audioContext.seek(e.detail.value);
        this._isChanging = false;
      },
      play() {
        if (this.isPlaying) {
          this.pause();
          return;
        }
        this.isPlaying = true;
        this._audioContext.play();
      },
      pause() {
        this._audioContext.pause();
        this.isPlaying = false;
      },
      stop() {
        this._audioContext.stop();
        this.isPlaying = false;
      },
      // swithchvibrate() {
      // 	uni.setStorage({
      // 		key: 'vibrate',
      // 		data: 0,
      // 		success: function() {
      // 			uni.showModal({
      // 				title: '提示',
      // 				content: '设置成功',
      // 			});
      // 		}
      // 	});
      // },
      neverStop() {
        uni.showToast({
          title: "任务启动",
          duration: 1e3
        });
        this.timer = setInterval(() => {
          this.getChart();
        }, 3e4);
      },
      // 在里面不断发送请求
      getChart() {
        uni.getStorage({
          key: "HTTPURL",
          success: function(res) {
            httpurl = res.data;
          },
          fail: function() {
            return;
          }
        });
        if (httpurl == "") {
          return;
        }
        uni.request({
          url: httpurl,
          dataType: "text"
        }).then((res) => {
          formatAppLog("log", "at pages/index/index.vue:206", "request success", res);
          if (res.data === "bad") {
            uni.vibrateLong({});
            this.play();
            const bgAudioManager = uni.getBackgroundAudioManager();
            bgAudioManager.title = "致爱丽丝";
            bgAudioManager.singer = "暂无";
            bgAudioManager.coverImgUrl = "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/music-a.png";
            bgAudioManager.src = "https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3";
            bgAudioManager.play();
          }
        }).catch((err) => {
          formatAppLog("log", "at pages/index/index.vue:221", err);
          uni.showModal({
            content: err.errMsg,
            showCancel: false
          });
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", null, [
        vue.createCommentVNode(' 			<view class="uni-common-mt">\r\n				<slider :value="position" :min="0" :max="duration" @changing="onchanging" @change="onchange"></slider>\r\n			</view> '),
        vue.createElementVNode("view", { class: "play-button-area" }, [
          vue.createElementVNode("image", {
            class: "icon-play",
            src: $options.playImage,
            onClick: _cache[0] || (_cache[0] = (...args) => $options.neverStop && $options.neverStop(...args))
          }, null, 8, ["src"])
        ]),
        vue.createCommentVNode(` 				<view class="uni-form-item uni-column">\r
					<view class="title">报警音量控制</view>\r
					<slider value="5" min='1' max='10' name="slider" show-value></slider>\r
				</view> `),
        vue.createCommentVNode(' 				<view class="uni-list-cell uni-list-cell-pd">\r\n						<view class="uni-list-cell-db">是否开启震动</view>\r\n						<switch name="vibrate" @change="swithchvibrate" />\r\n				</view> '),
        vue.createElementVNode(
          "form",
          {
            onSubmit: _cache[2] || (_cache[2] = (...args) => $options.formSubmit && $options.formSubmit(...args)),
            onReset: _cache[3] || (_cache[3] = (...args) => $options.formReset && $options.formReset(...args))
          },
          [
            vue.createElementVNode("view", { class: "uni-form-item uni-column" }, [
              vue.createElementVNode("view", { class: "title" }, "服务器地址:端口:自定义字符串"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "uni-input",
                  name: "input",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.url = $event),
                  placeholder: "{{url}}"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.url]
              ]),
              vue.createCommentVNode(' <input class="uni-input" name="input"  /> ')
            ]),
            vue.createElementVNode("view", { class: "uni-btn-v" }, [
              vue.createElementVNode("view"),
              vue.createElementVNode("button", {
                type: "primary",
                style: { "margin": "30px" },
                "form-type": "submit"
              }, "Submit")
            ])
          ],
          32
          /* HYDRATE_EVENTS */
        )
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "C:/Users/zhangxing/Documents/HBuilderProjects/alert/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/zhangxing/Documents/HBuilderProjects/alert/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
