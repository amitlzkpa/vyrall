<template>
  <div>
    <div
      v-if="isFetchingCampaignData"
      style="height: 40vh; width: 100%; padding: 20%"
    >
      <vs-progress indeterminate color="#ff0080" />
    </div>
    <div v-else>
      <div v-if="campaign.id" class="fade-in">
        <vs-row class="px-10">
          <vs-col vs-w="3">
            <div class="mt-20">
              <AssetGallery :assets="campaign.assets" />
            </div>
          </vs-col>

          <vs-col vs-w="9">
            <div class="mt-10 pa-10">
              <vs-row>
                <vs-col vs-w="12">
                  <div class="full-width" style="display: flex">
                    <span
                      v-if="campaign.organization.id"
                      class="mt-12"
                      style="font-size: 12px"
                      >{{ campaign.organization.name }}</span
                    >
                    <span style="flex-grow: 1" />
                    <vs-button
                      class="mb-10"
                      color="primary"
                      type="flat"
                      :to="`/campaign/edit/${campaign.id}`"
                      >Edit</vs-button
                    >
                  </div>
                </vs-col>
              </vs-row>

              <vs-row>
                <vs-col vs-w="12">
                  <span style="font-size: 60px; font-weight: 100">{{
                    campaign.title
                  }}</span>
                </vs-col>
              </vs-row>

              <vs-row>
                <vs-col vs-w="12">
                  <p
                    style="
                      font-family: 'Lato', sans-serif;
                      font-size: 20px;
                      color: #4d4d4d;
                      height: 80px;
                      width: 100%;
                      display: inline-block;
                      resize: vertical;
                      overflow-x: hidden;
                      overflow-y: auto;
                      margin-top: 2px;
                    "
                  >
                    {{ campaign.description }}
                  </p>
                </vs-col>
              </vs-row>

              <vs-row class="mt-16">
                <vs-col vs-w="6" class="pa-10">
                  <vs-card fixed-height>
                    <div class="info-item flex-center pt-10">
                      <DateRangeViewer :dateRange="campaign.dateRange" />
                    </div>
                  </vs-card>
                </vs-col>
                <vs-col vs-w="6" class="pa-10">
                  <vs-card fixed-height>
                    <div class="info-item flex-center pt-10">
                      ${{ campaign.totalBudget }} bounty
                    </div>
                  </vs-card>
                </vs-col>
              </vs-row>

              <vs-divider />

              <vs-row style="height: 60px">
                <vs-col vs-w="1">
                  <div v-if="campaign.currUserHasJoined" class="flex-center">
                    <vs-button
                      color="dark"
                      type="gradient"
                      icon="person_remove"
                      @click="unjoinCampaign()"
                    ></vs-button>
                    <span class="ml-8"> UNJOIN </span>
                  </div>
                  <div v-else class="flex-center">
                    <vs-button
                      color="danger"
                      type="gradient"
                      icon="person_add"
                      @click="joinCampaign()"
                    ></vs-button>
                    <span class="ml-8"> JOIN </span>
                  </div>
                </vs-col>
                <vs-col vs-w="5" class="flex-center">
                  <span class="ml-8" v-if="campaign.dateRange[1]">
                    <i
                      >{{
                        moment
                          .duration(
                            moment(campaign.dateRange[1]).diff(moment())
                          )
                          .humanize()
                      }}
                      to go</i
                    >
                  </span>
                </vs-col>
                <vs-col vs-w="3" class="flex-center">
                  <vs-icon
                    icon="star_outline"
                    color="rgb(255, 130, 0)"
                  ></vs-icon>
                  <span class="ml-8"> {{ pseudoHitsCount }} HITS </span>
                </vs-col>
                <vs-col vs-w="3" class="flex-center">
                  <vs-icon icon="person_outline" color="success"></vs-icon>
                  <span class="ml-8"> {{ pseudoMemberCount }} MEMBERS </span>
                </vs-col>
              </vs-row>

              <vs-divider />

              <vs-row>
                <vs-col vs-w="8">
                  <vs-tabs>
                    <vs-tab label="Activity">
                      <ActivityListViewer :campaignId="campaign.id" />
                    </vs-tab>
                    <vs-tab label="Members">
                      <div class="mt-20">
                        <UserList
                          :sampleUserIdx="2"
                          :highlightActive="false"
                          :usersList="campaign.campaignJoins.map((j) => j.user)"
                        />
                      </div>
                    </vs-tab>
                  </vs-tabs>
                </vs-col>
                <vs-col vs-w="4" class="pl-20">
                  <div style="text-align: center">
                    <div class="my-10 pa-8">
                      <CountryListViewer
                        :countries="campaign.targetCountries"
                      />
                    </div>

                    <vs-divider />

                    <div class="my-10">
                      <div style="flex-direction: column; font-weight: 200">
                        <div class="py-20 mb-20">
                          <span> TARGET PROFILE </span>
                          <div v-if="campaign.ageRange[0]" class="flex-center">
                            <vs-icon
                              class="material-icons-outlined"
                              icon="supervisor_account"
                              color="#bbbbbb"
                              size="75px"
                            ></vs-icon>
                            <span class="ml-8" style="font-size: 36px">
                              {{ campaign.ageRange[0] }}-{{
                                campaign.ageRange[1]
                              }}
                              yo
                            </span>
                          </div>
                        </div>

                        <div
                          v-if="campaign.targetDescriptors.join('') !== ''"
                          style="font-size: 24px"
                        >
                          <div class="my-48 px-8">
                            {{ campaign.targetDescriptors[0] }}
                          </div>

                          <div class="my-48 px-8">
                            {{ campaign.targetDescriptors[1] }}
                          </div>

                          <div class="my-48 px-8">
                            {{ campaign.targetDescriptors[2] }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <vs-divider />

                    <div class="my-10">
                      <KeywordsViewer :keywords="campaign.targetKeywords" />
                    </div>
                  </div>
                </vs-col>
              </vs-row>
            </div>
          </vs-col>
        </vs-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as campaignSvc from "@/services/campaignSvc";

import DateRangeViewer from "@/components/DateRangeViewer";
import CountryListViewer from "@/components/CountryListViewer";
import KeywordsViewer from "@/components/KeywordsViewer";
import AssetGallery from "@/components/AssetGallery";
import UserList from "@/components/UserList";
import ActivityListViewer from "@/components/ActivityListViewer";

export default {
  components: {
    DateRangeViewer,
    CountryListViewer,
    KeywordsViewer,
    AssetGallery,
    UserList,
    ActivityListViewer,
  },
  data() {
    return {
      pseudoMemberCount: "23",
      pseudoHitsCount: "47",
      isFetchingCampaignData: false,
    };
  },
  computed: {
    ...mapState(["userProfile", "campaign"]),
  },
  async mounted() {
    await this.refreshData();

    // this.pseudoMemberCount = randomNumber(16, 78);
    // this.pseudoHitsCount = randomNumber(307, 1263);
    this.pseudoMemberCount = "84";
    this.pseudoHitsCount = "2,073";
  },
  methods: {
    async refreshData() {
      let campaignId = this.$route.params.campaignId;
      if (!campaignId) return;
      this.$store.dispatch("refreshCampaign", campaignId);
      this.isFetchingCampaignData = true;
      await this.wait(1200);
      this.isFetchingCampaignData = false;
    },
    async joinCampaign() {
      await campaignSvc.joinCampaign({ campaignId: this.campaign.id });
      await this.refreshData();
    },
    async unjoinCampaign() {
      await campaignSvc.unjoinCampaign({ campaignId: this.campaign.id });
      await this.refreshData();
    },
  },
};
</script>

<style scoped>
</style>
