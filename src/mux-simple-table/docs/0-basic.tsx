/* title: 基本 */
import React from 'react'
import MuxSimpleTable from '..'

const dataSource = Array.from({ length: 20000 }).map((v, i) => {
  return {
    id: i,
    money: Math.floor(Math.random() * 10000),
    time: Date.now() + i,
    number: Math.round(Math.random() * 10000),
    per: i * 10,
  }
})

const columns = [
  { title: '用户 ID', dataIndex: 'id', width: 600, lock: 'left' },
  { title: '金额', dataIndex: 'money', width: 100 },
  { title: '时间', dataIndex: 'time', width: 300 },
  { title: '数字', dataIndex: 'number', width: 600 },
  { title: '百分比', dataIndex: 'per', width: 600 },
]

export default () => {
  return (
    <MuxSimpleTable
      bodyHeight={400}
      columns={columns}
      dataSource={dataSource}
    />
  )
}
