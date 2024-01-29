<template>
  <div class="body-style">
    <div class="menu">
      <div class="menu-header" style="display: flex;">
        <div class="menu-content" style="justify-content: right;">
          <a href="/label/" style="margin-right: 10px;">
            <button class="signup-btn-style">Home</button>
          </a>
        </div>
      </div>
    </div>
    <div>
      <div class="home-main-content" style="height: 93vh; margin-bottom: 0; padding-bottom: 0;">
        <br>
        <h2 style="font-weight: 400;">Admin Page</h2>
        <div style="margin-bottom: 25px;"> </div>
        <br>
        <div class="id-password-testcode-style" style="display: grid;">
          <div style="margin-bottom: 50px;">
            <h4 class="home-h2-font" style="display: contents;" v-on="click" @click="toggleCategory(0)"> {{
              this.isVideoCategoryToggled ?
              this.videoToggleIcon[1] : this.videoToggleIcon[0] }} Video</h4>
            <div v-show="this.isVideoCategoryToggled" style="display: grid;">
              <div style="margin-top: 5px;">
                <a href="/label/admin/upload/">
                  <button class="signup-btn-style">Video Upload</button>
                </a>
              </div>
              <div style="margin-top: 5px;">
                <a href="/label/admin/testcode/">
                  <button class="signup-btn-style">Video Testcode</button>
                </a>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 50px;">
            <h4 class="home-h2-font" style="display: contents;" v-on="click" @click="toggleCategory(1)"> {{
              this.isImageCategoryToggled ?
              this.imageToggleIcon[1] : this.imageToggleIcon[0] }} Image</h4>
            <div v-show="this.isImageCategoryToggled" style="display: grid;">
              <div style="margin-top: 5px;">
                <a href="/label/admin/imageupload/">
                  <button class="signup-btn-style">Image Upload</button>
                </a>
              </div>
              <div style="margin-top: 5px;">
                <a href="/label/admin/imagetestcode/">
                  <button class="signup-btn-style">Image Testcode</button>
                </a>
              </div>
            </div>
          </div>
          <div style="margin-top: 5px;">
            <a href="/label/admin/inputtestcode/">
              <button class="signup-btn-style">Frame Selection</button>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>Copyright © 2024 Pi:Lab, SMU. All rights reserved.</p>
      <p>help@pilab.smu.ac.kr</p>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios'
export default {
  name: 'adminMainPage',
  data() {
    return {
      // videoList: [require('./videos/20230726_213056.mp4'), require('./videos/20230726_213255.mp4')],
      currentUser: '',
      currentMode: 'Nothing',
      userScoring: [],
      clickedButton: 0,
      menuBar: ['Home'],
      lastPage: false,
      baseUrl: process.env.BASE_URL + "admin/",
      userId: '',
      password: '',
      isVideoCategoryToggled: true,
      isImageCategoryToggled: true,
      videoToggleIcon: ["▶", "▼"],
      imageToggleIcon: ["▶", "▼"],
    }
  },
  created() { },
  mounted() {
    window.addEventListener('keydown', this.keydown);
  },
  methods: {
    toggleCategory(toggledIndex) {
      if (toggledIndex == 0) {
        this.isVideoCategoryToggled = !this.isVideoCategoryToggled
      } else if (toggledIndex == 1) {
        this.isImageCategoryToggled = !this.isImageCategoryToggled
      } else if (toggledIndex == 2) {
        this.isVideoFrameSelectionToggled = !this.isVideoFrameSelectionToggled
      }
    },
    // TODO: export page 메인 admin page를 만들기 
    // export 할 때 점수는 평균으로
    // Tag를 선택하여 export 할 수 있도록 하기
    // 반환 데이터
    // originalVideoName, desoisedVideoName, Score(Laebled)

    goToPage() {
      this.$router.push({
        path: 'admin/upload',
        query: {
          userName: this.userId,
          currentPage: this.currentPage
        }
      })
    },
    changeCurrentMode(mode) {
      this.currentMode = mode
    },
    submitCredentials() {
      if (this.userId && this.password) {
        //console.log(this.userId, this.password)
        console.log("location origin: " + location.origin);
        axios
          .post(this.baseUrl + "/login", {
            adminId: this.userId,
            adminPassword: this.password,
          })
          .then(res => {
            if (res.data == "yes") {
              this.currentUser = this.userId
              this.$router.push(process.env.BASE_URL + 'upload/')
            } else {
              // alert("login failed");
              // return;
            }
          })
          .catch(error => {
            console.error(error);
          })
      } else {
        alert('Please enter your ID and Password');
      }
    },
    navigateTo(item) {
      if (item == 'Home') {
        this.$router.push('/');
      } else {
        alert(item)
      }
    },

    keydown(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.submitCredentials();
      }
    },
  }
}
</script>
  
<style>
@import '../main.css';
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
</style>
  