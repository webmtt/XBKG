const options = {
    datasCLOUD: [
        // { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: '消息版本号', key: 'version', pinyin: 'version' },
        {
            label: '消息序列号',
            key: 'sequenceNumber',
            pinyin: 'sequenceNumber'
        },
        { label: '消息类型', key: 'messageType', pinyin: 'messageType' },
        { label: '传感器标识', key: 'sensorID', pinyin: 'sensorID' },
        { label: '传感器位置标识', key: 'locationID', pinyin: 'locationID' },
        // { label: '时间', key: 'time', pinyin: 'time' },
        { label: '是否是晴空标志', key: 'isskyclear', pinyin: 'isskyclear' },
        { label: '消息备发时间', key: 'messageTime', pinyin: 'messageTime' },
        {
            label: '是否探测到垂直能见度标志',
            key: 'isvertvis',
            pinyin: 'isvertvis'
        },
        { label: '垂直能见度值', key: 'vervis', pinyin: 'vervis' },
        { label: '云底高度', key: 'cloudbase', pinyin: 'cloudbase' },
        { label: '第一层云高', key: 'ch1ins', pinyin: 'ch1ins' },
        { label: '第二层云高', key: 'ch2ins', pinyin: 'ch2ins' },
        { label: '第三层云高', key: 'ch3ins', pinyin: 'ch3ins' },
        {
            label: '天空状况数据中的第一层云量',
            key: 'amount1',
            pinyin: 'amount1'
        },
        {
            label: '天空状况数据中的第二层云量',
            key: 'amount2',
            pinyin: 'amount2'
        }
    ],
    datasHUMITEMP: [
        { label: '消息序列号', key: 'sequenceNumber', pinyin: 'sequenceNumber' },
        { label: '消息备发时间', key: 'messageTime', pinyin: 'messageTime' },
        {
            label: '10min最高温度(瞬时值)',
            key: 'ta10x',
            pinyin: 'ta10x'
        },
        { label: '1h最低温度(瞬时值)', key: 'ta1hm', pinyin: 'ta1hm' },
        { label: '瞬时水汽压', key: 'vpins', pinyin: 'vpins' },
        // { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: '消息版本号', key: 'version', pinyin: 'version' },
        { label: '10min最低温度(瞬时值)', key: 'ta10m', pinyin: 'ta10m' },
        { label: '瞬时露点值', key: 'tdins', pinyin: 'tdins' },
        {
            label: '瞬时相对湿度',
            key: 'rhins',
            pinyin: 'rhins'
        },
        { label: '传感器标识', key: 'sensorID', pinyin: 'sensorID' },
        { label: '瞬时温度', key: 'tains', pinyin: 'tains' },
        { label: '1h平均温度', key: 'ta1ha', pinyin: 'ta1ha' },
        { label: '消息类型', key: 'messageType', pinyin: 'messageType' },
        {
            label: '传感器位置标识',
            key: 'locationID',
            pinyin: 'locationID'
        },
        // {
        //     label: '时间',
        //     key: 'time',
        //     pinyin: 'time'
        // },
        {
            label: '1h最高温度(瞬时值)',
            key: 'ta1hx',
            pinyin: 'ta1hx'
        },
    ],
    datasPRESS: [
        { label: 'QFE3h变化', key: 'qfesynop3h', pinyin: 'qfesynop3h' },
        { label: '消息序列号', key: 'sequenceNumber', pinyin: 'sequenceNumber' },
        {
            label: '消息备发时间',
            key: 'messageTime',
            pinyin: 'messageTime'
        },
        { label: '过渡层', key: 'fl', pinyin: 'fl' },
        { label: '与SYNOP相关的QFE趋势', key: 'qfesynopt', pinyin: 'qfesynopt' },
        // { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: '过渡层海拔高度', key: 'alt', pinyin: 'alt' },
        { label: '10 min最小场压(最小瞬时值)', key: 'qfem', pinyin: 'qfem' },
        { label: '瞬时气压', key: 'pains', pinyin: 'pains' },
        {
            label: '消息版本号',
            key: 'version',
            pinyin: 'version'
        },
        { label: '传感器标识', key: 'sensorID', pinyin: 'sensorID' },
        { label: '瞬时修正海平面气压(QNH)', key: 'qnhins', pinyin: 'qnhins' },
        { label: '消息类型', key: 'messageType', pinyin: 'messageType' },
        { label: '传感器位置标识', key: 'locationID', pinyin: 'locationID' },
        // {
        //     label: '时间',
        //     key: 'time',
        //     pinyin: 'time'
        // },
        {
            label: '10 min最大场压(最大瞬时值)',
            key: 'qfex',
            pinyin: 'qfex'
        },
        {
            label: '瞬时QFF',
            key: 'qffins',
            pinyin: 'qffins'
        },
        {
            label: '瞬时场面气压(QFE)',
            key: 'qfeins',
            pinyin: 'qfeins'
        },
        {
            label: '陆地测站地面天气报告QFE',
            key: 'qfesynop',
            pinyin: 'qfesynop'
        },
    ],
    datasRAIN: [
        { label: '消息序列号', key: 'sequenceNumber', pinyin: 'sequenceNumber' },
        { label: '消息备发时间', key: 'messageTime', pinyin: 'messageTime' },
        {
            label: '降水传感器是否探测到降水',
            key: 'rainon',
            pinyin: 'rainon'
        },
        { label: '最近60 min内的降水持续时间', key: 'duration_1h', pinyin: 'duration_1h' },
        // { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: '最近60 min的总降水量', key: 'sum_1h', pinyin: 'sum_1h' },
        { label: '消息版本号', key: 'version', pinyin: 'version' },
        { label: '传感器标识', key: 'sensorID', pinyin: 'sensorID' },
        { label: '从降水传感器得到的瞬时降水量', key: 'amount_ins', pinyin: 'amount_ins' },
        {
            label: '消息类型',
            key: 'messageType',
            pinyin: 'messageType'
        },
        { label: '传感器位置标识', key: 'locationID', pinyin: 'locationID' },
        { label: '从降水传感器得到的瞬时总降水量', key: 'sum_ins', pinyin: 'sum_ins' },
        // {
        //     label: '时间',
        //     key: 'time',
        //     pinyin: 'time'
        // }
    ],
    datasVIS: [
        { label: '消息备发时间', key: 'messageTime', pinyin: 'messageTime' },
        { label: 'RVR 1 min平均值', key: 'rvr1a', pinyin: 'rvr1a' },
        {
            label: 'RVR 10 min平均值',
            key: 'rvr10a',
            pinyin: 'rvr10a'
        },
        { label: '原始跑道视程（RVR）瞬时值', key: 'rawrvr', pinyin: 'rawrvr' },
        { label: '瞬时MOR', key: 'mor', pinyin: 'mor' },
        { label: 'RVR 10 min最小值', key: 'rvr10m_metar', pinyin: 'rvr10m_metar' },
        { label: '消息备发时间', key: 'messageType', pinyin: 'messageType' },
        { label: '背景亮度2 min平均值', key: 'bl2a', pinyin: 'bl2a' },
        { label: '瞬时能见度值', key: 'vis', pinyin: 'vis' },
        {
            label: '消息序列号',
            key: 'sequenceNumber',
            pinyin: 'sequenceNumber'
        },
        // { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: 'RVR瞬时值', key: 'rvr_metar', pinyin: 'rvr_metar' },
        {
            label: '跑道中线灯灯光设置',
            key: 'centerlights',
            pinyin: 'centerlights'
        },
        { label: '消息版本号', key: 'version', pinyin: 'version' },
        { label: 'RVR 10 min最大值', key: 'rvr1a10x_metar', pinyin: 'rvr1a10x_metar' },
        { label: 'RVR瞬时值', key: 'rvr', pinyin: 'rvr' },
        { label: '背景亮度1 min平均值', key: 'bl1a', pinyin: 'bl1a' },
        { label: '最近10 min内的最大1 min平均值', key: 'rvr1a10x', pinyin: 'rvr1a10x' },
        { label: '最近10 min内的最小1 min平均值', key: 'rvr1a10m', pinyin: 'rvr1a10m' },
        { label: '能见度2 min平均值', key: 'vis2a', pinyin: 'vis2a' },
        { label: '从降水传感器得到的瞬时总降水量', key: 'rvr10t_metar', pinyin: 'rvr10t_metar' },
        { label: 'RVR 10 min趋势', key: 'vis1a', pinyin: 'vis1a' },
        { label: '能见度10 min最大值', key: 'vis10x', pinyin: 'vis10x' },
        { label: 'RVR 1 min平均值', key: 'rvr1a_metar', pinyin: 'rvr1a_metar' },
        { label: 'MOR 10 min平均值', key: 'mor10a', pinyin: 'mor10a' },
        { label: 'RVR 2 min平均值', key: 'rvr2a_metar', pinyin: 'rvr2a_metar' },
        { label: '1 000 cd亮度计算出的能见度', key: 'vis1k', pinyin: 'vis1k' },
        { label: '背景亮度瞬时值', key: 'bl', pinyin: 'bl' },
        { label: 'MOR 2 min平均值', key: 'mor2a', pinyin: 'mor2a' },
        { label: 'MOR 10 min最小值', key: 'mor10m', pinyin: 'mor10m' },
        { label: 'MOR 1 min平均值', key: 'mor1a', pinyin: 'mor1a' },
        { label: '能见度10 min最小值（最小瞬时值）', key: 'vis10m', pinyin: 'vis10m' },
        { label: 'RVR 10 min平均值（使用最强灯光）', key: 'rvr10a_metar', pinyin: 'rvr10a_metar' },
        { label: '能见度10 min平均值', key: 'vis10a', pinyin: 'vis10a' },
        { label: 'RVR 10 min最大值（最大瞬时值）', key: 'rvr10x_metar', pinyin: 'rvr10x_metar' },
        { label: '跑道灯光设置', key: 'lights', pinyin: 'lights' },
        { label: 'RVR 2 min平均值', key: 'rvr2a', pinyin: 'rvr2a' },
        { label: '原始跑道视程（RVR）瞬时值（使用最强灯光）', key: 'rawrvr_metar', pinyin: 'rawrvr_metar' },
        { label: '原始VIS瞬时值', key: 'rawvis', pinyin: 'rawvis' },
        { label: '传感器标识', key: 'sensorID', pinyin: 'sensorID' },
        { label: 'RVR 10 min最大值（最大瞬时值）', key: 'rvr10x', pinyin: 'rvr10x' },
        { label: '传感器位置标识', key: 'locationID', pinyin: 'locationID' },
        { label: 'MOR 10 min最大值（最大瞬时值）', key: 'mor10x', pinyin: 'mor10x' },
        // { label: '时间', key: 'time', pinyin: 'time' },
        { label: 'RVR 10 min最小值（最小瞬时值）', key: 'rvr10m', pinyin: 'rvr10m' },
        { label: 'RVR 10 min趋势', key: 'rvr10t', pinyin: 'rvr10t' },
        { label: '跑道边灯灯光设置', key: 'edgelights', pinyin: 'edgelights' },
        { label: '最近10 min内的最小1 min平均值', key: 'rvr1a10m_metar', pinyin: 'rvr1a10m_metar' },
        { label: '原始瞬时气象光学视程', key: 'rawmor', pinyin: 'rawmor' }
    ],
    datasPW: [
        { label: '消息序列号', key: 'sequenceNumber', pinyin: 'sequenceNumber' },
        { label: '消息备发时间', key: 'messageTime', pinyin: 'messageTime' },
        {
            label: '近时天气代码',
            key: 'rw',
            pinyin: 'rw'
        },
        { label: '瞬时天气代码', key: 'pw', pinyin: 'pw' },
        { label: '15 min天气', key: 'wmo15a', pinyin: 'wmo15a' },
        // { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: '累积降水总量（毫米）', key: 'prws', pinyin: 'prws' },
        { label: '美国国家气象局瞬时天气', key: 'wxnws', pinyin: 'wxnws' },
        { label: '60 min天气', key: 'wmo60a', pinyin: 'wmo60a' },
        {
            label: '消息版本号',
            key: 'version',
            pinyin: 'version'
        },
        { label: '传感器标识', key: 'sensorID', pinyin: 'sensorID' },
        { label: '瞬时表面温度', key: 'tbins', pinyin: 'tbins' },
        {
            label: '世界气象组织瞬时天气',
            key: 'wmoins',
            pinyin: 'wmoins'
        },
        { label: '消息类型', key: 'messageType', pinyin: 'messageType' },
        { label: '累积降雪总量（毫米）', key: 'prss', pinyin: 'prss' },
        { label: '传感器位置标识', key: 'locationID', pinyin: 'locationID' },
        { label: '1 min平均降水强度', key: 'prw1a', pinyin: 'prw1a' },
        // { label: '时间', key: 'time', pinyin: 'time' }
    ],
    datasWIND: [
        { label: '消息备发时间', key: 'messageTime', pinyin: 'messageTime' },
        { label: '风速 10 min平均值', key: 'ws10a', pinyin: 'ws10a' },
        {
            label: '风向 2 min平均值',
            key: 'wd2a',
            pinyin: 'wd2a'
        },
        { label: 'WS2A侧风分量', key: 'cw2a', pinyin: 'cw2a' },
        { label: '风向10min平均值', key: 'wd10a', pinyin: 'wd10a' },
        { label: 'WS2A头风分量', key: 'hw2a', pinyin: 'hw2a' },
        { label: '瞬时风速', key: 'wsins', pinyin: 'wsins' },
        { label: '风速10min最小值', key: 'ws10m', pinyin: 'ws10m' },
        { label: '消息类型', key: 'messageType', pinyin: 'messageType' },
        {
            label: '风速2min最大值',
            key: 'ws2x',
            pinyin: 'ws2x'
        },
        { label: '风速10min最大值', key: 'ws10x', pinyin: 'ws10x' },
        { label: '风速2min最小值', key: 'ws2m', pinyin: 'ws2m' },
        {
            label: '消息序列号',
            key: 'sequenceNumber',
            pinyin: 'sequenceNumber'
        },
        { label: '风向2min最大值', key: 'wd2x', pinyin: 'wd2x' },
        // { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: '字符串形式的侧风风速', key: 'cw2a_kt_str', pinyin: 'cw2a_kt_str' },
        { label: '消息版本号', key: 'version', pinyin: 'version' },
        { label: '传感器标识', key: 'sensorID', pinyin: 'sensorID' },
        { label: '传感器位置标识', key: 'locationID', pinyin: 'locationID' },
        { label: '风向10min最大值', key: 'wd10x', pinyin: 'wd10x' },
        { label: '字符串形式的侧风风速', key: 'cw2a_mps_str', pinyin: 'cw2a_mps_str' },
        { label: '瞬时风向', key: 'wdins', pinyin: 'wdins' },
        { label: '风向10min最小值', key: 'wd10m', pinyin: 'wd10m' },
        // { label: '时间', key: 'time', pinyin: 'time' },
        { label: '风速2min平均值', key: 'ws2a', pinyin: 'ws2a' },
        { label: '风向2min最小值', key: 'wd2m', pinyin: 'wd2m' }
    ],
    datasPV: [
        { label: '主导能见度1 min平均值', key: 'vis1a', pinyin: 'vis1a' },
        { label: '瞬时主导能见度', key: 'vis', pinyin: 'vis' },
        {
            label: '主导能见度10 min最大值',
            key: 'vis10x',
            pinyin: 'vis10x'
        },
        { label: '消息序列号', key: 'sequenceNumber', pinyin: 'sequenceNumber' },
        { label: '消息备发时间', key: 'messageTime', pinyin: 'messageTime' },
        { label: '在10 min内最小瞬时能见度值的方向', key: 'sensor_vis10m_dir', pinyin: 'sensor_vis10m_dir' },
        // { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: '消息版本号', key: 'version', pinyin: 'version' },
        { label: '在10 min内最大瞬时能见度值的方向', key: 'sensor_vis10x_dir', pinyin: 'sensor_vis10x_dir' },
        {
            label: '原始主导能见度瞬时值',
            key: 'rawvis',
            pinyin: 'rawvis'
        },
        { label: '传感器标识', key: 'sensorID', pinyin: 'sensorID' },
        { label: '在10 min内一组数据的最大瞬时能见度值', key: 'sensor_vis10x', pinyin: 'sensor_vis10x' },
        {
            label: '消息类型',
            key: 'messageType',
            pinyin: 'messageType'
        },
        { label: '主导能见度10 min最小值（最小瞬时值）', key: 'vis10m', pinyin: 'vis10m' },
        { label: '传感器位置标识', key: 'locationID', pinyin: 'locationID' },
        { label: '主导能见度10 min平均值', key: 'vis10a', pinyin: 'vis10a' },
        // { label: '时间', key: 'time', pinyin: 'time' },
        { label: '在10 min内一组数据的最小瞬时能见度值', key: 'sensor_vis10m', pinyin: 'sensor_vis10m' },
        { label: '主导能见度2 min平均值', key: 'vis2a', pinyin: 'vis2a' }
    ],
    datasRWYLIGHTS: [
        { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: '消息版本号', key: 'version', pinyin: 'version' },
        {
            label: '消息序列号',
            key: 'sequenceNumber',
            pinyin: 'sequenceNumber'
        },
        { label: '消息备发时间', key: 'messageTime', pinyin: 'messageTime' },
        { label: '消息类型', key: 'messageType', pinyin: 'messageType' },
        { label: '传感器标识', key: 'sensorID', pinyin: 'sensorID' },
        { label: '传感器位置标识', key: 'locationID', pinyin: 'locationID' },
        { label: '时间', key: 'time', pinyin: 'time' },
        { label: '跑道灯光强度', key: 'lights', pinyin: 'lights' },
        {
            label: '是否人工输入',
            key: 'ismanual',
            pinyin: 'ismanual'
        },
        { label: '信息', key: 'info', pinyin: 'info' },
        { label: 'tdz05l_inuse', key: 'tdz05l_inuse', pinyin: 'tdz05l_inuse' },
        {
            label: 'tdz23r_inuse',
            key: 'tdz23r_inuse',
            pinyin: 'tdz23r_inuse'
        }
    ],
    datasmsg: [
        { label: '报文种类', key: 'TT'},
        // { label: '时间', key: 'YYGGgg'},
        { label: '导航系统', key: 'Ssss'},
        { label: '温度', key: 'SSTTT'},
        { label: '飞行高度', key: 'Shhh'},
        { label: '纬度', key: 'LLLLA'},
        { label: '颠簸', key: 'TBB'},
        // { label: '机场名称', key: 'CCCC'},
        { label: '国家', key: 'AA'},
        { label: '地区编号', key: 'KK'},
        { label: '飞机尾号', key: 'II'},
        { label: '风向', key: 'ddd'},
        { label: '风速', key: 'fff'},
        { label: '经度', key: 'LLLLLB'},
        { label: '飞行阶段', key: 'ipipip'}
    ],
    datamsg: [
        { label: '时间', key: 'YYGGgg'},
        { label: '机场名称', key: 'CCCC'},
        { label: '报文种类', key: 'TT'},
        { label: '导航系统', key: 'Ssss'},
        { label: '温度', key: 'SSTTT'},
        { label: '飞行高度', key: 'Shhh'},
        { label: '纬度', key: 'LLLLA'},
        { label: '颠簸', key: 'TBB'},
        { label: '国家', key: 'AA'},
        { label: '地区编号', key: 'KK'},
        { label: '飞机尾号', key: 'II'},
        { label: '风向', key: 'ddd'},
        { label: '风速', key: 'fff'},
        { label: '经度', key: 'LLLLLB'},
        { label: '飞行阶段', key: 'ipipip'}
    ],
    datascac: [
        { label: '气象公报种类', key: 'TT'},
        { label: '气压', key: 'QPPPP' },
        // { label: '时间', key: 'YYGGggZ' },
        { label: '云量', key: 'NNN' },
        { label: '气温', key: 'Td' },
        { label: '露点温度', key: 'Tdd' },
        { label: '无重大天气变化', key: 'qsybNOSIG' },
        // { label: '机场名称', key: 'CCCC' },
        { label: '天气现象', key: 'ww' },
        { label: '国家', key: 'AA' },
        { label: '地区编号', key: 'KK' },
        { label: '风向', key: 'ddd' },
        { label: '风速', key: 'fff' },
        { label: '能见度', key: 'VVVV' },
        { label: '云底高度', key: 'hhh' },
        { label: '单份天气报告种类', key: 'METAR' }
    ],
    datacac: [
        { label: '时间', key: 'YYGGggZ', pinyin: 'YYGGggZ' },
        { label: '机场名称', key: 'CCCC', pinyin: 'CCCC' },
        { label: '气象公报种类', key: 'TT', pinyin: 'TT' },
        { label: '气压', key: 'QPPPP', pinyin: 'QPPPP' },
        { label: '云量', key: 'NNN', pinyin: 'NNN' },
        { label: '气温', key: 'Td', pinyin: 'Td' },
        { label: '露点温度', key: 'Tdd', pinyin: 'Tdd' },
        { label: '无重大天气变化', key: 'qsybNOSIG', pinyin: 'qsybNOSIG' },
        { label: '天气现象', key: 'ww', pinyin: 'ww' },
        { label: '国家', key: 'AA', pinyin: 'AA' },
        { label: '地区编号', key: 'KK', pinyin: 'KK' },
        { label: '风向', key: 'ddd', pinyin: 'ddd' },
        { label: '风速', key: 'fff', pinyin: 'fff' },
        { label: '能见度', key: 'VVVV', pinyin: 'VVVV' },
        { label: '云底高度', key: 'hhh', pinyin: 'hhh' },
        { label: '单份天气报告种类', key: 'METAR', pinyin: 'METAR' }
    ],
    datasawos: [
        { label: '10分钟MOR平均', key: 'MOR_10_1', pinyin: 'MOR_10_1' },
        { label: '最大阵风风向', key: 'WindF_max_1', pinyin: 'WindF_max_1' },
        { label: '高云层高度', key: 'CBASE_H_1', pinyin: 'CBASE_H_1' },
        {
            label: '10分钟平均风风速',
            key: 'WindS_10_1',
            pinyin: 'WindS_10_1'
        },
        { label: '天气现象', key: 'WEA_1' },
        // { label: '2分钟平均风风速', key: 'WindS_2_' },
        { label: '1分钟RVR平均', key: 'RVR_1_' },
        { label: '第1端中云层高度', key: 'CBASE_M_1' },
        { label: '背景亮度1分钟平均值', key: 'BL_1_1' },
        { label: '修正海压', key: 'Qnh_1' },
        { label: '10分钟RVR平均', key: 'RVR_10_1' },
        { label: '低云层高度', key: 'CBASE_L_1' },
        { label: '端编号', key: 'NO_1' },
        { label: '垂直能见度', key: 'VV_1'},
        { label: '1分钟RVR平均', key: 'RVR_1_1' },
        // { label: '相对湿度', key: 'Hum_' },
        // { label: '温度', key: 'Temp_' },
        { label: '天气现象', key: 'WEA_' },
        { label: '露点温度', key: 'Td_1' },
        { label: '最大阵风风速', key: 'WindS_max_1' },
        { label: '场压', key: 'Qfe_1' },
        // { label: '机场名称', key: 'airport_code' },
        { label: '中间端标识', key: 'MID' },
        { label: '1分钟MOR平均', key: 'MOR_1_1' },
        // { label: '时间', key: 'TIME' },
        { label: '道面温度', key: 'RoadTemp_1' },
        { label: '着陆端编号', key: 'TDZ' },
        {
            label: '10分钟平均风风向',
            key: 'WindF_10_1'
        },
        { label: '降水强度', key: 'Pi_1' },
        { label: '跑道编号', key: 'NO_runway' },
        { label: '降水量', key: 'PREC_1' },
        { label: '2分钟平均风风向', key: 'WindF_2_1' },
        { label: '停止端编号', key: 'END' }
    ],
    dataawos: [
        { label: '时间', key: 'TIME', pinyin: 'TIME' },
        { label: '机场名称', key: 'airport_code', pinyin: 'airport_code' },
        { label: '10分钟MOR平均', key: 'MOR_10_1', pinyin: 'MOR_10_1' },
        { label: '最大阵风风向', key: 'WindF_max_1', pinyin: 'WindF_max_1' },
        { label: '高云层高度', key: 'CBASE_H_1', pinyin: 'CBASE_H_1' },
        {
            label: '10分钟平均风风速',
            key: 'WindS_10_1',
            pinyin: 'WindS_10_1'
        },
        { label: '天气现象', key: 'WEA_1', pinyin: 'WEA_1' },
        { label: '2分钟平均风风速', key: 'WindS_2_', pinyin: 'WindS_2_' },
        { label: '1分钟RVR平均', key: 'RVR_1_', pinyin: 'RVR_1_' },
        { label: '第1端中云层高度', key: 'CBASE_M_1', pinyin: 'CBASE_M_1' },
        { label: '背景亮度1分钟平均值', key: 'BL_1_1', pinyin: 'BL_1_1' },
        { label: '修正海压', key: 'Qnh_1', pinyin: 'Qnh_1' },
        { label: '10分钟RVR平均', key: 'RVR_10_1', pinyin: 'RVR_10_1' },
        { label: '低云层高度', key: 'CBASE_L_1', pinyin: 'CBASE_L_1' },
        { label: '端编号', key: 'NO_1', pinyin: 'NO_1' },
        { label: '垂直能见度', key: 'VV_1', pinyin: 'VV_1' },
        { label: '1分钟RVR平均', key: 'RVR_1_1', pinyin: 'RVR_1_1' },
        { label: '相对湿度', key: 'Hum_', pinyin: 'Hum_' },
        { label: '温度', key: 'Temp_', pinyin: 'Temp_' },
        { label: '天气现象', key: 'WEA_', pinyin: 'WEA_' },
        { label: '露点温度', key: 'Td_1', pinyin: 'Td_1' },
        { label: '最大阵风风速', key: 'WindS_max_1', pinyin: 'WindS_max_1' },
        { label: '场压', key: 'Qfe_1', pinyin: 'Qfe_1' },
        { label: '中间端标识', key: 'MID', pinyin: 'MID' },
        { label: '1分钟MOR平均', key: 'MOR_1_1', pinyin: 'MOR_1_1' },
        { label: '道面温度', key: 'RoadTemp_1', pinyin: 'RoadTemp_1' },
        { label: '着陆端编号', key: 'TDZ', pinyin: 'TDZ' },
        {
            label: '10分钟平均风风向',
            key: 'WindF_10_1',
            pinyin: 'WindF_10_1'
        },
        { label: '降水强度', key: 'Pi_1', pinyin: 'Pi_1' },
        { label: '跑道编号', key: 'NO_runway', pinyin: 'NO_runway' },
        { label: '降水量', key: 'PREC_1', pinyin: 'PREC_1' },
        { label: '2分钟平均风风向', key: 'WindF_2_1', pinyin: 'WindF_2_1' },
        { label: '停止端编号', key: 'END', pinyin: 'END' }
    ]
}

export default options
