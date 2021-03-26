import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { AutoComplete, Statistic, Progress, Row, Col, Spin, Button  } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { StatisticTable } from '../../components/StatisticTable/StatisticTable';
import { useHttp } from "../../hooks/http.hook";
import { countStatistic } from '../../functions/countStatistic';
import './statisticPage.css'

const defaultValue = 'All opponents';

export const StatisticPage = () => {
  const { token, userId } = useSelector(state => state.auth);
  const [value, setValue] = useState(defaultValue);
  const [options, setOptions] = useState([]);
  const [opponentId, setOpponentId] = useState(defaultValue);
  const [matchHistory, setMatchHistory] = useState([]);
  const [winRate, setWinRate] = useState(0);
  const [numberOfGames, setNumberOfGames] = useState(null);
  const [avgMoves, setAvgMoves] = useState(null);
  const { request } = useHttp();
  const { request: requestHistory, loading } = useHttp();

  useEffect(() => {
    let cancel = false;
    request(
        "/api/statistic/userlist", 
        "POST", 
        JSON.stringify({searchStr: value}),
        { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    ).then(response => {
        if(cancel) return;
        const newOptions = response.foundUsers
            .filter(item => item._id !== userId)
            .map(item => {
                return {
                    label: item.nickname,
                    value: item._id
                }
            })
    
        if(!value) {
            newOptions.unshift({
                label: defaultValue,
                value: defaultValue
            });
        }
        
        setOptions(
            newOptions
        );
    }).catch(err => console.log("Error:", err));

    return () => cancel = true
  }, [value, request, token, userId])
  

  const onSelect = (value, optionInst) => {
    setValue(optionInst.label);
    setOpponentId(value);
  };

  const onChange = (data) => {
    setValue(data);
  };

  useEffect(() => { 
      let cancel = false;
      requestHistory(
        "/api/statistic/matches", 
        "POST", 
        JSON.stringify({ opponentId }),
        { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        })
        .then(matches => {
            if(cancel) return;

            const stat = countStatistic(matches, userId);
            if(!stat) {
                setMatchHistory([]);
                setWinRate(0);
                setNumberOfGames(0);
                setAvgMoves(0);
                return;
            }

            setMatchHistory(stat.tableDataSource);
            setWinRate(stat.winRate);
            setNumberOfGames(stat.games);
            setAvgMoves(stat.avgMoves);

            console.log("Mathes from back:", matches);
        })
            .catch(err => console.log("Error", err));
        
        return () => cancel = true
  }, [opponentId, token, requestHistory, userId])

    return (
        <div className='statistic-container'>
            <div className="statistic-content">
                <Row justify="center" gutter={[0, 16]}>
                    <Col 
                        xs={{ span: 15 }}
                        sm={{ span: 12 }}
                        md={{ span: 10 }}
                        lg={{ span: 7 }}
                        xl={{ span: 6 }}
                        xxl={{ span: 5 }}
                    >
                        <div className="stat-container">
                            <AutoComplete
                                value={value}
                                options={options}
                                style={
                                    { 
                                        width: "100%",
                                    }
                                }
                                onSelect={onSelect}
                                onChange={onChange}
                                placeholder="Choose opponent"
                                notFoundContent="Not found"
                                defaultValue={defaultValue}
                            />
                        </div>
                    </Col>
                </Row>

                {
                    loading ?
                        <div className="spin-container">
                            <Spin size='large'/> 
                        </div>
                        :
                        <>
                            <Row justify="center" align="middle" gutter={[0, 16]}>
                                <Col 
                                    xs={{ span: 22 }}
                                    sm={{ span: 7 }}
                                    md={{ span: 7 }}
                                    lg={{ span: 7 }}
                                    xl={{ span: 7 }}
                                    xxl={{ span: 7 }}
                                >
                                    <Statistic title="Games" value={numberOfGames} />
                                </Col>
                                <Col 
                                    xs={{ span: 22 }}
                                    sm={{ span: 7 }}
                                    md={{ span: 7 }}
                                    lg={{ span: 7 }}
                                    xl={{ span: 7 }}
                                    xxl={{ span: 7 }}
                                >
                                    <Statistic title="AVG moves to win" value={avgMoves} />
                                </Col>
                                <Col 
                                    xs={{ span: 22 }}
                                    sm={{ span: 7 }}
                                    md={{ span: 7 }}
                                    lg={{ span: 7 }}
                                    xl={{ span: 7 }}
                                    xxl={{ span: 7 }}
                                >
                                    <div className="winrate-container">
                                        <Progress 
                                            percent={winRate}
                                            strokeColor='green'
                                            type='circle'
                                            trailColor='red'
                                            width={80}
                                            format={percent => `${percent} %`}
                                        />     
                                    </div>      
                                </Col>
                            </Row>
                            <StatisticTable dataSource={matchHistory} />
                        </>
                }       
            </div>
            <div className="stat-backToMenue-container">
                <Link to="/main_menu">
                    <Button 
                        shape='circle'
                        icon={<ArrowLeftOutlined style={{ fontSize: '30px' }} />}
                        type='text'
                    /> 
                </Link>
            </div>
        </div>
    )
}