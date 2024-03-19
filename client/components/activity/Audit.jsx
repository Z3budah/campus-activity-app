
import React, { useState, useEffect } from 'react'
/* antd */
import './manage.less'
import { Button, Tag, Table, Popconfirm, message } from 'antd';
/* request */
import { updateState, getActivity } from '../../api/activities';
/* redux */
import { connect } from 'react-redux';
import action from '../../store/actions';

import { useRouter } from 'next/router';
import Link from 'next/link'

/* Date Process */
import { formateTime } from '../../public/timeutils';

const Audit = function audit(props) {
  /* getState from props & ActionCreator */
  let { actiList, queryAllList, updateActiById } = props;

  /*column data*/
  const columns = [
    {
      title: '活动',
      width: '40%',
      ellipsis: true,
      render: (_, record) => {
        let { id, title } = record;
        return (
          <Link href="/activities/[activityId]" as={`/activities/${id}`}>
            {title}
          </Link>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text) => {
        switch (+text) {
          case 0:
            return '待审核';
          case 1:
            return '不通过';
          case 2:
            return '进行中';
          case 3:
            return '已完成';
        }
      }
    },
    {
      title: '时间',
      render: (_, record) => {
        let { time, state } = record;
        let textStyle, text;
        if (state === 3) {
          textStyle = { color: 'grey' };
          text = time.end ? formateTime(time.end.toString(), 'list') : 'N/A';
        } else {
          textStyle = { color: 'black' };
          text = formateTime(time.start.toString(), 'list');
        }
        return <span style={textStyle}>{text}</span>;
      }
    },
    {
      title: '操作',
      render: (_, record) => {
        let { id, state } = record;
        return (<>
          {+state === 0 ?
            <>
              <Popconfirm title="确认通过该活动申请吗?"
                onConfirm={passHandler.bind(null, id)}>
                <Button type='link'>通过</Button>
              </Popconfirm>
              <Popconfirm title="确认驳回该活动申请吗?"
                onConfirm={failHandler.bind(null, id)}>
                <Button type='link'>驳回</Button>
              </Popconfirm>
            </> : <p style={{ color: 'grey' }}>活动已审核</p>}
        </>);
      }
    },

  ];

  /*related State*/
  let [selectedIndex, setSelectedIndex] = useState(0),
    [tableData, setTableData] = useState([]),
    [tableLoading, setTableLoading] = useState(false);

  /*process table data*/
  /*first time render: dispatch activities list to redux*/
  useEffect(() => {
    (async () => {
      if (!actiList) {
        setTableLoading(true);
        await queryAllList();
        setTableLoading(false);
      }
    })();
  }, []);

  /*select table data depends on state*/
  useEffect(() => {
    if (!actiList) {
      setTableData([]);
      return;
    };
    if (selectedIndex === 3) {
      actiList = actiList.filter(item => {
        return +item.state >= (selectedIndex - 1);
      });
    }
    else if (selectedIndex !== 0) {
      actiList = actiList.filter(item => {
        return +item.state === (selectedIndex - 1);
      });
    }

    setTableData(actiList);
  }, [actiList, selectedIndex])


  const passHandler = async (id) => {
    try {
      const response = await updateState(2, id);
      message.success(response.data.title + "活动已通过");
      updateActiById(id);
    } catch (error) {
      message.error('当前操作失败，请稍后重试', error);
    }
  }

  const failHandler = async (id) => {
    try {
      const response = await updateState(1, id);
      message.success(response.data.title + "活动不通过");
      updateActiById(id);
    } catch (error) {
      message.error('当前操作失败，请稍后重试', error);
    }
  }


  const router = useRouter();
  /*view binding*/
  return (
    <div className='acti-box'>
      {/*header*/}
      <div className='header'>
        <h2 className='title'>活动审核</h2>
      </div>
      {/*tag*/}
      <div className="tag-box">
        {['全部', '待审核', '不通过', '已通过'].map((item, index) => {
          return <Tag className="tag" key={index}
            color={index === selectedIndex ? '#1677ff' : ''}
            onClick={() => {
              setSelectedIndex(index);
            }}>{item}</Tag>;
        })}
      </div>

      {/*table*/}
      <Table dataSource={tableData}
        columns={columns}
        loading={tableLoading}
        pagination={false}
        rowKey="id" />

    </div>
  );

}

export default connect(
  state => state.acti,
  action.acti
)(Audit);