const {showSettings, fixedHeader, sidebarLogo} = {
  title: 'Vue Admin Template',
  fixedHeader: true,
  sidebarLogo: false
};

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user?.token,
  avatar: state => state.user?.avatar,
  name: state => state.user?.name
};

const store = new Vuex.Store({
  modules: {
    app,
    settings: {
      namespaced: true,
      state: {
        showSettings: showSettings,
        fixedHeader: fixedHeader,
        sidebarLogo: sidebarLogo
      },
      mutations: {
        CHANGE_SETTING: (state, {key, value}) => {
          // eslint-disable-next-line no-prototype-builtins
          if (state.hasOwnProperty(key)) {
            state[key] = value;
          }
        }
      },
      actions: {
        changeSetting({commit}, data) {
          commit('CHANGE_SETTING', data);
        }
      }
    }
  },
  getters
});
Vue.use(Vuex);
