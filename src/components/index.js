import Vue from 'vue'
import PaginationComponent from './Pagination/index.vue'

const ComponentsList = [PaginationComponent]

ComponentsList.forEach(item => {
  Vue.component(item.name, item)
})
