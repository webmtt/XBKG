// //初始化路由
// import { asyncRoutes } from '@/router'
// console.log("asyncRoutes", asyncRoutes)
// var menus1 =JSON.parse(localStorage.getItem('allRoot'))
// console.log("menus", menus1)

// let ass=[]
// //查到后台返回的所有url
// function loopData(arr){
//   arr.forEach(v => {
//     ass.push(v.ename)
//     v.children && loopData(v.children)
//     return ass
//   });
// }
// loopData(menus1)
// console.log("loopData -> ass", ass)

// function loopData2(arr, parent){
//   let chi = [];
//   arr.forEach(v => {
//     if(ass.includes(v.name)) {
//       chi.push(v)
//       v.children && loopData2(v.children, v)
//     }
//   });
//   parent.children = chi
// }
// export const root =[]
// loopData2(asyncRoutes, root)
// console.log("loopData -> ass", root.children)