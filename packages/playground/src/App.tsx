import { urlParamsToObject } from '@mrtujiawei/utils';
import ListDemo from './demos/ListDemo';
import PullRefreshDemo from './demos/PullRefreshDemo';
import NavBarDemo from './demos/NavBarDemo';
import OverlayDemo from './demos/OverlayDemo';
import ToastDemo from './demos/ToastDemo';
import Particle from './demos/Particle';
import ImageRotateRecover from './demos/ImageRotateRecover';
import Fishs from './demos/Fishs';
// import ChristmasTree from './demos/ChristmasTree';
import '@mrtujiawei/react-components/dist/styles/index.css';
import MediaQuery from './demos/MediaQuery';
import Observer from './demos/Observer';
import Downloader from './demos/DownloaderDemo';
import SwipeDemo from './demos/SwipeDemo';

const demos: Record<string, () => JSX.Element | null> = {
  ListDemo,
  PullRefreshDemo,
  NavBarDemo,
  OverlayDemo,
  ToastDemo,
  Particle,
  ImageRotateRecover,
  Fishs,
  MediaQuery,
  Observer,
  Downloader,
  SwipeDemo,
};

const App = () => {
  const { demo } = urlParamsToObject(window.location.search);
  const Comp = demos[demo] || demos[`${demo}Demo`] || null;
  return Comp && <Comp />;
};

export default App;
