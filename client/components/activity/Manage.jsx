
import React, { useState, useEffect } from 'react';
/* antd */
import './manage.less'
import { Button, Tag, Table, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
/* request */
import { deleteActivity, updateState, getActivity, updateActivity } from '../../api/activities';
/* redux */
import { connect } from 'react-redux';
import action from '../../store/actions';

/* router */
import { useRouter } from 'next/router';
import Link from 'next/link'

/* Date Process */
import { formateTime } from '../../public/timeutils';


const Manage = function manage(props) {
  /* getState from props & ActionCreator */
  let { actiList, queryAllList, deleteActiById, updateActiById, finishActiById } = props;

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
          <Popconfirm title="确认删除活动吗?"
            onConfirm={removeHandler.bind(null, id)}>
            <Button type='link'>删除</Button>
          </Popconfirm>
          {+state === 2 ?
            <Popconfirm title="确认标记活动为已完成吗?"
              onConfirm={finishHandler.bind(null, id)}>
              <Button type='link'>完成</Button>
            </Popconfirm> : null}
          {+state === 0 ?
            <Popconfirm title="确认修改活动信息吗?活动将被重新审核。"
              onConfirm={updateHandler.bind(null, id)}>
              <Button type='link'>编辑</Button>
            </Popconfirm> : null}

        </>);
      }
    },

  ];


  /*related State*/
  let [selectedIndex, setSelectedIndex] = useState(0),
    [tableData, setTableData] = useState([]),
    [tableLoading, setTableLoading] = useState(false);

  const router = useRouter();

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
    if (selectedIndex !== 0) {
      actiList = actiList.filter(item => {
        return +item.state === (selectedIndex - 1);
      });
    }
    setTableData(actiList);
  }, [actiList, selectedIndex])

  const removeHandler = async (id) => {
    try {
      try {
        const response = await deleteActivity(id);
        message.success(response.data.title + "活动已删除");
        deleteActiById(id);
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }
    } catch (_) { }
  }
  const finishHandler = async (id) => {
    try {
      try {
        //state:3, finished 
        const resp = await getActivity(id);
        if (resp.data) {
          let activity = { ...resp.data };
          activity.time.end = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss');
          activity.state = 3;
          const response = await updateActivity(activity, id);
          message.success(response.data.title + "活动已完成");
          //queryData();
          finishActiById(id, activity.time.end);
        }
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }
    } catch (_) { }
  }

  const updateHandler = async (id) => {
    try {
      try {
        //state:3, finished
        // const response = await updateState(2, id);
        // message.success(response.data.title + "活动已过审");
        // updateActiById(id);
        router.push(`/activities/edit/${id}`)
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }

    } catch (_) { }
  }


  /*view binding*/
  return (
    <div className='acti-box'>
      {/*header*/}
      <div className='header'>
        <h2 className='title'>我的活动</h2>
        <Button type="primary" onClick={() => {
          router.push('/activities/create');
        }}>创建新活动</Button>
      </div>
      {/*tag*/}
      <div className="tag-box">
        {['全部', '审核中', '不通过', '进行中', '已完成'].map((item, index) => {
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
)(Manage);