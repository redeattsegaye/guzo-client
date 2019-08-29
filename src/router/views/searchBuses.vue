<script>
import appConfig from '@src/app.config';
import Layout from '@layouts/main';
import axios from 'axios';
import qs from 'qs';

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout },
  data() {
    return {
      searchResult: [],
      bookingDetails: {
        roundTrip: false,
        journeyDate: new Date().toISOString().substr(0, 10),
        returningDate: new Date().toISOString().substr(0, 10),
        sourceCity: 'Adama (Nazareth/Nazret)',
        destinationCity: 'Addis Ababa'
      },
      states: {
        journeyDate: false,
        returningDate: false,
        searchMode: false
      },
      tab: null,
      disabled: false,
      price: null,
    }
  },
  mounted() {
    if (this.$route.query) {
      this.bookingDetails = qs.parse(this.$route.query).based_on;
      this.bookingDetails.roundTrip = this.bookingDetails.roundTrip === "true";
      this.fetchBusResults();
    }
  },
  methods: {
    async fetchBusResults(details) {
      const { data } = await axios.get(
        `http://localhost:3000/api/Journies/searchJournies?sourceCityName=${this.bookingDetails.sourceCity}&destinationCityName=${this.bookingDetails.destinationCity}`
      );
      this.searchResult = data;
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
        <v-flex style="min-width: 65%;max-width: 65%;" row wrap>
          <VCard class="mt-2">
            <VCardTitle class="title">
              Search Results: <i>(found {{ searchResult.length ? `about ${searchResult.length} entries` : 'nothing' }})</i>
            </VCardTitle>
            <VDivider/>
            <v-card-text>
              <VLayout v-if="searchResult.length" row wrap>
                    <v-card
                  v-for="result,i in searchResult"
                  :key="i"
                  class="mx-auto my-2"
                  max-width="290">
                  <v-img
                    height="150"
                    src="https://cdn.vuetifyjs.com/images/cards/cooking.png">
                  </v-img>
                  <v-card-title class="subheading">
                    {{result.name}}<div class="grey--text ml-4">Price: {{ result.defaultPrice }} Birr</div>
                  </v-card-title>
                  <v-divider class="mx-4"></v-divider>
                  <v-card-text>
                     <div class="body-1 text--primary">{{ result.description }}</div>

                    <div class="body-1 text--primary"><b>Total Distance:</b> {{ result.totalKms ? `${result.totalKms} KM` : 'Not Specified' }}</div>
 <div class="body-1 text--primary"><b>Starts: </b> {{ result.journeyDate.slice(0,10) }}</div>
  <div class="body-1 text--primary"><b>Returns: </b> {{ result.returningDate.slice(0,10) }}</div>

                    <!-- <v-chip-group
                      active-class="deep-purple accent-4 white--text"
                      column
                    >
                      <v-chip v-for="bus in destination.availableBuses" :key="bus.title">{{bus}}</v-chip>
                    </v-chip-group> -->
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      color="green accent-4"
                      outline
                      text
  block
                    :to="`/purchaseTicket/${result.id}`"
                    >
                      Purchase Ticket
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </VLayout>
              <VLayout v-else row wrap>
<v-container>
                <h4>No Scheduled trips were found that match your request!</h4>
            </v-container>
              </VLayout>
            </v-card-text>
          </VCard>
        </v-flex>
        <VCard class="mt-3 ml-1 mb-3">
          <v-card-text>
            <v-tabs
              v-model="tab"
              fixed-tabs
              background-color="transparent"
              slider-color="green"
            >
              <v-tab>
                Search
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">

              <v-tab-item>
<br/>
                <v-form
                  ref="form"
                >
                <vContainer>
                  <v-layout column>
                      <v-text-field
                        v-model="bookingDetails.sourceCity"
                        label="Source City"
                        outline
                        name="source"
                        prepend-inner-icon="home"
                        prefix="From: "
                        :disabled="disabled"
                        required
                        @change="showAvailableBuses">
                      </v-text-field>
                      <v-text-field
                        v-model="bookingDetails.destinationCity"
                        label="Destination City"
                        name="destination"
                        outline
                        prefix="To: "
                        prepend-inner-icon="place"
                        :disabled="disabled"
                        required
                        @change="showAvailableBuses"
                      ></v-text-field>
                  </v-layout>

                  <v-switch
                    v-model="bookingDetails.roundTrip"
                    name="roundTrip"
                    :disabled="disabled"
                    color="green"
                    label="Round Trip"
                    @change="showAvailableBuses">
                  </v-switch>
                  <v-layout column>
                    <v-flex>
                      <v-menu
                        ref="journeyDate"
                        v-model="states.journeyDate"
                        :close-on-content-click="false"
                        :return-value.sync="bookingDetails.journeyDate"
                        transition="scale-transition"
                        offset-y
                        full-width
                                                :disabled="disabled"
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="bookingDetails.journeyDate"
                            label="Journey Date"
                            name="journeyDate"
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
                          <v-btn text color="green" @click="$refs.journeyDate.save(bookingDetails.journeyDate);showAvailableBuses();">OK</v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex v-if="bookingDetails.roundTrip">
                    <v-menu
                      ref="returningDate"
                      v-model="states.returningDate"
                      :close-on-content-click="false"
                      :return-value.sync="bookingDetails.returningDate"
                      transition="scale-transition"
                      offset-y
                      full-width
                                              :disabled="disabled"
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="bookingDetails.returningDate"
                          label="Returning Date"
                          name="returningDate"
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
                        <v-btn text color="green" @click="$refs.returningDate.save(bookingDetails.returningDate);showAvailableBuses();">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  </v-layout>
                </vContainer>
                </v-form>

              </v-tab-item>

            </v-tabs-items>
           </v-card-text>
        </VCard>
      </v-layout>
    </v-container>
  </Layout>
</template>
