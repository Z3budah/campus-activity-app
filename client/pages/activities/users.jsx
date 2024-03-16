import React, { useState, useEffect } from 'react';
import SideNav from '../../components/SideNav';
/* request */
import { getUsers, deleteUser, updateUser } from '../../api/users';
/* antd */
import { Button, Table, Popconfirm, message, Modal, Form, Input } from 'antd';

/* redux */
import { connect } from 'react-redux';
import action from '../../store/actions';
import { useRouter } from 'next/router';

const Users = function users(props) {
  /* getState from props & ActionCreator */
  let { currentUser, userList, queryAllUsers, deleteUserById } = props;


  let [tableData, setTableData] = useState([]),
    [tableLoading, setTableLoading] = useState(false),
    [modalVisible, setModalVisible] = useState(false),
    [confirmLoading, setConfirmLoading] = useState(false),
    [selectedUser, setSelectedUser] = useState({});

  let [formIns] = Form.useForm();

  /*column data*/
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
    },
    {
      title: '用户类型',
      dataIndex: 'role',
      render: (text) => {
        switch (text) {
          case "admin":
            return '管理员';
          case "publisher":
            return '发布者';
          case "student":
            return '学生';
        }
      }
    },
    {
      title: '操作',
      render: (_, record) => {
        return (<>
          <Popconfirm title="确认删除该用户吗?"
            onConfirm={() => removeHandler(record.id)}>
            <Button type='link'>删除</Button>
          </Popconfirm>
          <Popconfirm title="确认修改用户密码吗?"
            onConfirm={() => {
              setSelectedUser(record);
              setModalVisible(true);
            }}>
            <Button type='link'>修改</Button>
          </Popconfirm>
        </>);
      }
    },

  ];


  /*close dialog and clean form content*/
  const closeModal = () => {
    setModalVisible(false);
    setConfirmLoading(false);

    formIns.resetFields();
  };

  /* submit update*/
  const submit = async () => {
    try {
      await formIns.validateFields();
      let data = formIns.getFieldsValue();
      data.id = selectedUser.id;

      setConfirmLoading(true);

      try {
        const response = await updateUser(data);
        message.success(selectedUser.email + "用户修改成功");
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }

      closeModal();
      queryAllUsers();
    } catch (_) { }
    setConfirmLoading(false);
  };

  /*process table data*/
  /*first time render: dispatch activities list to redux*/
  useEffect(() => {
    (async () => {
      if (!userList) {
        setTableLoading(true);
        await queryAllUsers();
        setTableLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!userList) {
      setTableData([]);
      return;
    };
    setTableData(userList);
  }, [userList])


  const removeHandler = async (id) => {
    try {
      if (id == currentUser.id) {
        message.error('不能删除当前正在使用的用户，请切换用户再试');
        return;
      }
      try {
        const response = await deleteUser(id);
        message.success(response.data.email + "用户已删除");
        deleteUserById(id);
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }
    } catch (_) { }
  }

  const router = useRouter();

  return (
    <SideNav isAdmin={currentUser.role == 'admin'}>
      <div className='acti-box'>
        {/*header*/}
        <div className='header'>
          <h2 className='title'>用户列表</h2>
          <Button type="primary" onClick={() => {
            router.push('/activities/addUser');
          }}>创建用户</Button>
        </div>

        {/*table*/}
        <Table dataSource={tableData}
          columns={columns}
          loading={tableLoading}
          pagination={false}
          rowKey="id" />

        {/* dialog & form */}
        <Modal title="修改用户"
          open={modalVisible}
          confirmLoading={confirmLoading}
          keyboard={false} maskClosable={false}
          onOk={submit} okText="提交" onCancel={closeModal} cancelText="取消">
          <Form form={formIns}>
            <Form.Item label="用户信息">
              <p className="ant-form-text">用户id:{selectedUser.id}</p>
              <p className="ant-form-text">用户email:{selectedUser.email}</p>
              <p className="ant-form-text">用户类型:{selectedUser.role}</p>
            </Form.Item>
            <Form.Item label="旧密码" name="oldPassword" validateTrigger='onBlur'
              rules={[
                { required: true, message: "旧密码是必填项" },
              ]}>
              <Input.Password />
            </Form.Item>
            <Form.Item label="新密码" name="newPassword" validateTrigger='onBlur'
              rules={[
                { required: true, message: "新密码是必填项" },
              ]}>
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </SideNav>
  )
}

export default connect(
  state => state.user,
  action.user
)(Users);