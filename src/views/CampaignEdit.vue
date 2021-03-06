<template>
  <div>
    <div
      v-if="isFetchingCampaignData"
      style="height: 40vh; width: 100%; padding: 20%"
    >
      <vs-progress indeterminate color="#ff0080" />
    </div>
    <div v-else>
      <div v-if="editedCampaign.id" class="fade-in">
        <vs-row class="px-10">
          <vs-col vs-w="3">
            <div
              class="mt-20"
              :style="`
              border: 1px dashed ${
                JSON.stringify(campaign.assets) !==
                JSON.stringify(editedCampaign.assets)
                  ? '#ff0080'
                  : '#dedede'
              };
              border-radius: 8px;
            `"
            >
              <AssetGallery
                :assets="editedCampaign.assets"
                :editMode="true"
                :uploadBasepath="`${editedCampaign.id}/campaign-assets/`"
                @onAssetCreated="onAssetCreated"
                @onAssetDeleted="onAssetDeleted"
              />
            </div>
          </vs-col>

          <vs-col vs-w="9">
            <div class="mt-10 pa-10">
              <vs-row>
                <vs-col vs-w="12">
                  <div class="full-width" style="display: flex">
                    <vs-dropdown>
                      <a href="#">
                        {{
                          editedCampaign.organization
                            ? editedCampaign.organization.name
                            : "select organization"
                        }}
                        <vs-icon size="12px" icon="expand_more"></vs-icon>
                      </a>

                      <vs-dropdown-menu>
                        <vs-dropdown-item
                          v-for="userOrg of userOrgs"
                          :key="userOrg.id"
                          @click="editedCampaign.organization = userOrg"
                        >
                          {{ userOrg.name }}
                        </vs-dropdown-item>
                      </vs-dropdown-menu>
                    </vs-dropdown>
                    <span style="flex-grow: 1" />
                    <vs-button
                      class="mb-10"
                      color="primary"
                      type="flat"
                      :disabled="editedCampaign.id === 'new'"
                      :to="`/campaign/view/${editedCampaign.id}`"
                      >View</vs-button
                    >
                    <vs-button
                      class="mb-10"
                      :color="hasPendingSaves ? 'danger' : 'primary'"
                      :disabled="
                        !hasPendingSaves ||
                        !editedCampaign.title ||
                        !editedCampaign.organization
                      "
                      :type="hasPendingSaves ? 'gradient' : 'flat'"
                      @click="saveCampaign()"
                      >Save</vs-button
                    >
                  </div>
                </vs-col>
              </vs-row>

              <vs-row>
                <vs-col vs-w="12">
                  <ContentEditable
                    tag="span"
                    v-model="editedCampaign.title"
                    :styleText="`
                    cursor: select;
                    border: 1px dashed ${
                      campaign.title !== editedCampaign.title
                        ? '#ff0080'
                        : '#dedede'
                    };
                    border-radius: 8px;
                    color: ${
                      campaign.title !== editedCampaign.title ? '#ff0080' : ''
                    };
                    font-size: 60px;
                    font-weight: 100;
                    min-height: 70px;
                    width: 100%;
                    display: inline-block;
                  `"
                  />
                </vs-col>
              </vs-row>

              <vs-row>
                <vs-col vs-w="12">
                  <ContentEditable
                    tag="span"
                    v-model="editedCampaign.description"
                    placeholderValue="description"
                    :styleText="`
                    cursor: select;
                    border: 1px dashed ${
                      campaign.description !== editedCampaign.description
                        ? '#ff0080'
                        : '#dedede'
                    };
                    border-radius: 8px;
                    color: ${
                      campaign.description !== editedCampaign.description
                        ? '#ff0080'
                        : '#4d4d4d'
                    };
                    font-family: 'Lato', sans-serif;
                    font-size: 20px;
                    height: 80px;
                    width: 100%;
                    display: inline-block;
                    resize: vertical;
                    overflow-x: hidden;
                    overflow-y: auto;
                    margin-top: 2px;
                  `"
                  />
                </vs-col>
              </vs-row>

              <vs-row class="mt-16">
                <vs-col vs-w="6" class="pa-10">
                  <vs-card actionable fixed-height>
                    <div
                      class="info-item flex-center pt-10"
                      @click="showCampaignTimelinePopup = true"
                    >
                      <DateRangeViewer
                        :style="`color: ${
                          JSON.stringify(campaign.dateRange) !==
                          JSON.stringify(editedCampaign.dateRange)
                            ? '#ff0080'
                            : ''
                        }`"
                        :dateRange="editedCampaign.dateRange"
                      />
                    </div>
                    <vs-popup
                      title="Campaign Timeline"
                      :active.sync="showCampaignTimelinePopup"
                    >
                      <vs-row>
                        <vs-col vs-w="6" style="text-align: center"
                          >Start Date</vs-col
                        >
                        <vs-col vs-w="6" style="text-align: center"
                          >End Date</vs-col
                        >
                      </vs-row>
                      <vs-row>
                        <vs-col>
                          <div class="flex-center my-8">
                            <date-picker
                              range
                              inline
                              v-model="editedCampaign.dateRange"
                            ></date-picker>
                          </div>
                        </vs-col>
                      </vs-row>
                    </vs-popup>
                  </vs-card>
                </vs-col>
                <vs-col vs-w="6" class="pa-10">
                  <vs-card actionable fixed-height>
                    <div
                      :style="`color: ${
                        campaign.totalBudget !== editedCampaign.totalBudget ||
                        campaign.hitsGoal !== editedCampaign.hitsGoal
                          ? '#ff0080'
                          : ''
                      }`"
                      class="info-item flex-center pt-10"
                      @click="showCampaignBudgetPopup = true"
                    >
                      <span v-if="editedCampaign.totalBudget === null">
                        - - -
                      </span>
                      <span v-else>
                        ${{ editedCampaign.totalBudget }} bounty
                      </span>
                    </div>
                    <vs-popup
                      title="Campaign Budget"
                      :active.sync="showCampaignBudgetPopup"
                    >
                      <vs-row>
                        <vs-col vs-w="3">
                          Total Budget
                          <vs-input-number
                            v-model="editedCampaign.totalBudget"
                            label="$"
                            :min="200"
                            :max="10000"
                            :step="200"
                          />
                          Hits Goal
                          <vs-input-number
                            v-model="editedCampaign.hitsGoal"
                            :min="200"
                            :step="200"
                          />
                        </vs-col>
                        <vs-col vs-w="9">
                          <div
                            v-if="
                              !!editedCampaign.totalBudget &&
                              !!editedCampaign.hitsGoal
                            "
                            class="info-item pt-24"
                            style="text-align: center"
                          >
                            <small>(approximate price per hit)</small>
                            <br />
                            ${{
                              (
                                editedCampaign.totalBudget /
                                editedCampaign.hitsGoal
                              ).toFixed(2)
                            }}
                          </div>
                        </vs-col>
                      </vs-row>
                    </vs-popup>
                  </vs-card>
                </vs-col>
              </vs-row>

              <vs-divider />

              <vs-row style="height: 60px">
                <vs-col vs-w="1" class="flex-center">
                  <vs-switch color="success" v-model="editedCampaign.isActive">
                    <span slot="on">Live</span>
                    <span slot="off">Paused</span>
                  </vs-switch>
                </vs-col>
                <vs-col vs-w="5" class="flex-center">
                  <span v-if="editedCampaign.dateRange[1]" class="ml-8">
                    <i
                      >{{
                        moment
                          .duration(
                            moment(editedCampaign.dateRange[1]).diff(moment())
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
                      <div class="my-8">
                        <vs-card>
                          <div>
                            <vs-textarea
                              class="my-2"
                              label="Post an update"
                              placeholder="Start typing..."
                              v-model="nextPostContent"
                            />
                          </div>

                          <div slot="footer">
                            <vs-row vs-justify="flex-end">
                              <vs-button
                                x-large
                                :disabled="nextPostContent === ''"
                                @click="createActivityPost()"
                                type="gradient"
                                color="danger"
                                icon="send"
                              >
                              </vs-button>
                            </vs-row>
                          </div>
                        </vs-card>
                      </div>
                      <div>
                        <ActivityListViewer :campaignId="editedCampaign.id" />
                      </div>
                    </vs-tab>
                    <vs-tab label="Members">
                      <div class="mt-20">
                        <UserList
                          :sampleUserIdx="2"
                          :highlightActive="false"
                          :usersList="
                            campaign.campaignJoins
                              ? campaign.campaignJoins.map((j) => j.user)
                              : []
                          "
                        />
                      </div>
                    </vs-tab>
                  </vs-tabs>
                </vs-col>
                <vs-col vs-w="4" class="pl-20">
                  <div style="text-align: center">
                    <div
                      class="my-10 pa-8 full-width"
                      :style="`color: ${
                        JSON.stringify(campaign.targetCountries) !==
                        JSON.stringify(editedCampaign.targetCountries)
                          ? '#ff0080'
                          : ''
                      };
                    border: 1px dashed ${
                      JSON.stringify(campaign.targetCountries) !==
                      JSON.stringify(editedCampaign.targetCountries)
                        ? '#ff0080'
                        : '#dedede'
                    };
                    border-radius: 8px;
                    cursor: pointer;
                    `"
                      @click="showGeographicTargetingPopup = true"
                    >
                      <CountryListViewer
                        :countries="editedCampaign.targetCountries"
                      />
                      <vs-popup
                        title="Geographic Targeting"
                        :active.sync="showGeographicTargetingPopup"
                      >
                        <vs-row>
                          <vs-col vs-w="4">
                            <vs-select
                              placeholder="Select countries"
                              multiple
                              autocomplete
                              class="ml-8"
                              label="Regions"
                              v-model="editedCampaign.targetCountries"
                            >
                              <vs-select-item
                                v-for="(country, idx) in countryCodesList"
                                :key="idx"
                                :value="country"
                                :text="country.name"
                              />
                            </vs-select>
                            <div
                              style="
                                height: 300px;
                                width: 100%;
                                overflow-x: hidden;
                                overflow-wrap: break-word;
                              "
                              class="pa-8 ma-8"
                            >
                              <span
                                class="mx-4 country-label"
                                style="cursor: pointer"
                                v-for="(
                                  country, idx
                                ) in editedCampaign.targetCountries"
                                :key="country.code"
                                @click="
                                  editedCampaign.targetCountries.splice(idx, 1)
                                "
                                >{{ country.name }},</span
                              >
                            </div>
                          </vs-col>
                          <vs-col vs-w="8">
                            <div
                              style="
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                height: 100%;
                              "
                            >
                              <div class="pl-48">
                                <CountryListViewer
                                  :countries="editedCampaign.targetCountries"
                                />
                              </div>
                            </div>
                          </vs-col>
                        </vs-row>
                      </vs-popup>
                    </div>

                    <vs-divider />

                    <div
                      class="my-10"
                      @click="showDemographicTargetingPopup = true"
                    >
                      <div
                        style="
                          cursor: pointer;
                          flex-direction: column;
                          font-weight: 200;
                        "
                      >
                        <div
                          class="py-20 mb-20"
                          :style="`
                          color: ${
                            JSON.stringify(campaign.ageRange) !==
                            JSON.stringify(editedCampaign.ageRange)
                              ? '#ff0080'
                              : ''
                          };
                          border: 1px dashed ${
                            JSON.stringify(campaign.ageRange) !==
                            JSON.stringify(editedCampaign.ageRange)
                              ? '#ff0080'
                              : '#dedede'
                          };
                          border-radius: 8px;
                        `"
                        >
                          <span> TARGET PROFILE </span>
                          <div
                            v-if="editedCampaign.ageRange[0]"
                            class="flex-center"
                          >
                            <vs-icon
                              class="material-icons-outlined"
                              icon="supervisor_account"
                              :color="
                                JSON.stringify(campaign.ageRange) !==
                                JSON.stringify(editedCampaign.ageRange)
                                  ? '#ff0080'
                                  : '#bbbbbb'
                              "
                              size="75px"
                            ></vs-icon>
                            <span class="ml-8" style="font-size: 36px">
                              {{ editedCampaign.ageRange[0] }}-{{
                                editedCampaign.ageRange[1]
                              }}
                              yo
                            </span>
                          </div>
                        </div>

                        <div
                          class="pa-8"
                          :style="`color: ${
                            JSON.stringify(campaign.targetDescriptors) !==
                            JSON.stringify(editedCampaign.targetDescriptors)
                              ? '#ff0080'
                              : ''
                          };
                        border: 1px dashed ${
                          JSON.stringify(campaign.targetDescriptors) !==
                          JSON.stringify(editedCampaign.targetDescriptors)
                            ? '#ff0080'
                            : '#dedede'
                        };
                        min-height: 60px;
                        border-radius: 8px;
                        cursor: pointer;
                        overflow-y: auto;
                        resize: vertical;
                        `"
                        >
                          <div
                            v-if="
                              editedCampaign.targetDescriptors.join('') !== ''
                            "
                            style="font-size: 24px"
                          >
                            <div class="my-48 px-8">
                              {{ editedCampaign.targetDescriptors[0] }}
                            </div>

                            <div class="my-48 px-8">
                              {{ editedCampaign.targetDescriptors[1] }}
                            </div>

                            <div class="my-48 px-8">
                              {{ editedCampaign.targetDescriptors[2] }}
                            </div>
                          </div>
                          <div class="pa-24" v-else>
                            <p style="font-weight: 200; font-style: italic">
                              (no descriptors)
                            </p>
                          </div>
                        </div>
                      </div>

                      <vs-popup
                        title="Demographic Targeting"
                        :active.sync="showDemographicTargetingPopup"
                      >
                        <div class="pa-8">
                          Age Range
                          <vs-row>
                            <vs-col vs-w="10">
                              <vs-slider
                                :step="1"
                                v-model="editedCampaign.ageRange"
                              />
                            </vs-col>
                            <vs-col vs-w="2">
                              <div class="pa-10">
                                <div v-if="!editedCampaign.ageRange[0]">-</div>
                                <div v-else>
                                  {{ editedCampaign.ageRange[0] }}-{{
                                    editedCampaign.ageRange[1]
                                  }}
                                  yo
                                </div>
                              </div>
                            </vs-col>
                          </vs-row>

                          <br />

                          Descriptors
                          <vs-textarea
                            v-model="editedCampaign.targetDescriptors[0]"
                          />
                          <vs-textarea
                            v-model="editedCampaign.targetDescriptors[1]"
                          />
                          <vs-textarea
                            v-model="editedCampaign.targetDescriptors[2]"
                          />
                        </div>
                      </vs-popup>
                    </div>

                    <vs-divider />

                    <div
                      class="my-10"
                      @click="showKeywordTargetingPopup = true"
                    >
                      <div
                        class="pa-24"
                        :style="`
                        color: ${
                          JSON.stringify(campaign.targetKeywords) !==
                          JSON.stringify(editedCampaign.targetKeywords)
                            ? '#ff0080'
                            : ''
                        };
                        border: 1px dashed ${
                          JSON.stringify(campaign.targetKeywords) !==
                          JSON.stringify(editedCampaign.targetKeywords)
                            ? '#ff0080'
                            : '#dedede'
                        };
                        border-radius: 8px;
                        cursor: pointer;
                        min-height: 60px;
                        overflow-y: auto;
                        resize: vertical;
                      `"
                      >
                        <KeywordsViewer
                          :keywords="editedCampaign.targetKeywords"
                        />
                      </div>

                      <vs-popup
                        title="Keyword Targeting"
                        :active.sync="showKeywordTargetingPopup"
                      >
                        <div style="height: 300px">
                          <vs-row>
                            <vs-col vs-w="5" class="pa-8">
                              <vs-input
                                size="large"
                                label-placeholder="keyword"
                                v-model="nextKeyword"
                                icon-after="true"
                                icon="add"
                                @icon-click="addNextKeyword"
                              />
                            </vs-col>
                            <vs-col vs-w="7" class="pa-8">
                              <vs-chip
                                class="mx-4"
                                v-for="(
                                  kw, idx
                                ) of editedCampaign.targetKeywords"
                                :key="idx"
                                closable
                                @click="
                                  editedCampaign.targetKeywords.splice(idx, 1)
                                "
                                >#{{ kw }}</vs-chip
                              >
                            </vs-col>
                          </vs-row>
                        </div>
                      </vs-popup>
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
import * as fb from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import * as orgSvc from "@/services/orgSvc";
import * as hotlinksSvc from "@/services/hotLinksSvc";

import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

import ContentEditable from "@/components/ContentEditable";
import DateRangeViewer from "@/components/DateRangeViewer";
import CountryListViewer from "@/components/CountryListViewer";
import KeywordsViewer from "@/components/KeywordsViewer";
import AssetGallery from "@/components/AssetGallery";
import UserList from "@/components/UserList";
import ActivityListViewer from "@/components/ActivityListViewer";

import countryCodesList from "@/assets/countryCodesList.json";

let campaignUpdateSub;

export default {
  components: {
    DatePicker,
    ContentEditable,
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

      userOrgs: [],
      editedCampaign: {},
      showCampaignTimelinePopup: false,
      showCampaignBudgetPopup: false,
      showGeographicTargetingPopup: false,
      showDemographicTargetingPopup: false,
      showKeywordTargetingPopup: false,
      nextKeyword: "",
      nextPostContent: "",
      countryCodesList: countryCodesList,

      isFetchingCampaignData: false,
    };
  },
  computed: {
    ...mapState(["userProfile", "campaign"]),
    hasPendingSaves() {
      return (
        JSON.stringify(this.editedCampaign) !== JSON.stringify(this.campaign)
      );
    },
  },
  async mounted() {
    while (!this.userProfile.id) await this.wait(200);
    campaignUpdateSub = this.$store.subscribe(async (mutation, state) => {
      if (mutation.type === "setCampaign") {
        await this.refreshData();
      }
    });
    this.isFetchingCampaignData = true;

    this.userOrgs = await orgSvc.getOrgsUserCanAccess({
      userId: this.userProfile.id,
    });

    // this.pseudoMemberCount = randomNumber(16, 78);
    // this.pseudoHitsCount = randomNumber(307, 1263);
    this.pseudoMemberCount = "84";
    this.pseudoHitsCount = "2,073";

    this.$store.dispatch("refreshCampaign", this.$route.params.campaignId);
    await this.wait(600);
    this.isFetchingCampaignData = false;
  },
  methods: {
    async refreshData() {
      this.editedCampaign = JSON.parse(JSON.stringify(this.campaign));
    },
    addNextKeyword() {
      if (
        !this.nextKeyword ||
        this.editedCampaign.targetKeywords.includes(
          this.nextKeyword.toLowerCase()
        )
      )
        return;
      this.editedCampaign.targetKeywords.push(this.nextKeyword.toLowerCase());
      this.nextKeyword = "";
    },
    createActivityPost() {
      let pData = {
        assocCampaignId: this.editedCampaign.id.toString(),
        content: this.nextPostContent,
        type: "campaign-manager-update",
      };
      this.$store.dispatch("createActivityPost", pData);
      this.nextPostContent = "";
    },
    async saveCampaign() {
      this.$store.dispatch("saveCampaign", {
        campaign: this.editedCampaign,
      });
    },
    async onAssetCreated(newAsset) {
      let newAssetObj = {
        name: newAsset.name,
        description: "",
        type: newAsset.type,
        source: newAsset.path,
        tags: [],
        id: uuidv4(),
        isActive: true,
      };
      this.editedCampaign.assets.push(newAssetObj);
    },
    async onAssetDeleted(assetToDelete) {
      let fileRef = fb.storage.refFromURL(assetToDelete.source);
      await fileRef.delete();
      let delAssetIdx = this.editedCampaign.assets.findIndex(
        (a) => a.id === assetToDelete.id
      );
      let opts = {
        campaignId: this.editedCampaign.id,
        assetId: this.editedCampaign.assets[delAssetIdx].id,
        isActive: false,
      };
      hotlinksSvc.setHotLinkActiveStatus(opts);
      this.editedCampaign.assets.splice(delAssetIdx, 1);
    },
  },
  beforeDestroy() {
    if (campaignUpdateSub) campaignUpdateSub();
  },
};
</script>

<style scoped>
</style>
