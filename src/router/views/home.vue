<script>
import appConfig from '@src/app.config';
import Layout from '@layouts/main';
import { citiesGetters } from '@state/helpers'
import qs from 'qs';

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout },
  data() {
    return {
      bookingDetails: {
        roundTrip: false,
        journeyDate: new Date().toISOString().substr(0, 10),
        returningDate: new Date().toISOString().substr(0, 10),
        sourceCity: 'አዲስ አበባ',
        destinationCity: ''
      },
      states: {
        journeyDate: false,
        returningDate: false,
        searchMode: false
      },
    }
  },
  computed: {
    ...citiesGetters
  },
  methods: {
    getPopularDestinationsFor: function () {
      return this.CITIES.sort(() => {return Math.floor(Math.random()*10) - 5}).slice(0,6).map(e => {
        return {
          title: `${e.name}, ${e.country.toUpperCase().slice(0,2)}`,
          journeyDate: this.bookingDetails.journeyDate,
          availableBuses: [
            'Selam Bus'
          ]
        }
      });
    },
    swapCities: function () {
      let temp = this.bookingDetails.sourceCity;
      this.bookingDetails.sourceCity = this.bookingDetails.destinationCity;
      this.bookingDetails.destinationCity = temp;
    },
    showAvailableBuses () {
      this.$router.push(`/searchBuses?${
        qs.stringify({
          based_on: {...this.bookingDetails}
        })
      }`);
    }
  },
}
</script>

<template>
  <Layout no-back>
    <v-container grid-list-xl>
      <v-layout row wrap>

        <v-flex style="min-width: 70%;max-width: 70%;" row wrap>

    <VCard>
      <VCardTitle green-title>
            <h3>Book your travel Tickets</h3>

      </VCardTitle>

  <v-card-text>

    <v-form
      ref="form"
    >
    <vContainer>
      <v-layout row wrap>

      <v-text-field
        v-model="bookingDetails.sourceCity"
        label="Source City"
        outline
        prepend-inner-icon="home"
        prefix="From: "
        required
      ></v-text-field>


 <v-btn
                  v-show="!hidden"
                  color="green"
                  fab
                  dark
                  small
                  @click="swapCities()"
                >
                  <v-icon>swap_horiz</v-icon>
                </v-btn>

      <v-text-field
        v-model="bookingDetails.destinationCity"
        label="Destination City"
        outline
        prefix="To: "
        prepend-inner-icon="place"
        required
                pa-5

      ></v-text-field>
      </v-layout>


      <v-switch v-model="bookingDetails.roundTrip" color="green" label="Round Trip"></v-switch>

<v-layout wrap>
    <v-flex xs11 sm5>
      <v-menu
        ref="journeyDate"
        v-model="states.journeyDate"
        :close-on-content-click="false"
        :return-value.sync="bookingDetails.journeyDate"
        transition="scale-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="bookingDetails.journeyDate"
            label="Journey Date"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
                <v-date-picker
      v-model="bookingDetails.journeyDate"
      width="290"
      color="green"
    >
          <v-btn text color="green" @click="states.journeyDate = false">Cancel</v-btn>
          <v-btn text color="green" @click="$refs.journeyDate.save(bookingDetails.journeyDate)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>

    <v-spacer></v-spacer>


    <v-flex v-if="bookingDetails.roundTrip" xs11  sm5>
      <v-menu
        ref="returningDate"
        v-model="states.returningDate"
        :close-on-content-click="false"
        :return-value.sync="bookingDetails.returningDate"
        transition="scale-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="bookingDetails.returningDate"
            label="Returning Date"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
                <v-date-picker
      v-model="bookingDetails.returningDate"
      width="290"
      color="green"
    >
          <v-btn text color="green" @click="states.returningDate = false">Cancel</v-btn>
          <v-btn text color="green" @click="$refs.returningDate.save(bookingDetails.returningDate)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>


</vContainer>


    </v-form>
      </v-card-text>
      <VCardActions>
              <v-btn
        color="success"
        @click="showAvailableBuses"
      >
        Search Buses
      </v-btn>


      </VCardActions>

        </VCard>


      <VCard class="mt-2">
        <VCardTitle class="title">
          Popular Destinations
        </VCardTitle>
        <VDivider/>
        <v-card-text>


<VLayout row wrap>
  <v-card
  v-for="destination,i in getPopularDestinationsFor(bookingDetails)"
  :key="i"
    :loading="loading"
    class="mx-auto my-2"
    max-width="290"
  >
    <v-img
      height="150"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    ></v-img>

    <v-card-title class="subheading">{{destination.title}}
</v-card-title>

    <v-divider class="mx-4"></v-divider>

    <v-card-text>
      <div class="body-1 text--primary gray--text">Available Buses (on <b>{{destination.journeyDate}}</b>): </div>
      <v-chip-group
        active-class="deep-purple accent-4 white--text"
        column
      >
        <v-chip v-for="bus in destination.availableBuses" :key="bus.title">{{bus}}</v-chip>
      </v-chip-group>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="green accent-4"
        outline
        text
        @click="reserve"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</VLayout>



        </v-card-text>

      </VCard>

        </v-flex>




    <VCard class="mt-2 ml-1">
      <VCardTitle green-title>
            <h3>Booking made simple!</h3>
      </VCardTitle>

  <v-card-text>

  </v-card-text></VCard>

      </v-layout>


    </v-container>
  </Layout>
</template>
