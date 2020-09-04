const options = {
  tableMetaVis: [
    { label: '机场名称', key: 'airport_code' },
    { label: '时间', key: 'time' },
    { label: '消息备发时间', key: 'messageTime' },
    { label: 'RVR 1 min平均值', key: 'rvr1a' },
    {
      label: 'RVR 10 min平均值',
      key: 'rvr10a',
      pinyin: 'rvr10a'
    },
    { label: '原始跑道视程（RVR）瞬时值', key: 'rawrvr' },
    { label: '瞬时MOR', key: 'mor', pinyin: 'mor' },
    { label: 'RVR 10 min最小值', key: 'rvr10m_metar' },
    { label: '消息备发时间', key: 'messageType' },
    { label: '背景亮度2 min平均值', key: 'bl2a' },
    { label: '瞬时能见度值', key: 'vis' },
    {
      label: '消息序列号',
      key: 'sequenceNumber'
    },
    { label: 'RVR瞬时值', key: 'rvr_metar' },
    {
      label: '跑道中线灯灯光设置',
      key: 'centerlights'
    },
    { label: '消息版本号', key: 'version' },
    { label: 'RVR 10 min最大值', key: 'rvr1a10x_metar' },
    { label: 'RVR瞬时值', key: 'rvr' },
    { label: '背景亮度1 min平均值', key: 'bl1a' },
    { label: '最近10 min内的最大1 min平均值', key: 'rvr1a10x' },
    { label: '最近10 min内的最小1 min平均值', key: 'rvr1a10m' },
    { label: '能见度2 min平均值', key: 'vis2a', pinyin: 'vis2a' },
    { label: '从降水传感器得到的瞬时总降水量', key: 'rvr10t_metar' },
    { label: 'RVR 10 min趋势', key: 'vis1a' },
    { label: '能见度10 min最大值', key: 'vis10x' },
    { label: 'RVR 1 min平均值', key: 'rvr1a_metar' },
    { label: 'MOR 10 min平均值', key: 'mor10a' },
    { label: 'RVR 2 min平均值', key: 'rvr2a_metar' },
    { label: '1 000 cd亮度计算出的能见度', key: 'vis1k' },
    { label: '背景亮度瞬时值', key: 'bl' },
    { label: 'MOR 2 min平均值', key: 'mor2a' },
    { label: 'MOR 10 min最小值', key: 'mor10m' },
    { label: 'MOR 1 min平均值', key: 'mor1a' },
    { label: '能见度10 min最小值（最小瞬时值）', key: 'vis10m' },
    { label: 'RVR 10 min平均值（使用最强灯光）', key: 'rvr10a_metar' },
    { label: '能见度10 min平均值', key: 'vis10a' },
    { label: 'RVR 10 min最大值（最大瞬时值）', key: 'rvr10x_metar' },
    { label: '跑道灯光设置', key: 'lights' },
    { label: 'RVR 2 min平均值', key: 'rvr2a' },
    { label: '原始跑道视程（RVR）瞬时值（使用最强灯光）', key: 'rawrvr_metar' },
    { label: '原始VIS瞬时值', key: 'rawvis' },
    { label: '传感器标识', key: 'sensorID' },
    { label: 'RVR 10 min最大值（最大瞬时值）', key: 'rvr10x' },
    { label: '传感器位置标识', key: 'locationID' },
    { label: 'MOR 10 min最大值（最大瞬时值）', key: 'mor10x' },
    { label: 'RVR 10 min最小值（最小瞬时值）', key: 'rvr10m' },
    { label: 'RVR 10 min趋势', key: 'rvr10t' },
    { label: '跑道边灯灯光设置', key: 'edgelights' },
    { label: '最近10 min内的最小1 min平均值', key: 'rvr1a10m_metar' },
    { label: '原始瞬时气象光学视程', key: 'rawmor' }
  ],
  tableMetaHumitemp: [
    { key: 'airport_code', label: '机场名称' },
    { key: 'time', label: '时间' },
    { key: 'sequenceNumber', label: '消息序列号' },
    { key: 'messageTime', label: '消息备发时间' },
    { key: 'ta10x', label: '10min最高温度(瞬时值)' },
    { key: 'ta1hm', label: '1h最低温度(瞬时值)' },
    { key: 'vpins', label: '瞬时水汽压' },
    { key: 'version', label: '消息版本号' },
    { key: 'ta10m', label: '10min最低温度(瞬时值)' },
    { key: 'tdins', label: '瞬时露点值' },
    { key: 'rhins', label: '瞬时相对湿度' },
    { key: 'sensorID', label: '传感器标识' },
    { key: 'tains', label: '瞬时温度' },
    { key: 'ta1ha', label: '1h平均温度' },
    { key: 'messageType', label: '消息类型' },
    { key: 'locationID', label: '传感器位置标识' },
    { key: 'ta1hx', label: '1h最高温度(瞬时值)' },
  ],
  tableMetaCloud: [
    { key: 'airport_code', label: '机场名称', width:'200px' },
    { key: 'time', label: '时间', width:'160px' },
    { key: 'version', label: '消息版本号' },
    { key: 'sequenceNumber', label: '消息序列号' },
    { key: 'messageType', label: '消息类型' },
    { key: 'sensorID', label: '传感器标识',  width:'100px'  },
    { key: 'locationID', label: '传感器位置标识',  width:'120px' },
    { key: 'isskyclear', label: '是否是晴空标志',  width:'120px' },
    { key: 'messageTime', label: '消息备发时间' ,  width:'120px'},
    { key: 'isvertvis', label: '是否探测到垂直能见度标志',  width:'200px' },
    { key: 'vervis', label: '垂直能见度值',  width:'130px' },
    { key: 'cloudbase', label: '云底高度' ,  width:'130px'},
    { key: 'ch1ins', label: '第一层云高',  width:'100px' },
    { key: 'ch2ins', label: '第二层云高',  width:'100px' },
    { key: 'ch3ins', label: '第三层云高',  width:'100px' },
    { key: 'amount1', label: '天空状况数据中的第一层云量' ,  width:'210px'},
    { key: 'amount2', label: '天空状况数据中的第二层云量',  width:'210px' },
  ],
  tableMetaPress: [
    { key: 'airport_code', label: '机场名称' },
    { key: 'time', label: '时间' },
    { key: 'qfesynop3h', label: 'QFE3h变化' },
    { key: 'sequenceNumber', label: '消息序列号' },
    { key: 'messageTime', label: '消息备发时间' },
    { key: 'fl', label: '过渡层' },
    { key: 'qfesynopt', label: '与SYNOP相关的QFE趋势' },
    { key: 'alt', label: '过渡层海拔高度' },
    { key: 'qfem', label: '10 min最小场压(最小瞬时值)' },
    { key: 'pains', label: '瞬时气压' },
    { key: 'version', label: '消息版本号' },
    { key: 'sensorID', label: '传感器标识' },
    { key: 'qnhins', label: '瞬时修正海平面气压(QNH)' },
    { key: 'messageType', label: '消息类型' },
    { key: 'locationID', label: '传感器位置标识' },
    { key: 'qfex', label: '10 min最大场压(最大瞬时值)' },
    { key: 'qffins', label: '瞬时QFF' },
    { key: 'qfeins', label: '瞬时场面气压(QFE)' },
    { key: 'qfesynop', label: '陆地测站地面天气报告QFE' },
  ],
  tableMetaRain: [
    { key: 'airport_code', label: '机场名称' },
    { key: 'time', label: '时间' },
    { key: 'messageTime', label: '消息备发时间' },
    { key: 'rainon', label: '降水传感器是否探测到降水' },
    { key: 'duration_1h', label: '最近60 min内的降水持续时间' },
    { key: 'sum_1h', label: '最近60min的总降水量(mm)' },
    { key: 'version', label: '最消息版本号' },
    { key: 'sensorID', label: '传感器标识' },
    { key: 'amount_ins', label: '从降水传感器得到的瞬时降水量' },
    { key: 'messageType', label: '消息类型' },
    { key: 'locationID', label: '传感器位置标识' },
    { key: 'sum_ins', label: '从降水传感器得到的瞬时总降水量' },
  ],
  tableMetaWind: [
    { label: '机场名称', key: 'airport_code' },
    { label: '时间', key: 'time' },
    { label: '消息备发时间', key: 'messageTime' },
    { label: '风速 10 min平均值', key: 'ws10a' },
    {
      label: '风向 2 min平均值',
      key: 'wd2a'
    },
    { label: 'WS2A侧风分量', key: 'cw2a' },
    { label: '风向10min平均值', key: 'wd10a' },
    { label: 'WS2A头风分量', key: 'hw2a' },
    { label: '瞬时风速', key: 'wsins' },
    { label: '风速10min最小值', key: 'ws10m' },
    { label: '消息类型', key: 'messageType' },
    {
      label: '风速2min最大值',
      key: 'ws2x'
    },
    { label: '风速10min最大值', key: 'ws10x' },
    { label: '风速2min最小值', key: 'ws2m' },
    {
      label: '消息序列号',
      key: 'sequenceNumber'
    },
    { label: '风向2min最大值', key: 'wd2x' },
    { label: '字符串形式的侧风风速', key: 'cw2a_kt_str' },
    { label: '消息版本号', key: 'version' },
    { label: '传感器标识', key: 'sensorID' },
    { label: '传感器位置标识', key: 'locationID' },
    { label: '风向10min最大值', key: 'wd10x' },
    { label: '字符串形式的侧风风速', key: 'cw2a_mps_str' },
    { label: '瞬时风向', key: 'wdins' },
    { label: '风向10min最小值', key: 'wd10m' },
    { label: '风速2min平均值', key: 'ws2a' },
    { label: '风向2min最小值', key: 'wd2m' }
  ],
  tableMetaPw: [
    { label: '机场名称', key: 'airport_code' },
    { label: '时间', key: 'time' },
    { label: '消息序列号', key: 'sequenceNumber' },
    { label: '消息备发时间', key: 'messageTime' },
    {
      label: '近时天气代码',
      key: 'rw',
      pinyin: 'rw'
    },
    { label: '瞬时天气代码', key: 'pw' },
    { label: '15 min天气', key: 'wmo15a' },
    { label: '累积降水总量（毫米）', key: 'prws' },
    { label: '美国国家气象局瞬时天气', key: 'wxnws' },
    { label: '60 min天气', key: 'wmo60a' },
    {
      label: '消息版本号',
      key: 'version'
    },
    { label: '传感器标识', key: 'sensorID' },
    { label: '瞬时表面温度', key: 'tbins' },
    {
      label: '世界气象组织瞬时天气',
      key: 'wmoins'
    },
    { label: '消息类型', key: 'messageType' },
    { label: '累积降雪总量（毫米）', key: 'prss' },
    { label: '传感器位置标识', key: 'locationID' },
    { label: '1 min平均降水强度', key: 'prw1a' },
  ],
  tableMetaPv: [
    { label: '机场名称', key: 'airport_code' },
    { label: '时间', key: 'time' },
    { label: '主导能见度1 min平均值', key: 'vis1a' },
    { label: '瞬时主导能见度', key: 'vis' },
    {
      label: '主导能见度10 min最大值',
      key: 'vis10x'
    },
    { label: '消息序列号', key: 'sequenceNumber' },
    { label: '消息备发时间', key: 'messageTime' },
    { label: '在10 min内最小瞬时能见度值的方向', key: 'sensor_vis10m_dir' },
    { label: '消息版本号', key: 'version' },
    { label: '在10 min内最大瞬时能见度值的方向', key: 'sensor_vis10x_dir' },
    {
      label: '原始主导能见度瞬时值',
      key: 'rawvis'
    },
    { label: '传感器标识', key: 'sensorID' },
    { label: '在10 min内一组数据的最大瞬时能见度值', key: 'sensor_vis10x' },
    {
      label: '消息类型',
      key: 'messageType'
    },
    { label: '主导能见度10 min最小值（最小瞬时值）', key: 'vis10m' },
    { label: '传感器位置标识', key: 'locationID' },
    { label: '主导能见度10 min平均值', key: 'vis10a' },
    { label: '在10 min内一组数据的最小瞬时能见度值', key: 'sensor_vis10m' },
    { label: '主导能见度2 min平均值', key: 'vis2a' }
  ],
  tableMetaRosa: [
    { key: 'airport_code', label: '机场名称' },
    { key: 'queryTime', label: '时间' },
    { key: 'stemp', label: '表面温度(R)' },
    { key: 'surfsta', label: '表面状态' },
    { key: 'gtemp', label: '低温(C)' },
    { key: 'rainstatus', label: '雨状态' }
  ],
  tableMetaRwylights: [
    { label: '机场名称', key: 'airport_code'},
    { label: '时间', key: 'time'},
    { label: '消息版本号', key: 'version'},
    {
      label: '消息序列号',
      key: 'sequenceNumber'
    },
    { label: '消息备发时间', key: 'messageTime'},
    { label: '消息类型', key: 'messageType'},
    { label: '传感器标识', key: 'sensorID'},
    { label: '传感器位置标识', key: 'locationID'},
    { label: '跑道灯光强度', key: 'lights'},
    {
      label: '是否人工输入',
      key: 'ismanual'
    },
    { label: '信息', key: 'info'},
    { label: 'tdz05l_inuse', key: 'tdz05l_inuse'},
    {
      label: 'tdz23r_inuse',
      key: 'tdz23r_inuse'
    }
  ],
  optionsCloud: [
    {
      value: 'airport_code',
      label: '机场名称'
    },
    {
      value: 'amount1',
      label: '天空状况数据中的第一层云量(八进制)'
    },
    {
      value: 'amount2',
      label: '天空状况数据中的第二层云量(八进制)'
    },
    {
      value: 'amount3',
      label: '天空状况数据中的第三层云量(八进制)'
    },
    {
      value: 'amount4',
      label: '天空状况数据中的第四层云量(八进制)'
    },
    {
      value: 'ch1',
      label: '天空状况数据中的第一层云高'
    },
    {
      value: 'ch1ins',
      label: '第一层云高'
    },
    {
      value: 'ch2',
      label: '天空状况数据中的第二层云高'
    },
    {
      value: 'ch2ins',
      label: '第二层云高'
    },
    {
      value: 'ch3',
      label: '天空状况数据中的第三层云高'
    },
    {
      value: 'ch3ins',
      label: '第三层云高'
    },
    {
      value: 'ch4',
      label: '天空状况数据中的第四层云高'
    },
    {
      value: 'cloudbase',
      label: '云底高度'
    },
    {
      value: 'createTime',
      label: '创建时间'
    },
    {
      value: 'isskyclear',
      label: '是否晴空(0-非晴空，1-晴空)'
    },
    {
      value: 'isvertvis',
      label: '是否探测到垂直能见度(0-未探测，1-探测到)'
    },
    {
      value: 'locationID',
      label: '位置ID'
    },
    {
      value: 'messageTime',
      label: '信息时间'
    },
    {
      value: 'messageType',
      label: '信息类型'
    },
    {
      value: 'queryTime',
      label: '时间'
    },
    {
      value: 'sensorID',
      label: '传感器ID'
    },
    {
      value: 'sequenceNumber',
      label: '序列数'
    },
    {
      value: 'time',
      label: '时间'
    },
    {
      value: 'version',
      label: '版本'
    },
    {
      value: 'vervis',
      label: '垂直能见度'
    },
    {
      value: 'rhins',
      label: '瞬时相对湿度'
    },
    {
      value: 'ta10m',
      label: '10min最低温度(瞬时值)'
    },
    {
      value: 'ta10x',
      label: '10min最高温度(瞬时值)'
    },
    {
      value: 'ta1ha',
      label: '1h平均温度'
    },
    {
      value: 'ta1hm',
      label: '1h最低温度(瞬时值)'
    },
    {
      value: 'ta1hx',
      label: '1h最高温度(瞬时值)'
    },
    {
      value: 'tains',
      label: '瞬时温度'
    },
    {
      value: 'tdins',
      label: '瞬时露点值'
    },
    {
      value: 'vpins',
      label: '瞬时水汽压'
    },
    {
      value: 'alt',
      label: '过渡层海拔高度'
    },
    {
      value: 'fl',
      label: '过渡层'
    },
    {
      value: 'pains',
      label: '瞬时气压'
    },
    {
      value: 'qfeins',
      label: '瞬时水汽压'
    },
    {
      value: 'qfem',
      label: '10min最小场压(最小瞬时值)'
    },
    {
      value: 'qfesynop',
      label: '与SYNOP相关的QFE'
    },
    {
      value: 'qfesynop3h',
      label: 'QFE3h变化'
    },
    {
      value: 'qfesynopt',
      label: '与SYNOP相关的QFE趋势'
    },
    {
      value: 'qfex',
      label: '10min最大场压(最大瞬时值)'
    },
    {
      value: 'qfesynop3h',
      label: 'QFE3h变化'
    },
    {
      value: 'qffins',
      label: '瞬时QFF'
    },
    {
      value: 'qnhins',
      label: '瞬时修正海平面气压'
    },
    {
      value: 'amount_ins',
      label: '从降水传感器得到的瞬时降水量'
    },
    {
      value: 'duration_1h',
      label: '最近60min内的降水持续时间'
    },
    {
      value: 'rainon',
      label: '降水传感器是否探测到降水(0-未探测，1-探测到)'
    },
    {
      value: 'sum_1h',
      label: '最近60min的总降水量'
    },
    {
      value: 'sum_ins',
      label: '从降水传感器得到的瞬时总降水量'
    },
    {
      value: 'cw2a',
      label: 'WS2A侧风分量(正-右，负-左)'
    },
    {
      value: 'cw2a_kt_str',
      label: '字符串形式的侧风风速(以节(kn)为单位)'
    },
    {
      value: 'cw2a_mps_str',
      label: '字符串形式的侧风风速(以mps为单位)'
    },
    {
      value: 'hw2a',
      label: 'WS2A头风分量'
    },
    {
      value: 'wd10a',
      label: '风向10min平均值'
    },
    {
      value: 'wd10m',
      label: '风向10min最小值'
    },
    {
      value: 'wd10x',
      label: '风向10min最大值'
    },
    {
      value: 'wd2a',
      label: '风向2min平均值'
    },
    {
      value: 'wd2m',
      label: '风向2min最小值'
    },
    {
      value: 'wd2x',
      label: '风向10min最大值'
    },
    {
      value: 'wdins',
      label: '瞬时风向'
    },
    {
      value: 'ws10a',
      label: '风向10min平均值'
    },
    {
      value: 'ws10m',
      label: '风向10min最小值'
    },
    {
      value: 'ws10x',
      label: '风向10min最大值'
    },
    {
      value: 'ws2a',
      label: '风速2min平均值'
    },
    {
      value: 'ws2m',
      label: '风速2min最小值'
    },
    {
      value: 'ws2x',
      label: '风速2min最大值'
    },
    {
      value: 'wsins',
      label: '瞬时风速'
    },
    {
      value: 'prss',
      label: '累积降雪总量'
    },
    {
      value: 'prw1a',
      label: '1min平均降水强度'
    },
    {
      value: 'prws',
      label: '累积降水总量'
    },
    {
      value: 'pw',
      label: 'METAR天气代码'
    },
    {
      value: 'rw',
      label: '近时METAR天气代码'
    },
    {
      value: 'tbins',
      label: '瞬时表面温度'
    },
    {
      value: 'wmo15a',
      label: '15min天气,WMO代码'
    },
    {
      value: 'wmo60a',
      label: '60min天气,WMO代码'
    },
    {
      value: 'wmoins',
      label: '瞬时天气，NWS代码'
    },
    {
      value: 'wxnws',
      label: '瞬时天气，WMO代码'
    },
    {
      value: 'rawvis',
      label: '原始主导能见度瞬时值'
    },
    {
      value: 'sensor_vis10m',
      label: '在10min内一组数据的最小瞬时能见度值'
    },
    {
      value: 'sensor_vis10m_dir',
      label: '在10min内最小瞬时能见度值的方向'
    },
    {
      value: 'sensor_vis10x',
      label: '在10min内一组数据的最大瞬时能见度值'
    },
    {
      value: 'sensor_vis10x_dir',
      label: '在10min内最大瞬时能见度值的方向'
    },
    {
      value: 'vis',
      label: '瞬时主导能见度'
    },
    {
      value: 'vis10a',
      label: '主导能见度10min平均值'
    },
    {
      value: 'vis10m',
      label: '主导能见度10min最小值'
    },
    {
      value: 'vis10x',
      label: '主导能见度10min最大值'
    },
    {
      value: 'vis1a',
      label: '主导能见度1min平均值'
    },
    {
      value: 'vis2a',
      label: '主导能见度2min平均值'
    },
  ]
}

export default options
