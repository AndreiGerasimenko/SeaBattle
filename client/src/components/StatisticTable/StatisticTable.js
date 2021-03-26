import React from 'react'
import { Table, Tag } from 'antd';
import moment from 'moment';
import './statisticTable.css';

const columns = [
    {
      title: 'Opponent',
      dataIndex: 'opponent',
      key: 'opponent',
      width: '30%'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '25%',
      align: 'center',
      render: date => {
        return moment(date).format("DD MMM YYYY HH:mm");
      }

    },
    {
      title: 'Moves',
      dataIndex: 'moves',
      key: 'moves',
      width: '17%',
      responsive: ['xxl', 'xl', 'lg', 'md', 'sm',],
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      align: 'center',
      render: status => {
          const color = status === 'win' ? 'green' : 'volcano';
          return (
            <>
                {
                    <Tag color={color}>
                        {
                            status.toUpperCase()
                        }
                    </Tag>
                }
            </>
          ) 
      }
    },
]

export const StatisticTable = ({ dataSource }) => {
    return (
        <Table 
            columns={columns}
            dataSource={dataSource}
            pagination={false} 
            sticky={true}
            scroll={{ y: '90vh' }}
        />
    )
}