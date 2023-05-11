import toast from 'react-hot-toast';

export default function warningToast(text: string, duration?: number) {
  return toast(
    `${text} ${duration ? `Please wait ${duration / 1000} seconds` : ''}`,
    {
      icon: '⚠️',
      style: {
        background: 'yellow',
      },
      duration: duration,
      id: text,
    }
  );
}
