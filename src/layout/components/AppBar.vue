/* eslint-disable indent */
<template>
  <div class="sidebar-container app-bar">
    <el-menu
      @select="handleSelect"
      ref="sideMenun"
      v-if="routerActive.length"
      :default-active="activePath"
      class="el-menu-vertical-demo"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :collapse="isCollapse"
      :unique-opened="false"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      router
    >
      <el-submenu
        v-for="(item, index) in routerActive"
        :key="index"
        :index="item.path"
      >
        <template slot="title">
          <i :class="[item.icon ? item.icon : '']"></i>
          <span :title="item.title">{{ item.title }}</span>
        </template>
        <el-menu-item-group v-if="item.children">
          <el-menu-item
            v-for="(iteminner, indexinner) in item.children"
            :key="indexinner"
            :index="iteminner.path"
          >
            {{ iteminner.title }}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import variables from '@/styles/variables.scss'
import { asyncRoutes } from '@/router'

import { mapGetters } from 'vuex'

export default {
  name: 'AppBar',
  data() {
    return {
      routerData: [],
      routerActive: [],
      activePath: '',
      activeType: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar','addRoutes', 'permission_routes']),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: 'onRouteChanged'
  },
  mounted() {},
  created() {
    this.routerData = []
    this.permission_routes.forEach(item => {
      const list = []
      if (item && item.children && item.children.length) {
        item.children.forEach(itemA => {
          const arr = []
          if (itemA.children && itemA.children.length) {
            itemA.children.forEach(child => {
              arr.push({
                title: child.meta.title,
                path: child.path
                  ? item.path + '/' + itemA.path + '/' + child.path
                  : item.path + '/' + itemA.path
              })
            })
          }
          list.push({
            title: itemA.meta.title,
            path: item.path + '/' + itemA.path,
            icon: itemA.meta.icon ? itemA.meta.icon : '',
            children: arr
          })
        })
      }
      this.routerData.push({
        path: item.path,
        list: list
      })
    })
    this.onRouteChanged()
  },
  methods: {
    handleSelect(key, keyPath){
      console.log(key, keyPath);
    },
    onRouteChanged() {
      const obj =
        this.routerData.find(item => this.$route.path.includes(item.path)) ||
        null

      // this.routerData.forEach(item => {
      //   if (!this.$route.path.includes(item.path)) {
      //     obj.active = false
      //   }
      // })

      if (obj && obj.list && obj.list.length) {
        if (obj.path !== this.activeType) {
          this.activeType = obj.path
          this.routerActive = []
          setTimeout(() => {
            this.routerActive = obj.list

            this.activePath = this.$route.path
          })
        }
        // debugger
        this.activePath = this.$route.path
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-bar {
  width: 100%;
  height: 100%;
  background: chartreuse;
}
</style>
<style>
.app-bar .el-menu-item-group__title {
  display: none;
}
</style>
