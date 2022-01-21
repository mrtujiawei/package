/**
 * videojs 好像不是那么好用，所以我换个播放器
 * @filename: HlsVideoPlayer.js
 * @author: Mr Prince
 * @date: 2021-03-19 12:11:37
 */
import { Component, createRef } from 'react';
import Hls from 'hls.js';
import styles from './index.css';

export class HlsVideoPlayer extends Component {
  player = createRef();
  hls = null;

  state = {
    className: '',
    errorMessage: '',
  };

  componentDidMount() {
    let isLive = false;
    try {
      isLive = !/(start|end)/.test(this.props.src);
    } catch (e) {}
    let hls = new Hls({
      liveSyncDurationCount: isLive ? 2 : 3,
    });
    hls.loadSource(this.props.src);
    hls.attachMedia(this.player.current);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      // let video = this.player.current;
      // video.play();
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      console.log(_, data);
      if (data.type == Hls.ErrorTypes.NETWORK_ERROR) {
        if (data.details == 'levelLoadError') {
          this.props.onError && this.props.onError();
          this.setState({
            errorMessage: '直播已结束或网络连接错误，请重试',
          });
        }
      }
      if (Hls.ErrorTypes.MEDIA_ERROR == data.type) {
        hls.recoverMediaError();
      }
      if (data.fatal) {
        if (404 == data.response?.code) {
          this.props.onError && this.props.onError();
          this.setState({
            errorMessage: '视频流未找到',
          });
        }
      }
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            // try to recover network error
            hls.startLoad();
            break;
          default:
            // cannot recover
            hls.destroy();
            break;
        }
      }
    });

    this.hls = hls;
    if (isLive) {
      this.setState({
        className: 'live-video',
      });
    }
  }

  componentWillUnmount() {
    console.log('关闭视频流');
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }

  render() {
    const { className, style, onError, ...props } = this.props;

    const { errorMessage } = this.state;

    if (errorMessage) {
      return (
        <div
          video
          autoPlay
          preload="auto"
          style={style}
          className={`video-js vjs-default-skin vjs-big-play-centered ${className} ${styles.error}`}
          {...props}
        >
          {errorMessage}
        </div>
      );
    }

    return (
      <video
        muted
        controls
        autoPlay
        preload="auto"
        style={style}
        className={`video-js vjs-default-skin vjs-big-play-centered ${className} ${this.state.className}`}
        ref={this.player}
        {...props}
      ></video>
    );
  }
}

/**
 * 视频播放
 * @filename: index.js
 * @author: Mr Prince
 * @date: 2020-11-17 14:28:36
 */
import React from 'react';
import { getRandomVideoId } from '@/libs/utils';
import videojs from 'video.js';

export class VideoPlayer extends React.Component {
  player = null;
  videoId = getRandomVideoId();

  createPlayer() {
    let { src } = this.props;
    this.player = videojs(
      `#${this.videoId}`,
      {
        bigPlayButton: true,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false,
        muted: true,
        autoplay: true,
        sources: [
          {
            src,
            type: 'application/x-mpegURL',
          },
        ],
      },
      function onReady() {
        // 不是记录不搞这些
        // if (!/\?start\=\d+\&end\=\d+$/.test(src)) {
        //   return ;
        // }
        let lastWaitingTime = 0;
        let timer = 0;
        this.on('waiting', () => {
          let currentTime = new Date().getTime();
          if (currentTime - lastWaitingTime < 100) {
            let currentTime = this.currentTime();
            if (timer) {
              return;
            }
            timer = setInterval(() => {
              this.currentTime(++currentTime);
            }, 1000);
          }
          lastWaitingTime = currentTime;
        });
        this.on('playing', () => {
          if (timer) {
            clearInterval(timer);
            timer = 0;
          }
        });
      }
    );
  }

  componentDidMount() {
    this.createPlayer();
  }

  componentWillUnmount() {
    this.player && this.player.dispose();
  }

  render() {
    const { className, style, ...props } = this.props;
    return (
      <video
        controls
        preload="auto"
        data-setup="{}"
        id={this.videoId}
        style={style}
        className={`video-js vjs-default-skin vjs-big-play-centered ${className}`}
        {...props}
      />
    );
  }
}
