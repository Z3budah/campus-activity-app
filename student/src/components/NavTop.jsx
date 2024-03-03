import React from 'react';
import PropTypes from 'prop-types';
import { Button, Flex } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import './NavTop.less';

const NavTop = function NavTop(props) {
  let { title } = props;

  const handleBack = () => {
    //...
  };

  return (
    <Flex >
      <Button type="text" icon={<LeftOutlined />} onClick={handleBack} />
      <div className="navtop-title">{title}</div>
    </Flex>
  )
};


NavTop.defaultProps = {
  title: '个人中心'
};

NavTop.propTypes = {
  title: PropTypes.string
};

export default NavTop;