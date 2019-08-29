<script>
import appConfig from '@src/app.config';
import Layout from '@layouts/main';
import axios from 'axios';
import { authComputed } from '@state/helpers'
import qs from 'qs';

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout },
  data() {
    return {
      tickets: [],
      chosenTicket: '5d62587e121b6d6732610f84',
      transaction_id: null,
      transaction_date: null
    }
  },
  mounted() {
    this.fetchTickets();
  },
  computed : {
    ...authComputed
  },
  methods: {
    async fetchTickets(details) {
      const { data } = await axios.get(
        `http://localhost:3000/api/Journies/${this.$route.params.journeyId}?filter=%7B%22include%22%3A%20%5B%22tickets%22%5D%7D`
      );
      this.tickets = JSON.parse(JSON.stringify(data)).tickets;
    },
    async submitPurchase() {
          try{

      await axios.post(`http://localhost:3000/api/tickets/${this.chosenTicket}/ticketPurhaseAttempts`, {
    "transaction_id": this.transaction_id,
    "bank_name": "CBE",
    "transaction_date": new Date(this.transaction_date),
    "ticketId": this.chosenTicket,
    "userId": this.currentUser.user.id
  })
    alert("successfully entered a purchase attempt.. wait for verification..");     this.$router.replace('/')

  }
  catch(err) {
    alert("ERROR: while trying to purchase.. please review the form")
  }
    },
    showAvailableBuses () {
      this.disabled = true;
      this.$router.replace(`/searchBuses?${
        qs.stringify({
          based_on: {...this.bookingDetails}
        })
      }`, () => {
        this.disabled = false;
      });
    }
  }
}
</script>

<template>
  <Layout no-back>

    <v-container class="ma-1 pa-1" grid-list-xl>
      <v-layout row wrap>
        <v-flex style="min-width: 75%;max-width: 75%;" row wrap>
          <VCard class="mt-2">
            <VCardTitle class="title">
              <b>STEP #1: </b> choose a seat/ticket (price may vary)</i>
            </VCardTitle>
            <VDivider/>
            <v-card-text>
              <VLayout v-if="tickets.length" row wrap>

  <v-list two-line style="width:100%;">
          <template v-for="(item, index) in tickets">
            <v-divider v-if="![0,1].includes(index)"></v-divider>
            <v-list-tile
              :key="index"
              avatar
              ripple
              :style="chosenTicket === item.id ? 'border: 2px solid green;': ''"
              @click="chosenTicket = item.id"
            >
              <v-list-tile-content>
                <v-list-tile-title class="title font-weight-light">{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary"><b>Price:</b> {{ item.price }} </v-list-tile-sub-title>
                <v-list-tile-sub-title><b>Row:</b> {{ item.row }} | <b>Column:</b> {{ item.column }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>


                <v-btn color="success" outline @click="chosenTicket = item.id">Choose</v-btn>
                <!-- <v-icon
                  v-if="selected.indexOf(index) < 0"
                  color="grey lighten-1"
                >
                  star_border
                </v-icon>

                <v-icon
                  v-else
                  color="yellow darken-2"
                >
                  star
                </v-icon> -->
              </v-list-tile-action>

            </v-list-tile>
            <v-divider
              v-if="index + 1 < tickets.length"
              :key="index"
            ></v-divider>
          </template>
        </v-list>

              </VLayout>
              <VLayout v-else row wrap>
<v-container>
                <h4>No Tickets were found!</h4>
            </v-container>
              </VLayout>
            </v-card-text>
          </VCard>
        </v-flex>
        <v-flex style="min-width: 75%;max-width: 75%;" row wrap>
          <VCard class="mt-2">
            <VCardTitle class="title">
              <b>STEP #2: </b> Pay via CBE & enter the form</i>
            </VCardTitle>
            <VDivider/>
            <v-card-text>
              <v-container grid-list-xs>
                <v-text-field
                  v-model="transaction_id"
                  name="transaction_id"
                  label="Transaction Id"
                  :disabled="!!!chosenTicket"
                ></v-text-field>
                <v-text-field
                  v-model="transaction_date"
                  name="transaction_date"
                  label="Transaction Date (YYYY-MM-DD)"
                  :disabled="!!!chosenTicket"
                ></v-text-field>
                <v-btn block color="green" :disabled="!!!chosenTicket" @click="submitPurchase" >Submit Purchase</v-btn>
              </v-container>
            </v-card-text>
            </VCard>
            </v-flex>

      </v-layout>
    </v-container>
  </Layout>
</template>
