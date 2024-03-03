import React, { Suspense } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import routes from './routes';
import { Spin } from 'antd';

const Element = function Element(props) {
  let { component: Component, meta } = props;
  let { title = "校园活动平台-WebApp" } = meta || {};

  document.title = title;
  // route info
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();
  return <Component
    navigate={navigate}
    location={location}
    params={params}
    usp={usp}

  />;
};


export default function RouterView() {
  return <Suspense fallback={<Spin fullscreen size="large" />}>
    <Routes>
      {routes.map(item => {
        let { name, path } = item;
        return <Route key={name}
          path={path}
          element={<Element {...item} />} />;
      })}
    </Routes>
  </Suspense>
};
