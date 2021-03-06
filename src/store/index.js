import Vue from "vue"
import Vuex from "vuex"
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
// import  from './mutation-type'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        cartList: []
    },
    mutations,
    actions,
    getters
})

export default store