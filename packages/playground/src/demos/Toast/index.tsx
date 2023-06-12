import { toast } from '@mrtujiawei/react-components';

const ToastDemo = () => {
  const showToast = () => {
    toast(<>Hello World</>, {
      lockScroll: true,
    });
  };

  return (
    <div style={{height: 1000}}>
      <button onClick={showToast}>显示 toast</button>
    </div>
  );
};

export default ToastDemo;
