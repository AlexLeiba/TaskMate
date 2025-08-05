import { Spacer } from '@/components/ui/spacer';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className='w-full h-[calc(100vh-56px)]'>
      <div className='min-h-[700px] h-full flex flex-col justify-center items-center'>
        <SignIn
          appearance={{
            elements: {
              cardBox: {
                width: '100%',
                maxWidth: '800px',
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
