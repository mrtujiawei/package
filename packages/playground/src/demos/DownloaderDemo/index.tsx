import { Logger } from '@mrtujiawei/utils';
import { useEffect } from 'react';

const logger = Logger.getLogger('playground');

logger.setDefaultConfig();

const DownloaderDemo = () => {
  // 这里能不能自动获取?
  const list = [
    {
      name: '',
      path: '',
    },
  ];

  useEffect(() => {
    logger.info('Hello World');
  }, []);

  return (
    <ol>
      {list.map((item, index) => (
        <li key={index}>
          <a href={item.path} target="_blank" download={`${item.name}`}>
            ${item.name}
          </a>
        </li>
      ))}
    </ol>
  );
};

export default DownloaderDemo;
