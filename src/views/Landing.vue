<template>
  <div>
    <vs-row>
      <vs-col>
        <div id="wrapper">
          <div class="content">
            <div
              style="
                display: flex;
                height: 100%;
                justify-content: center;
                align-items: center;
              "
            >
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                "
              >
                <p
                  style="
                    font-size: 92px;
                    font-weight: 100;
                    color: #9900ff;
                    text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8);
                  "
                >
                  vyrall
                </p>
                <h1 class="soft-shadow-text" style="font-weight: 300">
                  The gig economy for influencers.
                </h1>
                <vs-button
                  class="ma-10"
                  radius
                  color="#ff0080"
                  type="filled"
                  icon="play_circle_filled"
                  href="https://youtu.be/E-tR7jIf4gI"
                  target="_blank"
                ></vs-button>
              </div>
            </div>
          </div>
          <div class="background">
            <div style="position: relative">
              <div style="object-fit: cover; width: 100%; z-index: -9999">
                <CountryListViewer :countries="[]" dotColor="#efefef" />
              </div>
              <div
                style="
                  object-fit: cover;
                  width: 100%;
                  height: 700px;
                  position: absolute;
                  top: 0;
                  left: 0;
                  z-index: 10;
                "
              >
                <AnimLines />
              </div>
            </div>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <div style="height: 600px">
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 100%;
              justify-content: center;
              align-items: center;
            "
          >
            <img
              src="/images/icons/queen-svgrepo-com.svg"
              alt="Queen Icon"
              height="240"
            />
            <h1
              style="
                font-weight: 200;
                font-size: 48px;
                max-width: 800px;
                text-align: center;
              "
              class="soft-shadow-text"
            >
              influencers understand their audience very well
            </h1>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <div style="height: 600px">
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 100%;
              justify-content: center;
              align-items: center;
            "
          >
            <img
              src="/images/icons/chat-svgrepo-com.svg"
              alt="Chat Icon"
              height="240"
            />
            <h1
              style="
                font-weight: 200;
                font-size: 48px;
                max-width: 800px;
                text-align: center;
              "
              class="soft-shadow-text"
            >
              use their expertise to inform where and how you showcase your
              brand
            </h1>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <div style="height: 600px">
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 100%;
              justify-content: center;
              align-items: center;
            "
          >
            <img
              src="/images/icons/earth-globe-svgrepo-com.svg"
              alt="Earth Icon"
              height="240"
            />
            <h1
              style="
                font-weight: 200;
                font-size: 48px;
                max-width: 800px;
                text-align: center;
              "
              class="soft-shadow-text"
            >
              connect globally with experts from everywhere
            </h1>
          </div>
        </div>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CountryListViewer from "@/components/CountryListViewer";
import AnimLines from "@/components/AnimLines";

export default {
  components: {
    CountryListViewer,
    AnimLines,
  },
  data() {
    return {
      number: 4,
    };
  },
  computed: {
    ...mapState(["userProfile"]),
    isLoggedIn() {
      return Object.keys(this.userProfile).length > 0;
    },
  },
};
</script>

<style scoped>
#wrapper {
  position: relative;
  width: 100%;
  height: 700px;
}

.content {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.background {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
}
</style>
