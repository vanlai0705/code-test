/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TableProps } from 'antd';
import { Button, Input, Radio, Select, Space, Table, Tag } from 'antd';
import React, { useCallback, useState } from "react";
import { ToastContainer } from 'react-toastify';
import { Task, useTaskCreator } from './hooks';

enum Status {
  Incomplete = "Incomplete",
  Completed = "Completed"
}

const App: React.FC = () => {
  const { tasks, createTask, updateTaskStatus, filterTasksByStatus } = useTaskCreator()
  const [name, setName] = useState("")
  const [optionSelected, setOptionSelected] = useState("ALL")

  const columns: TableProps<Task>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }: any) => (
        <Tag color={status === Status.Completed ? "green" : "yellow"} >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, row) => (
        <Radio.Group onChange={(e) => updateTaskStatus(row.id, e.target.value)} value={row.status}>
          <Space direction="vertical">
            <Radio value={"Completed"}>Completed</Radio>
            <Radio value={'Incomplete'}>Incomplete</Radio>
          </Space>
        </Radio.Group>
      ),
    },
  ];

  const onChange = useCallback((e: any) => {
    setName(e.target.value)
  }, [])

  const onSelect = useCallback((e: string) => {
    setOptionSelected(e)
    filterTasksByStatus(e)
  }, [])

  return (
    <div className="app">
      <Space className='mb-4'>
        <Input placeholder='input name task' value={name} onChange={onChange} />
        <Button type="primary" disabled={!name} onClick={() => createTask(name)}>Add New Task</Button>
        <Select options={[
          {
            value: Status.Completed,
            label: Status.Completed
          },
          {
            value: Status.Incomplete,
            label: Status.Incomplete
          },
          {
            value: "ALL",
            label: "ALL"
          }
        ]} value={optionSelected} onChange={onSelect} style={{ width: 160 }} />
      </Space>

      <Table<Task> columns={columns} dataSource={tasks} className='h-50' />
      <ToastContainer />

    </div>
  )
};

export default App;