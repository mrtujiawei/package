const PLATFORM = {
  Android: function () {
    return navigator.userAgent.match(/Android/i) ? true : false;
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i) ? true : false;
  },
  IOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) ? true : false;
  },
  any: function () {
    return (
      PLATFORM.Android() ||
      PLATFORM.BlackBerry() ||
      PLATFORM.IOS() ||
      PLATFORM.Windows()
    );
  },
  WeiXin: function () {
    return navigator.userAgent.match(/MicroMessenger/i) ? true : false;
  },
  PC: function () {
    const userAgentInfo = navigator.userAgent;
    const Agents = [
      "Android",
      "iPhone",
      "SymbianOS",
      "Windows Phone",
      "iPad",
      "iPod"
    ];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }
};

// 获取当前平台
export default function isCorrespondingPlatform(platform) {
  return PLATFORM[platform] ? PLATFORM[platform]() : false;
}
