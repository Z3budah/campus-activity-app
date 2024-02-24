import auth from './auth.module.less'
const AuthLayout = ({ image, content }) => {
  return (
    <div className={auth.container}>
      <div className={auth.login}>
        <div className={`${auth.bgimage} ${auth.dnone} ${auth.dblock}`}>
          {image}
        </div>
        <main className='mt-0'>{content}</main>
      </div>
    </div>
  );
};

export default AuthLayout;
