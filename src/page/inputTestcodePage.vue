<template>
  <div class="body-style">
    <div class="menu">
      <div class="menu-header">
        <div class="menu-content">
          <a href="/label/">
            <button class="signup-btn-style">Home</button>
          </a>
          <a href="/label/admin/">
            <button class="signup-btn-style">Admin</button>
          </a>
          <a href="/label/admin/imageupload/">
            <button class="signup-btn-style">Image Upload</button>
          </a>
          <a href="/label/admin/testcode">
            <button class="signup-btn-style">Test Code</button>
          </a>
        </div>
      </div>
    </div>
    <div class="home-main-content" style="height: 93vh; margin-bottom: 0; padding-bottom: 0">
      <h2 style="margin-bottom: 40px">Video Scoring & Patch Labeling System</h2>
      <div style="padding-top: 10px; border: 0.5px; border-color: white">
        <div style="margin-top: 1px"></div>
        <div>
          <div class="id-password-testcode-style">
            <div style="margin-bottom: 10px">
              <h4 class="home-h2-font">Testcode</h4>
              <input class="home-input-style" v-model="testcode" placeholder="your testcode" />
            </div>
            <button @click="submitTestcode" class="btn-style login-btn-style">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer">
    <p>Copyright © 2023 Pi:Lab, SMU. All rights reserved.</p>
    <p>help@pilab.smu.ac.kr</p>
  </div>
</template>

<script>
// import VueRouter from 'vue-router'
export default {
  name: "inputTestcodePage",
  data() {
    return {
      baseUrl: process.env.BASE_URL + "api/",
      testcode: "",
      hoveredButton: false,
    };
  },
  created() { },
  mounted() {
  },
  unmounted() {
  },
  methods: {
    onMouseOverButton() {
      this.hoveredButton = true;
    },
    onMouseOutButton() {
      this.hoveredButton = false;
    },
    submitTestcode() {
      this.$router.push({
        name: 'frameSelectionPage',
        state: {
          testcode: this.testcode,
        }
      })

      // this.$router.push({
      //   name: 'testcode',
      //   state: {
      //     testcode: this.testcode
      //   }
      // })
    },
  },
};
</script>

<style>
@import "../main.css";
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap");
</style>
