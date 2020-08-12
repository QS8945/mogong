import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openTab: [{ route: '/workbench', name: '工作台' }], // 所有打开的路由
    activeIndex: '/workbench', // 激活状态
    sourceType: ''
  },
  mutations: {
    // 添加tabs
    add_tabs (state, data) {
      this.state.openTab.push(data)
    },
    // 删除tabs
    delete_tabs (state, route) {
      let index = 0
      if (route) {
        for (let option of state.openTab) {
          if (option.route === route) {
            break
          }
          index++
        }
        this.state.openTab.splice(index, 1)
      } else {
        this.state.openTab.splice(0, this.state.openTab.length)
      }
    },
    // 设置当前激活的tab
    set_active_index (state, index) {
      this.state.activeIndex = index
    },
    set_source_type (state, info) {
      state.sourceType = info
      localStorage.setItem('sourceType', info)
    },
    get_source_type (state) {
      if (localStorage.getItem('sourceType')) {
        state.sourceType = localStorage.getItem('sourceType')
      }
      return state.sourceType
    }
  },
  actions: {

  }
})
