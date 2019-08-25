import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn']),
}

export const authMethods = mapActions('auth', ['logIn', 'signUp', 'logOut'])

export const items = mapGetters('specs', ['SPECS', 'PROPERTIES'])

export const citiesGetters = mapGetters('cities', ['CITIES'])

export const toggleDrawer = mapMutations('navbar', ['TOGGLE_DRAWER'])
export const drawerState = mapGetters('navbar', ['DRAWER'])

export const modelInstanceMethods = mapActions('modelInstances', [
  'SET_CURRENT_MODEL',
  'NEW_INSTANCE',
  'FETCH_DATA',
  'DELETE_INSTANCE',
  'UPDATE_INSTANCE',
])

export const modelInstanceComputed = {
  ...mapState('modelInstances', ['currentModel']),
  ...mapState('modelInstances', ['data']),
}

export const modelInstanceGetters = mapGetters('modelInstances', [
  'CURRENT_MODEL',
  'GET_INSTANCE',
  'CURRENT_INSTANCES',
])
