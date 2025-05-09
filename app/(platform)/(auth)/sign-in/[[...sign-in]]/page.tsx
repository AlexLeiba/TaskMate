import { Spacer } from '@/components/ui/spacer';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className=' w-full h-full'>
      <Spacer size={14} />
      <div className='mt-4 md:mt-0 lg:mt-0 w-full flex justify-center items-center    lg:h-[calc(100vh-160px)] md:h-[calc(100vh-150px)] sm:h-[calc(100vh-400px)]'>
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
