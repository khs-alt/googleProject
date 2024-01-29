<template>
  <div class="body-style">
    <div class="menu">
      <div class="menu-header" style="display: flex;">
        <div class="menu-content" style="margin-right: 0; justify-content: right;">
          <a href="/label/">
            <button class="signup-btn-style">Home</button>
          </a>
          <a href="/label/admin/main">
            <button class="signup-btn-style">Admin</button>
          </a>
        </div>
      </div>
    </div>
    <div class="home-main-content" style="height: 93vh; margin-bottom: 0; padding-bottom: 0">
      <div style="display: flex">
        <div style="display:inline-block; text-align: left; margin-left: 2vw;">
          <h5>
            Admin Index
          </h5>
          <div style="display: inline-block;">
            <div>
              <div>Video</div>
              <div>
                <li><a href="/label/admin/testcode">Video Testcode</a></li>
                <li><a href="/label/admin/upload">Video Upload</a></li>
              </div>
              <div>Image</div>
              <div>
                <li><a href="/label/admin/imagetestcode">Image Testcode</a></li>
                <li><a href="/label/admin/imageupload">Image Upload</a></li>
              </div>
              <div>Frame Selection</div>
              <div>
                <li><a href="/label/admin/inputtestcode">Video Frame Selection</a></li>
              </div>
            </div>
          </div>
        </div>
        <div style="display: inline-block; margin-left: 20vw; margin-right: auto;">
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
    </div>
  </div>
  <div class="footer">
    <p>Copyright © 2024 Pi:Lab, SMU. All rights reserved.</p>
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
