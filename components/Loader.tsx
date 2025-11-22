import { Loader2 } from 'lucide-react';

const Loader = ({ text }: { text?: string }) => {
  return (
    <div className='flex items-center justify-center mt-4 w-full'>
      <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      &nbsp;{text}
    </div>
  );
};

export default Loader;
