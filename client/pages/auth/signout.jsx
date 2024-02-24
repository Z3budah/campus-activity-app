import { useEffect } from "react";
import useRequest from '../../hooks/use-request';
import Image from 'next/image';
import Router from 'next/router'
import AuthLayout from "../../components/auth/AuthLayout";

export default function signout() {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => { Router.push('/auth'); }
  })

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>

      {errors ? errors : <AuthLayout
        image={<Image
          src="/images/auth/03.jpg"
          alt="index image"
          width={433}
          height={576}
        ></Image>}
        content={
          <div className='mt-5 w-full'>

            <h1 className="text-wrap mb-1">“正在登出...”</h1>
          </div>}>
      </AuthLayout>}
    </div>
  )

}
