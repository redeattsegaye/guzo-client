<script>
import { items, drawerState } from '@state/helpers'

export default {
  data() {
    return {
      menus: [
        {
          name: '/buyTicket',
          title: 'How To Buy',
          description: 'Introduction to available payment options'
        },
        {
          name: '/getTicket',
          title: 'Print/SMS/email Ticket',
          description: 'Get your tickets in various forms'
        },
        {
          name: '/cancelTicket',
          title: 'Cancellation',
          description: 'Cancel your ticket'
        },
        {
          name: '/refundTicket',
          title: 'Check Refund Status',
          description: 'Track Refund Status here'
        },
      ]
    }
  },
  computed: {
    ...items,
    ...drawerState,
  },
  methods: {
  },
}
</script>

<template>
  <v-navigation-drawer :value="DRAWER" app>
    <v-list v-if="menus.length" two-line dense class="pt-0">
        <v-list-tile
        v-for="item, i in menus" :key="i"
          @click="$router.push(item.name)"
        >
          <v-list-tile-avatar color="green lighten-3">
            <span class="white--text title font-weight-light">{{ item.title[0] }}</span>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.description }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
    </v-list>


  </v-navigation-drawer>
</template>

<style lang="scss" module>
@import '@design';
</style>
