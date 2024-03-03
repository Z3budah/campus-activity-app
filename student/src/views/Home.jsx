import React, { useState } from 'react';
import HomeHead from '../components/HomeHead';
import _ from '../assets/utils';

const Home = function Home() {
  let [today, setToday] = useState(new Date());
  console.log(_.formatTime(null, '{0}{1}{2}'));
  return (
    <div className="home-box">
      首页

    </div>
  )
};

export default Home;
