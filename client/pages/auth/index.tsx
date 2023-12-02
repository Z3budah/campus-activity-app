import buildClient from "../../api/build-client";

const LandingPage = ({ currentUser }) => {
  // console.log(currentUser);
  return (
    currentUser ? <h1>Sign in</h1> : <h1>Not sign in</h1>
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