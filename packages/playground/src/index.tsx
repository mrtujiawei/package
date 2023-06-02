import { createRoot } from 'react-dom/client';
import App from './App';
import '@mrtujiawei/react-components/src/index.less';
import './styles.css';

createRoot(document.querySelector('#app')!).render(<App />);
