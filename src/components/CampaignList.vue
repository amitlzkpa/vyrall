<template>
  <div style="flex-grow: 1">
    <div v-if="filteredCampaigns.length < 1">
      <span class="flex-center full-width country-label"
        >No campaigns found</span
      >
    </div>
    <div v-else>
      <div v-for="(campaign, idx) of filteredCampaigns" :key="idx">
        <div
          style="height: 66px"
          class="soft-shadow-text py-8 pr-8 my-8 raiseOnHover"
          @click="updateSelectedCampaign(campaign)"
        >
          <div style="display: flex">
            <div style="height: 100%; width: 36px">
              <vs-icon
                v-if="
                  highlightActive &&
                  campaign.id === currentlySelectedCampaign.id
                "
                class="fade-in"
                icon="chevron_right"
                size="36px"
                color="#ff0080"
              />
            </div>
            <div style="font-size: 14px; flex-grow: 1">
              <p style="font-weight: 500; font-size: 16px; font-style: italic">
                {{ campaign.name }}
              </p>
              {{ moment(campaign.startDate).format("MMM Do YYYY") }}
              -
              {{ moment(campaign.endDate).format("MMM Do YYYY") }}
              <br />
              {{
                userProfile.currencyPref
                  ? userProfile.currencyPref.symbol_native
                  : ""
              }}
              {{ campaign.totalBudget | currency }}
            </div>
            <div
              style="height: 100%; min-width: 36px; max-width: 72px"
              class="flex-center mr-16"
            >
              <vs-tooltip text="Total earned from this campaign">
                <span style="font-weight: 500; font-size: 36px">
                  {{
                    userProfile.currencyPref
                      ? userProfile.currencyPref.symbol_native
                      : ""
                  }}
                  {{ campaign.totalEarned | currency }}
                </span>
              </vs-tooltip>
            </div>
          </div>
        </div>
        <vs-divider style="box-shadow: 0 0px 2px #dedede" class="px-16" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

let sampleCampaigns = [
  {
    id: "abc",
    name: "Fendi Winter Drop",
    totalHits: 1482,
    totalEarned: 52,
    startDate: new Date("10/31/2021"),
    endDate: new Date("12/30/2021"),
    totalBudget: 4000,
  },
  {
    id: "def",
    name: "Nike Fall Release",
    totalHits: 712,
    totalEarned: 48,
    startDate: new Date("08/14/2020"),
    endDate: new Date("10/14/2020"),
    totalBudget: 8000,
  },
  {
    id: "ghi",
    name: "Emporium Release",
    totalHits: 182,
    totalEarned: 12,
    startDate: new Date("12/15/2021"),
    endDate: new Date("12/31/2021"),
    totalBudget: 3000,
  },
  {
    id: "jkl",
    name: "Billabong",
    totalHits: 7412,
    totalEarned: 88,
    startDate: new Date("01/14/2020"),
    endDate: new Date("12/31/2021"),
    totalBudget: 6000,
  },
];

export default {
  props: {
    highlightActive: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // allCampaigns: [],
      allCampaigns: sampleCampaigns,
      filteredCampaigns: [],
      filterSettings: {},
      currentlySelectedCampaign: {},
    };
  },
  computed: {
    ...mapState(["userProfile"]),
  },
  async mounted() {
    await this.applyFilter();
    this.currentlySelectedCampaign = this.allCampaigns[1];
  },
  methods: {
    async applyFilter() {
      this.filteredCampaigns = this.allCampaigns;
    },
    async updateSelectedCampaign(updCampaign) {
      this.currentlySelectedCampaign = updCampaign;
    },
  },
};
</script>

<style scoped>
</style>