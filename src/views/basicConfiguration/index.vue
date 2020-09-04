<template>
  <div class="basic-configuration">
    <el-row
      v-if="allConfigList.length"
      :gutter="32"
      style="margin-bottom:32px;"
    >
      <div v-for="item in allConfigList" :key="item.id">
        <el-col :xs="24" :sm="12" :lg="12" class="config-item">
          <el-card class="box-card">
            <div slot="header" class="clearfix card-head">
              <span>{{ item.label }}</span>
            </div>
            <el-form
              v-if="item.child && item.child.length"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item
                v-for="citem in item.child"
                :key="citem.id"
                :label="citem.label"
              >
                <el-input v-model="citem.value"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </div>
    </el-row>
    <el-row :gutter="32" style="margin-bottom:32px;">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-card class="">
          <div slot="header" class="clearfix card-head">
            <span>基础设施：</span>
          </div>
          <el-form
            :inline="true"
            :model="baseForm"
            class="demo-form-inline"
            style="margin-bottom: 20px;"
          >
            <el-form-item label="IP地址">
              <el-input
                v-model="baseForm.serverIp"
                placeholder="请输入IP地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input
                v-model="baseForm.serverUserName"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                v-model="baseForm.serverPassword"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item style="float:right; margin: 0;">
              <el-button type="primary" @click="onSubmit">添加</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column
              prop="serverUserName"
              label="用户名"
            ></el-table-column>
            <el-table-column prop="serverPassword" label="密码">
            </el-table-column>
            <el-table-column prop="serverIp" label="IP"> </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="{ row }" class="tableButtom">
                <el-button type="success" size="mini" @click="handleDel(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row v-if="allConfigList.length" style=" text-align: center;">
      <el-button type="success" @click="submitData">提交</el-button>
    </el-row>
  </div>
</template>

<script>
import { getAllKeyValue, setKeyValue } from '@/api/basicConfiguration.js'
export default {
  name: 'BasicConfiguration',
  components: {},
  data() {
    return {
      tableData: [],
      allConfigList: [],
      labelList: [
        { id: '1', type: 'mongodb', label: 'MongoDB配置：' },
        { id: '2', type: 'mysql', label: 'MySql配置：' },
        { id: '3', type: 'rabbitMQ', label: 'RabbitMQ配置：' },
        { id: '4', type: 'localFtp', label: '本地FTP配置：' },
        { id: '5', type: 'kafka', label: 'Kafka配置：' },
        // { id: '6', type: 'elasticsearch', label: 'ElasticSearch配置：' },
        { id: '7', type: 'zookeeper', label: 'Zookeepe配置：' },
        { id: '9', type: 'hbaseMaster', label: 'hbaseMaster配置' },
        { id: '8', type: '', label: '扫描路径：' }
      ],
      listObj: {
        IP: { id: 1, label: 'IP地址:', type: 'host', value: null },
        Port: { id: 2, label: '端口号:', type: 'port', value: null },
        Name: { id: 3, label: '用户名:', type: 'username', value: null },
        Password: { id: 4, label: '密码:', type: 'password', value: null },
        Path: { id: 5, label: '路径:', type: 'ftpPath', value: null },
        Quorum: {
          id: 6,
          label: 'Quorum:',
          type: 'zookeeperQuorum',
          value: null
        },
        zookeeperParent: {
          id: 7,
          label: 'parent:',
          type: 'zookeeperParent',
          value: null
        }
      },
      baseForm: {
        serverIp: '',
        serverUserName: '',
        serverPassword: ''
      },
      init: 1
    }
  },
  computed: {},
  created() {
    getAllKeyValue()
      .then(res => {
        if (res.data) {
          const obj = res.data
          Object.keys(obj).forEach(key => {
            if (key === 'serverUrls') {
              this.tableData = obj[key].map((item, index) => {
                return { ...item, id: index }
              })
            }
            if (JSON.stringify(obj[key]) === '{}') {
              delete obj[key]
            } else {
              this.labelList.forEach(item => {
                if (item.type === key) {
                  this.allConfigList.push({
                    ...item,
                    child: Object.keys(obj[key]).map(ckey => {
                      let reObj = {
                        type: ckey
                      }
                      reObj[ckey] = obj[key][ckey]
                      Object.keys(this.listObj).forEach(keydef => {
                        if (ckey.indexOf(keydef) >= 0) {
                          reObj = {
                            ...this.listObj[keydef],
                            type: ckey,
                            value: obj[key][ckey]
                          }
                        }
                      })
                      return reObj
                    })
                  })
                }
              })
            }
          })
        }
      })
      .catch(() => {
        this.$message.error('链接失败，请刷新！')
      })
  },
  methods: {
    submitData() {
      const obj = {}
      this.allConfigList.forEach(item => {
        if (item.child && item.child.length) {
          item.child.forEach(citem => {
            obj[citem.type] = citem.value
          })
        }
      })
      if (this.tableData.length) {
        obj['serverUrls'] = this.tableData
      }
      setKeyValue(obj).then(res => {
        if (res.code === 0) {
          this.$message({ message: res.msg, type: 'success' })
        } else {
          this.$message({ message: res.msg, type: 'info' })
        }
      })
    },
    onSubmit() {
      let isSubmit = true
      Object.keys(this.baseForm).forEach(key => {
        if (!this.baseForm[key]) {
          isSubmit = false
        }
      })
      if (!isSubmit) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请补全信息!'
        })
        return
      }
      this.baseForm['id'] =
        this.tableData.length > 0
          ? this.tableData[this.tableData.length - 1].id + 1
          : 0
      this.tableData.push(this.baseForm)
    },
    handleDel(data) {
      const index =
        this.tableData.findIndex(item => data.id === item.id) || null
      if (index > -1) {
        this.tableData.splice(index, 1)
        this.tableData = this.tableData.map((item, index) => {
          return { ...item, id: index }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-configuration {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 20px;
  .box-card {
    height: 320px;
  }
  .card-head {
    font-size: 18px;
    color: #333;
  }
  .demo-ruleForm > div {
    margin: 10px 0;
  }
  .config-item {
    margin-bottom: 40px;
  }
}
</style>
<style>
.basic-configuration .el-card__header {
  background-color: #f1f1f1;
  padding: 10px;
}
</style>
