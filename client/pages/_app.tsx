import 'bootstrap/dist/css/bootstrap.css'
import "../static/globals.less";
import buildClient from '../api/build-client';
import Header from '../components/header';
import { useRouter } from 'next/router';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  const router = useRouter();
  const authHeader = router.pathname.startsWith('/auth');

  return <div>
    {authHeader && <Header currentUser={currentUser} />}
    < Component {...pageProps} />
  </div>
};
AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const resp = await client.get('/api/users/currentuser').catch((err) => {
    console.log(err.message);
    return null;
  });

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  };

  // if (resp) return resp.data;
  // else return {};
  const data = resp ? resp.data : {};
  return {
    pageProps,
    ...data
  }
};


export default AppComponent;