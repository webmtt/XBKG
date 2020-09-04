const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,

  allRouter:state => state.user.allRooter,//获取权限
  addRoutes: state => state.permission.addRoutes, // 获得权限菜单

  permission_routes: state => state.permission.routes.filter(item => !item.hidden),
  active_sub_routes: state => state.permission.activeSubRouters,
  active_top_route: state => state.permission.activeTopRouter,
  errorLogs: state => state.errorLog.logs,
}
export default getters
