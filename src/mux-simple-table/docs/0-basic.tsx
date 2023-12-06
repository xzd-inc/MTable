/* title: 基本 */
import React from 'react'
import MuxSimpleTable from '..'

// const dataSource = Array.from({ length: 1000 }).map((v, i) => {
//   return {
//     id: '用户 ID：' + i,
//     money: '金额：' + Math.floor(Math.random() * 10000),
//     time: '时间：' + Date.now() + i,
//     number: '数字：' + Math.round(Math.random() * 10000),
//     per: '百分比：' + i * 10,
//   }
// })

const dataSource = [
  {
    id: 1, money: 1, time: 1, number: 1, per: 1,
    children: [
      { id: 3, money: 3, time: 3, number: 3, per: 3 },
      {
        id: 4, money: 4, time: 4, number: 4, per: 4,
        children: [
          { id: 5, money: 5, time: 5, number: 5, per: 5 },
        ]
      },
    ]
  },
  { id: 2, money: 2, time: 2, number: 2, per: 2 },
]

export default ({ lock }) => {
  const columns = [
    { title: '用户 ID', dataIndex: 'id', width: 300, lock },
    { title: '金额', dataIndex: 'money', width: 200, lock },
    { title: '时间', dataIndex: 'time', width: 300 },
    { title: '数字', dataIndex: 'number', width: 300 },
    { title: '百分比', dataIndex: 'per', width: 400, lock: 'right' },
  ]

  return (
    <MuxSimpleTable
      isTree={true}
      bodyHeight={300}
      columns={columns}
      dataSource={dataSource}
    />
  )
}
