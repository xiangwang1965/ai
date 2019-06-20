import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

var state = {
  count: 1,
  list: [],
  userInfo:{},
  currentList:[],
  curClsStuList:[],
}

var mutations = {
  setCurrentList (list) {
      state.currentList = list;
  },
  pushCurrentList(data) {
     return state.currentList.push(data);
  },
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
