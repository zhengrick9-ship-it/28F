App({
  onLaunch() {
    if (wx.cloud) {
      try {
        wx.cloud.init({
          traceUser: true
        });
      } catch (error) {
        console.warn('Cloud init failed, local menu fallback enabled.', error);
      }
    }
  },

  globalData: {
    appName: '先吃饭吧'
  }
});
