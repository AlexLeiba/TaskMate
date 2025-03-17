import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className='flex justify-center items-center h-screen '>
      <SignIn
        appearance={{
          elements: {
            cardBox: {
              width: '500px',
              maxWidth: '800px',
            },
            formButtonPrimary:
              'bg-sky-500 hover:bg-sky-500 !shadow-none text-white',
          },
        }}
      />
    </div>
  );
}
