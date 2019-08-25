import { api } from '@utils/axiosHttp'

export const state = {
  cities: [],
}

export const getters = {
  CITIES({ cities }) {
    return cities
  },
  // PROPERTIES: ({ cities }) => (model) => {
  //   let filtered = cities.filter(({ name }) => name === model)
  //   if (filtered.length) return filtered[0].properties
  //   return []
  // },
}

export const mutations = {
  SET_CITIES(state, newCities) {
    state.cities = newCities
  },
}

export const actions = {
  init({ dispatch }) {
    dispatch('FETCH_CITIES')
  },
  FETCH_CITIES({ commit }) {
    return api.get(`api/Cities`).then((response) => {
      const cities = response.data
      commit('SET_CITIES', cities)
    })
  },
}
