import Image from 'next/image';
import LoginForm from '../../components/auth/LoginForm';
import AuthLayout from '../../components/auth/AuthLayout';


export default function register() {

  return (
    <AuthLayout
      image={<Image
        src="/images/auth/02.jpg"
        alt="register image"
        width={433}
        height={576}
      ></Image>}
      content={<LoginForm type='signup' />}>
    </AuthLayout>
  );
};
