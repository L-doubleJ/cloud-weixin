// miniprogram/pages/musicList/musicList.js
let playListId = "";
let limit = 20;
let star = 0;
let musicList = [];
let lockReachBottom = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musicList: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    limit = 20; //解决bug，换了页面后上面定义的不会重新初始变量
    star = 0;
    lockReachBottom = false;
    playListId = options.playListId;
    let obj = wx.getStorageSync("musicList" + playListId);

    if (obj) {
      musicList = obj.musicList;
      this.setData({
        listInfo: obj.listInfo
      });
      this.setMusicList();
    } else {
      this.getMusicList();
    }
  },
  setMusicList() {
    let arr = [];
    if (musicList.length - star < limit) {
      limit = musicList.length - star;
      lockReachBottom = true;
    }
    for (let i = 0; i < limit; i++) {
      arr.push(musicList[star + i]);
    }

    this.setData({
      musicList: this.data.musicList.concat(arr)
    });
  },
  getMusicList() {
    wx.showLoading({
      title: "加载中..."
    });
    wx.cloud
      .callFunction({
        name: "music",
        data: {
          $url: "musicList",
          id: playListId
        }
      })
      .then(res => {
        const resp = res.result.data[0];
        musicList = resp.tracks;
        this.setData({
          listInfo: {
            coverImgUrl: resp.coverImgUrl,
            name: resp.name,
            playListId
          }
        });
        this.setMusicList();
        this._setMusicListStorage();
        wx.hideLoading();
        wx.stopPullDownRefresh();
      });
  },
  _setMusicListStorage() {
    wx.setStorageSync("musicList" + playListId, {
      listInfo: this.data.listInfo,
      musicList
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    limit = 20;
    star = 0;
    this.setData({
      musicList: []
    });
    lockReachBottom = false;
    this.getMusicList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!lockReachBottom) {
      star += limit;
      this.setMusicList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
