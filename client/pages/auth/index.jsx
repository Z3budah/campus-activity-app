import { useEffect } from 'react';
import Image from 'next/image';

import { useRouter } from "next/router";

import buildClient from "../../api/build-client";
import AuthLayout from "../../components/auth/AuthLayout";

const LandingPage = ({ currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser]);

  return (
    <AuthLayout
      image={<Image
        src="/images/auth/03.jpg"
        alt="index image"
        width={433}
        height={576}
      ></Image>}
      content={
        <div className='alert alert-danger mt-5 w-full'>
          <h4>Ooops...</h4>
          <h1 className="text-wrap mb-1">{currentUser ? "正在跳转到活动页面" : "“您尚未登录，请登录后再继续。”"}</h1>
        </div>}>
    </AuthLayout>
  )
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const resp = await client.get('/api/users/currentuser').catch((err) => {
    return null
  });
  const data = resp ? resp.data : {};
  return data;
};

export default LandingPage;