/* title: 基本 */
import React from 'react'
import MuxSimpleTable from '..'

const dataSource = Array.from({ length: 10 }).map((v, i) => {
  return {
    id: '用户 ID：' + i,
    money: '金额：' + Math.floor(Math.random() * 10000),
    time: '时间：' + Date.now() + i,
    number: '数字：' + Math.round(Math.random() * 10000),
    per: '百分比：' + i * 10,
  }
})

export default ({ lock }) => {
  const columns = [
    { title: '用户 ID', dataIndex: 'id', width: 300, lock },
    { title: '金额', dataIndex: 'money', width: 200, lock },
    { title: '时间', dataIndex: 'time', width: 300 },
    { title: '数字', dataIndex: 'number', width: 300 },
    { title: '百分比', dataIndex: 'per', width: 400 },
  ]

  return (
    <MuxSimpleTable
      bodyHeight={300}
      columns={columns}
      dataSource={dataSource}
    />
  )
}
