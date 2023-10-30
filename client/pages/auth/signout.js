import { useEffect } from "react";
import useRequest from '../../hooks/use-request';
import Router from 'next/router'

export default function signout() {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => { Router.push('/'); }
  })

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      {errors ? errors : <p>Signing you out...</p>}
    </div>

  )

}
