import { Spacer } from '@/components/ui/spacer';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className='w-full h-[calc(100vh-56px)]'>
      <div className='min-h-[800px] h-full flex flex-col justify-center items-center'>
        <SignUp
          appearance={{
            elements: {
              cardBox: {
                width: '100%',
                maxWidth: '800px',
                background: 'black',
              },
              formButtonPrimary:
                'bg-sky-500 hover:bg-sky-500 !shadow-none text-white',
            },
          }}
        />
      </div>
    </div>
  );
}
