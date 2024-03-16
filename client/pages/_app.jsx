import 'bootstrap/dist/css/bootstrap.css'
import "../static/globals.less";

import buildClient from '../api/build-client';

import Header from '../components/header';
import SideNav from '../components/SideNav';
import { useRouter } from 'next/router';

/*REDUX*/
import { Provider } from 'react-redux';
import store from '../store';



const AppComponent = ({ Component, pageProps, currentUser }) => {
  const router = useRouter();
  const { pathname } = router;

  // const noSideNavPaths = ['/auth/login', '/auth/register', '/auth/signout'];
  // const shouldHideSideNav = noSideNavPaths.includes(pathname);

  return <div>
    <Header currentUser={currentUser} />
    <Provider store={store} >
      {currentUser ?
        (<SideNav isAdmin={currentUser.role == 'admin'}>
          < Component currentUser={currentUser} {...pageProps} />
        </SideNav>) :
        (< Component currentUser={currentUser} {...pageProps} />)
      }
    </Provider>
  </div>
};

AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const resp = await client.get('/api/users/currentuser').catch((err) => {
    console.log(err.message);
    return { currentUser: null };
  });

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, resp.currentUser);
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