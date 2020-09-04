const options = {
  dataClassify: [
    {
      "typecode": "1",
      "typename": "民航报文"
    },
    {
      "typecode": "2",
      "typename": "常规观测资料"
    },
    {
      "typecode": "3",
      "typename": "非常规观测资料"
    },
    {
      "typecode": "4",
      "typename": "预报数据"
    },
    {
      "typecode": "5",
      "typename": "咸阳机场自观"
    },
    {
      "typecode": "6",
      "typename": "预报产品数据"
    }
  ],
  dataType: [
    {
      "id": "1",
      "type": "1",
      "datatypename": "民航报文",
      "datatypecode": "cac",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "2",
      "type": "5",
      "datatypename": "咸阳机场自观",
      "datatypecode": "socket",
      "datasrouce": "socket"
    },
    {
      "id": "3",
      "type": "2",
      "datatypename": "全国机场自观",
      "datatypecode": "awos",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "4",
      "type": "2",
      "datatypename": "全国地面",
      "datatypecode": "ground_data",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "5",
      "type": "2",
      "datatypename": "全国高空",
      "datatypecode": "upper_data",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "6",
      "type": "1",
      "datatypename": "航空器空中报",
      "datatypecode": "msg",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "7",
      "type": "4",
      "datatypename": "欧洲细网格",
      "datatypecode": "EC_HR",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "8",
      "type": "3",
      "datatypename": "FY2G",
      "datatypecode": "FY2G",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "9",
      "type": "4",
      "datatypename": "NECP",
      "datatypecode": "necp",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "10",
      "type": "4",
      "datatypename": "WAFS",
      "datatypecode": "wafs",
      "datasrouce": "FTP主动获取"
    },
    {
      "id": "11",
      "type": "3",
      "datatypename": "葵花8",
      "datatypecode": "kh_8",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "12",
      "type": "3",
      "datatypename": "多普勒雷达",
      "datatypecode": "oradata",
      "datasrouce": "FTP主动获取"
    },
    {
      "id": "13",
      "type": "2",
      "datatypename": "区域自动站",
      "datatypecode": "auto_station",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "14",
      "type": "3",
      "datatypename": "机场天气雷达",
      "datatypecode": "weather_radar",
      "datasrouce": "FTP实时推送"
    },
    {
      "id": "15",
      "type": "6",
      "datatypename": "预报产品数据",
      "datatypecode": "prog",
      "datasrouce": "FTP实时推送"
    }
  ],
  optionsCollect: [
    {
      value: 'id',
      label: 'ID'
    },
    {
      value: 'dataclassification',
      label: '数据分类'
    },
    {
      value: 'dataname',
      label: '数据名称'
    },
    {
      value: 'datasource',
      label: '数据来源'
    },
    {
      value: 'sourceftpurl',
      label: '源地址'
    },
    {
      value: 'sourceftpusername',
      label: 'ftp用户名'
    },
    {
      value: 'sourceftppwd',
      label: 'ftp密码'
    },
    {
      value: 'sourceftpfilepath',
      label: 'ftp文件路径'
    },
    {
      value: 'checkrules',
      label: '校验规则'
    },
    {
      value: 'collecttime',
      label: '采集时间'
    },
    {
      value: 'checkdatafilename',
      label: '校验文件名称'
    },
    {
      value: 'checkfilecount',
      label: '校验数量'
    },
    {
      value: 'checkfilesizebig',
      label: '校验结束值'
    },
    {
      value: 'checkfilesizesmall',
      label: '校验起始值'
    },
    {
      value: 'datastorage',
      label: '数据源'
    },
    {
      value: 'datatype',
      label: '数据类型'
    },
    {
      value: 'fileupdateendtime',
      label: '校验数据(上)'
    },
    {
      value: 'fileupdatestarttime',
      label: '过滤数据(下)'
    },
    {
      value: 'filterdatafilename',
      label: '过滤名称'
    },
    {
      value: 'filterfilesizebig',
      label: '过滤范围(上)'
    },
    {
      value: 'filterfilesizesmall',
      label: '过滤范围(下)'
    },
    {
      value: 'filterpathmatchrules',
      label: '过滤正则'
    },
    {
      value: 'filterrules',
      label: '过滤规则'
    },
    {
      value: 'isFTP',
      label: '是否FTP'
    },
    {
      value: 'lifecycle',
      label: '生命周期'
    },
    {
      value: 'updateway',
      label: '更新方式'
    },
    {
      value: 'storagefileurl',
      label: '存储url'
    },
    {
      value: 'storagedatabaseusername',
      label: '存储用户名'
    },
    {
      value: 'storagedatabaseurl',
      label: '存储url'
    },
    {
      value: 'storagedatabasetablename',
      label: '存储数据'
    },
    {
      value: 'storagedatabasepwd',
      label: '存储密码'
    },
    {
      value: 'storagedatabasename',
      label: '存储名称'
    },
    {
      value: 'status',
      label: '状态'
    },
    {
      value: 'sourceftpusername',
      label: '源ftp名称'
    },
    {
      value: 'sourceftpurl',
      label: '源ftpurl'
    },
    {
      value: 'sourceftppwd',
      label: '源ftp密码'
    },
    {
      value: 'sourceftpfilepath',
      label: '源ftp路径'
    },
    {
      value: 'storagefilepath',
      label: '源文件路径'
    },
    {
      value: 'storagefilepwd',
      label: '源文件密码'
    },
    {
      value: 'wsinsmin',
      label: '风速(小)'
    },
    {
      value: 'wsinsmax',
      label: '风速(大)'
    },
    {
      value: 'tdinsmin',
      label: '湿度(小)'
    },
    {
      value: 'tdinsmax',
      label: '湿度(大)'
    },
    {
      value: 'tainsmin',
      label: '温度(小)'
    },
    {
      value: 'tainsmax',
      label: '温度(大)'
    },
    {
      value: 'sourcedatabasename',
      label: '源数据库名称'
    },
    {
      value: 'sourcedatabasepwd',
      label: '源数据库密码'
    },
  ]
}

export default options
