import BenzAmrRecorder from 'benz-amr-recorder';

/**
 * 一键播放amr格式的base64字符串
 *
 * @param {String} amrBase64Url 播放base64字符串
 * @param {Function} onFinish 播放完成回调
 */
export const amrBase64Play = (function () {
  let lastUrl;
  let player;
  return function (amrBase64Url, onFinish) {
    const url = `data:audio/wav;base64,${amrBase64Url}`;
    if (lastUrl == url && player && player.isInit()) {
      if (player.isPlaying()) {
        player.stop();
      } else {
        player.play();
      }
    } else {
      lastUrl = url;
      player && player.stop();
      player = new BenzAmrRecorder();
      player.initWithUrl(url).then(() => {
        player.play();
      });
    }
    player.onEnded(onFinish);
    player.onStop(onFinish);
    return player.stop;
  };
})();

/**
 * base64音频播放
 * @filename: index.js
 * @author: Mr Prince
 * @date: 2021-02-20 10:26:25
 */
import { Component } from 'react';
import { amrBase64Play } from '@/libs/utils';
import { PlayCircleOutlined, PauseCircleOutlined } from 'icon';

export class AudioMessage extends Component {
  state = {
    isPlaying: false,
  };
  url = '';

  constructor(props) {
    super(props);
    this.url = props.url;
    this.play = this.play.bind(this);
  }

  play() {
    this.setState({
      isPlaying: true,
    });
    amrBase64Play(this.url, () =>
      this.setState({
        isPlaying: false,
      })
    );
  }

  componentWillUnmount() {
    this.state.isPlaying && this.play();
  }

  render() {
    const { isPlaying } = this.state;

    return (
      <span>
        [语音] &nbsp;&nbsp;&nbsp;&nbsp;
        {isPlaying ? (
          <PauseCircleOutlined onClick={this.play} />
        ) : (
          <PlayCircleOutlined onClick={this.play} />
        )}
      </span>
    );
  }
}
