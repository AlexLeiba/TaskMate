import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className='flex justify-center items-center h-screen '>
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
  );
}
