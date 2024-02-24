import Image from 'next/image';
import LoginForm from '../../components/auth/LoginForm';
import AuthLayout from '../../components/auth/AuthLayout';


export default function login() {

  return (
    <AuthLayout
      image={<Image
        src="/images/auth/01.jpg"
        alt="login image"
        width={433}
        height={576}
      ></Image>}
      content={<LoginForm type='signin' />}>
    </AuthLayout>
  );
};
