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
    ]
  }
  
  export default options
  