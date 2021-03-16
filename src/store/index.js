import Vue from 'vue'
import Vuex from 'vuex'
import tagsView from './modules/tagsView' //页签存储状态
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tagsView,
  },
  state: {
    AppId:'',
    UserId:'',
    OrgId:'',
    TaskInfo:'',
    setCheckUserDate:''
  },
  mutations: {
    ADD_APPID: (state, appid) => {
      state.AppId = appid
    },
    ADD_USERID: (state, userid) => {
      state.UserId = userid
    },
    ADD_ORGID: (state, orgid) => {
      state.OrgId = orgid
    },
    ADD_TASKINFO: (state, taskinfo) => {
      state.TaskInfo = taskinfo
    },
    SET_CHECKUSER_DATA:(state, status) => {
      state.setCheckUserDate = status
    },
  },
  actions: {
    addAppId({ commit }, appid) {
      commit('ADD_APPID', appid)
    },
    addUserId({ commit }, userid) {
      commit('ADD_USERID', userid)
    },
    addOrgID({ commit }, orgid) {
      commit('ADD_ORGID', orgid)
    },
    addTaskInfo({ commit }, taskinfo) {
      commit('ADD_TASKINFO', taskinfo)
    },
  }
})
