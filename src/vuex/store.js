import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

var state = {
  count: 1,
  list: [],
  currentList:[],
}

var mutations = {
  setCurrentList (list) {
      state.currentList = list;
  }
}

var getters = {
  computedCount: (state) => {
    return state.count++
  }

}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
