import buildClient from "../api/build-client";

const LandingPage = () => {
  return (
    <h1>index page</h1>
  )
};

// LandingPage.getInitialProps = async (context) => {
//   // console.log('LANDING PAGE');
//   const client = buildClient(context);
//   const resp = await client.get('/api/users/currentuser').catch((err) => {
//     // console.log(err.message);
//     return null
//   });
//   const data = resp ? resp.data : {};
//   return data;
// };

export default LandingPage;

