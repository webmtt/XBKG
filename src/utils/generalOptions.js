class Genneral {
  constructor(option) {
    this.option = option
  }
  numberOfPerPage() {
    return [
      {
        label: '10条/页',
        key: 10
      },
      {
        label: '20条/页',
        key: 20
      },
      {
        label: '30条/页',
        key: 30
      },
      {
        label: '50条/页',
        key: 50
      }
    ]
  }
  listSorting() {
    return [
      {
        label: '正序',
        key: '+id'
      },
      {
        label: '倒序',
        key: '-id'
      }
    ]
  }
  listSortingLocal() {
    return [
      {
        label: '正序',
        key: 'true'
      },
      {
        label: '倒序',
        key: 'false'
      }
    ]
  }
  listSorting_() {
    return [
      {
        label: '正序',
        key: 'asc'
      },
      {
        label: '倒序',
        key: 'desc'
      }
    ]
  }
  attrOptions() {
    return [
      '毛毛雨',
      '雨',
      '雪',
      '米雪',
      '冰晶',
      '冰粒',
      '冰雹',
      '小冰雹和/或霰',
      '轻雾',
      '雾',
      '烟',
      '火山灰',
      '浮尘',
      '沙',
      '霾',
      '尘/啥旋风（尘卷风）',
      '飑',
      '漏斗云|（陆龙卷/水龙卷）',
      '沙暴',
      '尘暴'
    ]
  }
}
export default Genneral
