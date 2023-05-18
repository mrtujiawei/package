import { urlParamsToObject } from '@mrtujiawei/utils';
// import ListDemo from './demos/ListDemo';
// import PullRefreshDemo from './demos/PullRefreshDemo';
// import NavBarDemo from './demos/NavBarDemo';
import OverlayDemo from './demos/OverlayDemo';
// import ToastDemo from './demos/ToastDemo';
// import ImageRotateRecover from './demos/ImageRotateRecover';
import '@mrtujiawei/react-components/dist/styles/index.css';
// import Downloader from './demos/DownloaderDemo';

const demos: Record<string, () => JSX.Element | null> = {
  // ListDemo,
  // PullRefreshDemo,
  // NavBarDemo,
  OverlayDemo,
  // ToastDemo,
  // ImageRotateRecover,
  // Downloader,
};

const App = () => {
  const { demo } = urlParamsToObject(window.location.search);
  const Comp = demos[demo] || demos[`${demo}Demo`] || null;
  return Comp && <Comp />;
};

export default App;
