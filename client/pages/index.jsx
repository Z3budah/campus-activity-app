import { useEffect } from 'react';
import { useRouter } from "next/router";
import Image from 'next/image';

import buildClient from "../api/build-client";
import AuthLayout from "../components/auth/AuthLayout";
import Manage from '../components/activity/Manage'
import Audit from '../components/activity/Audit'

const LandingPage = (props) => {
  console.log(props);
  const { currentUser } = props;
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser]);

  if (!currentUser) {
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
            <h1 className="text-wrap mb-1">{"正在跳转到登录页面"}</h1>
          </div>}>
      </AuthLayout>)
  };

  return (
    <>
      {currentUser.role == 'admin' ? <Audit /> : <Manage {...props} />}
    </>
  )
};

LandingPage.getInitialProps = async (context) => {
  // console.log('LANDING PAGE');
  const client = buildClient(context);
  const resp = await client.get('/api/users/currentuser').catch((err) => {
    // console.log(err.message);
    return null
  });
  const data = resp ? resp.data : {};
  return data;
};

export default LandingPage;