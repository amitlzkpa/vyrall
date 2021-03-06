<template>
  <div class="pa-10 mt-20">
    <div>
      <vs-row>
        <vs-col vs-w="3">
          <div class="my-4" style="min-height: 180px">
            <div v-if="userProfile.walletId">
              <div style="height: 18px">
                <vs-progress
                  v-if="rapydWalletLoading"
                  indeterminate
                  color="primary"
                  >primary</vs-progress
                >
              </div>

              <vs-divider />

              <div
                v-if="rapydWalletData.email"
                class="py-8 full-width"
                style="text-align: center"
              >
                <div style="font-weight: 400; font-size: 20px">
                  {{ rapydWalletData.first_name }}
                </div>
                <div style="font-weight: 300; font-style: italic">
                  {{ rapydWalletData.email }}
                </div>
                <vs-tooltip
                  :text="
                    isRapydVerified
                      ? 'You account is verified!'
                      : 'Verify your Rapyd account to use full features'
                  "
                  position="bottom"
                >
                  <div class="mt-8">
                    <img
                      v-if="isRapydVerified"
                      src="/images/rapyd-logo.png"
                      alt="Rapyd Logo"
                      style="height: 16px"
                    />
                    <vs-icon
                      :icon="isRapydVerified ? 'verified_user' : 'help_outline'"
                      size="18px"
                      class="mr-2"
                    />
                  </div>
                </vs-tooltip>
                <p
                  v-if="!isRapydVerified"
                  style="
                    font-size: 12px;
                    font-face: consolas;
                    color: blue;
                    cursor: pointer;
                  "
                  @click="connectRapydBeneficiaryAcct"
                >
                  Click here to verify
                </p>
              </div>

              <vs-divider />
            </div>

            <div v-else>
              <div class="py-8">
                <div
                  style="
                    border: 3px dashed #dedede;
                    border-radius: 8px;
                    padding: 8px;
                    background-color: #eeeeee;
                    text-align: center;
                  "
                >
                  <div>
                    <div style="font-weight: 300; font-style: italic">
                      Seems like your account is not connected with a wallet.
                    </div>
                    <div class="mt-8">
                      <img
                        src="/images/rapyd-logo.png"
                        alt="Rapyd Logo"
                        style="height: 40px"
                      />
                    </div>
                    <div style="font-weight: 300">
                      Use Rapyd to get paid internationally!
                    </div>
                  </div>
                  <vs-button
                    type="filled"
                    class="full-width"
                    @click="createRapydWallet()"
                    >Create Wallet</vs-button
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            class="pa-10"
            style="
              min-height: 400px;
              display: flex;
              flex-direction: column;
              max-height: 1200px;
              overflow-x: auto;
            "
          >
            <h2>High Performers</h2>
            <HighPerformerList :startIdx="5" />
          </div>
        </vs-col>

        <vs-col vs-w="5">
          <LineChart :data="plotData" />

          <h2 class="pl-20 mt-20">Campaign Earnings</h2>
          <CampaignList />
        </vs-col>

        <vs-col vs-w="4">
          <div
            class="py-4"
            style="
              min-height: 400px;
              display: flex;
              flex-direction: column;
              overflow-x: auto;
            "
          >
            <div class="">
              <RapydWalletCard :walletAddress="userProfile.walletId" />
            </div>
            <div
              class="pa-30 inner-shadow"
              style="
                min-height: 400px;
                max-height: 900px;
                scroll-x: hidden;
                border-radius: 32px;
              "
            >
              <vs-images>
                <vs-image
                  :key="idx"
                  class="pa-4"
                  :src="`/images/stock/1${idx}.jpg`"
                  v-for="(i, idx) in 9"
                />
              </vs-images>
            </div>
          </div>
        </vs-col>
      </vs-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as rapydSvc from "@/services/rapydSvc";
import * as userSvc from "@/services/userSvc";

import HighPerformerList from "@/components/HighPerformerList";
import RapydWalletCard from "@/components/RapydWalletCard";
import CampaignList from "@/components/CampaignList";
import LineChart from "@/components/LineChart";

export default {
  components: {
    HighPerformerList,
    RapydWalletCard,
    CampaignList,
    LineChart,
  },
  data() {
    return {
      rapydWalletLoading: false,
      rapydWalletData: {},
      plotData: {},
    };
  },
  computed: {
    ...mapState(["userProfile"]),
    isRapydVerified() {
      let hasRapydWallet = !!this.rapydWalletData.email;
      return (
        hasRapydWallet &&
        !this.rapydWalletData.verification_status.toLowerCase().includes("not")
      );
    },
  },
  watch: {
    userProfile() {
      this.getRapydWallet();
    },
  },
  async mounted() {},
  methods: {
    async createRapydWallet() {
      await rapydSvc.createRapydWallet();
    },
    async getRapydWallet() {
      if (!this.userProfile.walletId) return;
      this.rapydWalletLoading = true;
      this.rapydWalletData = await rapydSvc.getRapydWallet({
        ewalletId: this.userProfile.walletId,
      });
      this.rapydWalletLoading = false;
    },
    async connectRapydBeneficiaryAcct() {
      let u = await userSvc.currentUser();
      let newBeneficiaryPageInfo = {
        beneficiary_entity_type: "individual",
        sender_country: "US",
        sender_entity_type: "individual",
        merchant_reference_id: u.id,
        beneficiary_optional_fields: {
          vyrall_user_id: u.id,
        },
      };
      let res = await rapydSvc.connectRapydBeneficiaryAcct(
        newBeneficiaryPageInfo
      );
      window.open(res.redirect_url, "_blank").focus();
    },
  },
};
</script>

<style scoped>
</style>