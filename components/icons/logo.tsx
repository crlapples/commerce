import clsx from 'clsx';

export default function LogoIcon(props: React.ComponentProps<'img'>) {
  return (
    <img
      src="/favicon.jpg"
      alt={`${process.env.SITE_NAME} logo`}
      {...props}
      className={clsx('h-4 w-4 rounded-sm', props.className)}
    />
  );
}

