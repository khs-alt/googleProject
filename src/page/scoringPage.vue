<template>
  <div style="position: fixed; overflow: hidden; width: 100%; height: 100%">
    <div class="body-style">
      <div class="menu">
        <div class="menu-header" style="display: flex">
          <div class="menu-content" style="margin-right: 0; justify-content: space-between">
            <div class="progressBar">
              <div v-for="i in progressBarLength" :key="i" :class="getProgressBarClass(i - 1)"
                @click="toggleProgressModal(i - 1)"></div>
            </div>
            <div>
              <button class="signup-btn-style" style="margin-right: 10px" @click="toggleHelpModal()">
                Help
              </button>
              <a href="/label/" style="margin-right: 10px">
                <button class="signup-btn-style">Home</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-wrap" v-show="progressModal">
      <!--진행상황-->
      <div class="modal-container">
        <h3>Progress</h3>
        <div style="display: flex; flex-wrap: wrap">
          <div v-for="i in progressBarList[progressModalPage]" :key="i">
            <button style="
                margin: 2px;
                width: 40px;
                height: 30px;
                font-size: large;
                padding-top: 1px;
                display: flex;
                justify-content: center;
              " :class="userScoringList[progressModalPage * 100 + i - 1] >= 0
                ? 'clicked-btn-style'
                : 'btn-style'
                " @click="changePage(progressModalPage * 100 + i - 1)">
              {{ progressModalPage * 100 + i }}
            </button>
          </div>
        </div>
        <div class="btncontainer">
          <button class="btn-style" @click="toggleProgressModal()">
            Close
          </button>
        </div>
      </div>
    </div>

    <div class="home-main-content" style="padding-bottom: 0; padding-top: 10px; margin-bottom: 8px">
      <p class="web-service-title">Video Ghosting Artifact Scoring System</p>
      <div style="display: flex">
        <div style="font-size: 20px; margin-left: auto; margin-right: 10px">
          {{ currentPageIndex }}/{{ totalLength }}
        </div>
        <div class="toggle-switch" :class="{ active: isToggled }" @click="toggleVideo">
          <div class="toggle-button" :style="{ left: isToggled ? '24px' : '0px' }"></div>
        </div>
      </div>
      <div>
        <!-- 현재 비디오 시간 -->
        <div>{{ this.videoCurrentTime }} / {{ this.videoDuration }}</div>
      </div>
      <div class="video-container">
        <div class="videoPlayer">
          <div id="video-margin">
            <div style="margin: 15px">
              <div id="left-video-cover">
                <!-- toggle된 video -->
                <div v-show="isToggled" style="position: relative">
                  <div style="overflow: hidden" class="video-cover">
                    <video id="toggleVideo" :style="videoStyles" style="position: absolute" class="video-style"
                      ref="toggleVideo" controlsList="nodownload" key="videoDiff" :src="rightArtifactVideo()"
                      @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart" @mouseup="handleDragEnd"
                      @mousemove="handleDragging" preload="metadata"></video>
                  </div>
                </div>
                <div style="display: flex">
                  <video id="videoNoartifact" :style="videoStyles" class="video-style" ref="videoNoartifact"
                    controlsList="nodownload" key="videoNoartifact" :src="leftOriginalVideo()" @wheel="handleWheel"
                    @click="setZoomCenter" @mousedown="handleDragStart" @mouseup="handleDragEnd"
                    @mousemove="handleDragging" preload="metadata"></video>
                </div>
              </div>
              <div>
                <div class="video-name-style">
                  {{ this.originalVideoNameList[videoNameIndex] }}
                </div>
              </div>
            </div>
            <div style="margin: 15px">
              <div id="right-video-cover">
                <video id="videoYesartifact" :style="videoStyles" :class="video - style" class="video-style"
                  ref="videoYesartifact" controlsList="nodownload" key="videoYesartifact" :src="rightArtifactVideo()"
                  @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart" @mouseup="handleDragEnd"
                  @mousemove="handleDragging" preload="metadata"></video>
              </div>
              <div>
                <div class="video-name-style">
                  {{ this.artifactVideoNameList[videoNameIndex] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="scoring-button">
        <div style="margin-bottom: 0px">
          <button class="btn-style" style="padding-bottom: 6px; padding-top: 6px" @click="goToBegin">
            <img class="icon-style" src="../images/play_icon/iconmonstr-media-control-52-240.png" />
          </button>
          <button @click="seekBackward" @mouseover="isMouseOverMinus = true" @mouseout="isMouseOverMinus = false" :class="{
            'btn-style': !isMouseOverMinus,
            'clicked-btn-style': isMouseOverMinus,
          }" style="margin-right: 4px; padding-bottom: 6px; padding-top: 6px">
            <img class="icon-style" src="../images/play_icon/iconmonstr-media-control-18-240.png" />
          </button>
          <button id="videoButton" key="videoButton" @click="
            changeVideoButton();
          changeImgSource();
          " @mouseover="isMouseOverPlay = true" @mouseout="isMouseOverPlay = false" :class="{
  'btn-style ': !isMouseOverPlay,
  'clicked-btn-style': isMouseOverPlay,
}" class="frame-btn" style="margin-left: 4px; padding-bottom: 6px; padding-top: 6px">
            <img class="icon-style" :src="imgSrc" />
          </button>
          <button @click="seekForward" @mouseover="isMouseOverPlus = true" @mouseout="isMouseOverPlus = false" :class="{
            'btn-style': !isMouseOverPlus,
            'clicked-btn-style': isMouseOverPlus,
          }" style="margin-left: 4px; padding-bottom: 6px; padding-top: 6px">
            <img class="icon-style" src="../images/play_icon/iconmonstr-media-control-13-240.png" alt="+1 frame" />
          </button>
          <button class="btn-style" @click="goToEnd" style="padding-bottom: 6px; padding-top: 6px">
            <img class="icon-style" src="../images/play_icon/iconmonstr-media-control-53-240.png" />
          </button>
        </div>
        <div class="score-btn-header">
          <div class="score-btn-sub-header">
            <button v-on="click" class="btn-style" style="
                font-size: x-large;
                width: 80px;
                height: 40px;
                padding-top: 0px;
              " @click="[changeBackVideo()]">
              prev
            </button>
            <button v-for="a in 6" ref="score" :key="a - 1" v-on:click="clickedButton = a - 1" style="
                width: 50px;
                height: 40px;
                font-size: x-large;
                padding-top: 1px;
              " :class="{
                'clicked-btn-style': isPressed[a - 1],
                'btn-style': !isPressed[a - 1],
              }" @click="toggleButton(a - 1)">
              {{ a - 1 }}
            </button>
            <button v-on="click" class="btn-style" style="
                font-size: x-large;
                width: 80px;
                height: 40px;
                padding-top: 0px;
              " @click="[changeNextVideo()]">
              next
            </button>
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
import axios from "axios";
export default {
  name: "scoringPage",
  data() {
    return {
      helpPageVideo: false,
      clickedButton: -1,
      noScore: false,
      userScoring: 0,
      scoreNum: [0, 1, 2, 3, 4, 5],
      isPressed: [false, false, false, false, false, false],
      currentPage: parseInt(this.$route.query.currentPage),
      currentUser: this.$route.query.userName,
      testCode: this.$route.query.testcode,
      // Stop/Play 로 현재 비디오 상태 체크
      isVideoPlaying: false,
      baseUrl: process.env.BASE_URL + "api/",
      isMouseOverMinus: false,
      isMouseOverPlus: false,
      isMouseOverPlay: false,
      // video의 index list. 안의 값은 순차적이지 않고 비디오들의 고유한 인덱스 값으로 구성
      videoIndex: [],
      zoom: 1,
      minZoom: 1,
      // video style을 바꿈으로써 줌과 offset을 조절
      videoStyles: {},
      zoomCenterX: 50,
      zoomCenterY: 50,
      originalVideoNameList: [],
      artifactVideoNameList: [],
      // 현재 비디오가 받아온 비디오에서 몇 번째 비디오인지 알려주는 index
      videoNameIndex: 0,
      // original video와 artifact video의 frame rate를 저장하는 list
      originalVideoFrameList: [],
      artifactVideoFrameList: [],
      dragging: false,
      dragStartX: 0,
      dragStartY: 0,
      offsetX: 0,
      offsetY: 0,
      // 받아온 비디오의 총 개수
      totalLength: 0,
      imgSrc: require("../images/play_icon/iconmonstr-media-control-48-240.png"),
      isToggled: false,
      videoCurrentTime: 0.0,
      videoDuration: 0.0,
      tempVideo: require("./original.mp4"),
      tempVideo2: require("./denoise.mp4"),
      // 점수 체크 안한 비디오, 이미지는 -1로 들어오고 최대 Length까지 전부 들어옴
      userScoringList: [],
      userScoringCount: 0,
      progressBarList: [],
      // user가 scoring 한 비디오의 개수 progress bar에 표시 (list 최대 100개)
      progressBarCount: [0],
      progressBarLength: 0,
      progressModalPage: 0,
      modalPage: 0,
      progressModal: false,
      openModal: true,
      modalTitle: [
        "Manual",
        "Score 0",
        "Score 1",
        "Score 2",
        "Score 3",
        "Score 4",
        "Score 5",
      ],
      modalContent: [
        [
          "1. Use the arrow keys to move next or prev video.",
          "2. Use the number keys to score the video.",
          "3. Use the mouse wheel to zoom in or out.",
          "4. Use the mouse to drag the video.",
          "5. On the left top there are progress bar, you can check what you did and also you can move that video",
        ],
        [
          "When the original and denoised images look almost same",
          "or you cannot feel any perceptually image quality degradation.",
        ],
        ["Original", "Denoise"],
        ["Original", "Denoise"],
        ["Original", "Denoise"],
        ["Original", "Denoise"],
        ["Original", "Denoise"],
      ],
      // help page에 들어가는 예시 비디오들
      videoSrc: [
        require("../videos/original_animals_p64_0.1.mp4"),
        require("../videos/denoised_animals_p64_0.1.mp4"),
        require("../videos/original_birds1_p64_0.2.mp4"),
        require("../videos/denoised_birds1_p64_0.2.mp4"),
        require("../videos/original_amusement_park1_p64_0.3.mp4"),
        require("../videos/denoised_amusement_park1_p64_0.3.mp4"),
        require("../videos/original_boat1_p64_0.4.mp4"),
        require("../videos/denoised_boat1_p64_0.4.mp4"),
        require("../videos/original_build_log_p64_0.5.mp4"),
        require("../videos/denoised_build_log_p64_0.5.mp4"),
      ],
      currentProgress: 0,
      totalFrameLength: 0,
      currentFrame: 0,
      halfVideoFrameRate: 0.015,
      T: 0.03,
      isGoToEndClicked: false,
      isPlayButtonDisabled: false,
    };
  },
  created() { },
  mounted() {
    this.addEventVideoPlay();
    this.getVideoIndexCurrentPage();
    // this.isVideoPaused();
    this.checkProgressBar();
    // this.getVideoCurrentTime();
    document.addEventListener("mousemove", this.handleDragging);
    document.addEventListener("mouseup", this.handleDragEnd);
    window.addEventListener("keydown", this.keydown);
    // this.preloadNextVideo();
    this.addEventVideoCurrentTime();
    this.setProgressBar();
    this.getUserScoringList();
  },
  computed: {
    currentPageIndex() {
      return parseInt(this.videoNameIndex) + 1;
    },
  },
  methods: {
    helpPageVideoNum(index) {
      this.helpPageVideo = !this.helpPageVideo;
      if (this.helpPageVideo == false) {
        return this.videoSrc[index + 1];
      }
      return this.videoSrc[index];
    },
    setT() {
      this.T = 1 / this.originalVideoFrameList[this.videoNameIndex];
      this.halfVideoFrameRate = this.T / 2;
      console.log("[setT] T: ", this.T);
      console.log("[setT] halfVideoFrameRate: ", this.halfVideoFrameRate);
    },
    setInitialTime() {
      const video1 = this.$refs.videoNoartifact;
      const video2 = this.$refs.videoYesartifact;
      const video3 = this.$refs.toggleVideo;

      // 비디오의 currentTime을 halfVideoFrameRate 값으로 설정
      video1.currentTime = this.halfVideoFrameRate;
      video2.currentTime = this.halfVideoFrameRate;
      video3.currentTime = this.halfVideoFrameRate;
    },
    // user가 scoring 한 비디오 list를 전부 받아오는 함수
    // scoring 하지 않았으면 -1 값이 들어옴
    getUserScoringList() {
      console.log("getUserScoringList");
      axios
        .get(this.baseUrl + "getuserScoringList", {
          params: {
            userID: this.currentUser,
            testcode: this.testCode,
          },
        })
        .then((response) => {
          this.userScoringList = response.data.userScoringList;
          console.log("userScoringList" + response.data.userScoringList);
          this.checkProgressBar();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    isVideoFrameSelected() {
      const temp = String(this.currentFrame);
      if (this.selectedVideoFrameList.includes(temp)) {
        return true;
      } else {
        return false;
      }
    },
    checkProgressBar() {
      for (let i = 0; i < this.progressBarLength; i++) {
        this.userScoringCount = 0;
        this.progressBarCount[i] = 0;
        for (let j = 0; j < this.progressBarList[i]; j++) {
          if (this.userScoringList[i * 100 + j] != -1) {
            this.progressBarCount[i]++;
          } else this.userScoringCount++;
        }
        if (this.userScoringCount === this.progressBarList[i]) {
          this.progressBarCount[i] = -1;
        }
      }
    },
    getProgressBarClass(index) {
      const progress = this.progressBarCount[index]; //한 것 개수
      const total = this.progressBarList[index]; //전체 개수
      if (progress === total) {
        return "progressBar-item"; // 다 했을 때
      } else if (progress >= total * 0.7) {
        return "progressBar-item-1"; // 70% 이상 했을 때
      } else if (progress >= total * 0.35) {
        return "progressBar-item-2"; // 35% 이상 했을 때
      } else {
        return "progressBar-item-empty";
      }
    },
    toggleHelpModal() {
      console.log(this.openModal);
      this.openModal = !this.openModal;
    },
    toggleProgressModal(index) {
      console.log(this.progressBarList[index]);
      this.progressModal = !this.progressModal;
      this.progressModalPage = index;
    },
    changeModal(flag) {
      if (flag === 0) {
        if (this.modalPage === 0) {
          this.modalPage = this.modalTitle.length - 1;
        } else {
          this.modalPage--;
        }
      } else {
        if (this.modalPage === this.modalTitle.length - 1) {
          this.modalPage = 0;
        } else {
          this.modalPage++;
        }
      }
    },
    //진행상황 페이지에서 페이지 이동
    async changePage(index) {
      this.currentPage = this.videoIndex[index];
      console.log("[changePage] currentPage: " + this.currentPage);
      this.isPressed = [false, false, false, false, false, false];
      await this.$router.push({
        path: "/label/scoring",
        query: {
          currentPage: this.currentPage,
          userName: this.currentUser,
          testcode: this.testCode,
        },
      });
      // page를 넘어가면
      this.getVideoIndexCurrentPage();
      this.getUserScoringList();
      this.checkProgressBar();
    },
    setProgressBar() {
      this.progressBarLength = Math.ceil(this.videoIndex.length / 100);
      console.log("progressBarLength: " + this.progressBarLength);
      this.progressBarList = [];
      for (var i = 0; i < this.progressBarLength; i++) {
        if (i == this.progressBarLength - 1) {
          this.progressBarList.push(this.videoIndex.length % 100);
          console.log(
            "videoIndex.length % 100: " + (this.videoIndex.length % 100)
          );
        } else {
          this.progressBarList.push(100);
        }
      }
    },
    addEventVideoCurrentTime() {
      var video = document.getElementById('videoNoartifact');

      video.addEventListener("loadeddata", (event) => {
        console.log(event.target.currentTime);
        this.videoCurrentTime = event.target.currentTime;
        this.videoDuration = event.target.duration.toFixed(3);
        this.totalFrameLength = (Math.round(this.videoDuration / this.T));
        this.currentFrame = ~~((this.videoCurrentTime) / this.T)
      });

      video.addEventListener("timeupdate", (event) => {
        this.videoCurrentTime = event.target.currentTime
        this.totalFrameLength = (Math.round(this.videoDuration / this.T));
        this.currentFrame = ~~((this.videoCurrentTime) / this.T)
      })
    },
    async getVideoHeight() {
      var video1 = document.getElementById("videoNoartifact");
      var video1Height = document.getElementById("left-video-cover");
      var video2Height = document.getElementById("right-video-cover");
      var video3Height = document.getElementById("toggleVideo");

      const temp = video1.style.height;
      video1Height.style.height = temp;
      video2Height.style.height = temp;
      video3Height.style.height = temp;

      console.log("video1Height: " + video1Height);
      console.log("video2Height: " + video2Height);
      console.log("video3Height: " + video3Height);
    },
    //키보드 이벤트 함수
    keydown(e) {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          this.changeBackVideo();
          break;
        case "ArrowRight":
          e.preventDefault();
          this.changeNextVideo();
          break;
        case "0":
          this.toggleButton(0);
          break;
        case "1":
          this.toggleButton(1);
          break;
        case "2":
          this.toggleButton(2);
          break;
        case "3":
          this.toggleButton(3);
          break;
        case "4":
          this.toggleButton(4);
          break;
        case "5":
          this.toggleButton(5);
          break;
      }
    },
    toggleVideo() {
      this.isToggled = !this.isToggled;
      this.applyVideoOverlay();
    },
    applyVideoOverlay() {
      // artifact video와 original video에 대한 DOM 레퍼런스를 가져옵니다.
      const originalVideo = this.$refs.videoNoartifact;
      const toggleVideo = this.$refs.toggleVideo;
      var originalVideoHeader = document.getElementById("videoNoartifact");
      var originalVideoStyle = window.getComputedStyle(originalVideoHeader);
      const leftMargin = originalVideoStyle.getPropertyValue("margin-left");
      if (this.isToggled) {
        // originalVideo의 위치와 크기를 가져옵니다.
        const rect = originalVideo.getBoundingClientRect();
        // toggleVideo를 originalVideo 위치 위로 배치합니다.
        toggleVideo.style.left = leftMargin;
        // toggleVideo.style.width = rect.width + 'px';
        // toggleVideo.style.height = rect.height + 'px';
        toggleVideo.style.zIndex = 10; // toggleVideo를 위로
        console.log("rect.width: " + rect.width);
        console.log("rect.height: " + rect.height);
        console.log("toggleVideo.style.width: " + toggleVideo.style.width);
        console.log("toggleVideo.style.height: " + toggleVideo.style.height);
      } else {
        // isToggled가 false일 때, toggleVideo를 원래 상태로 되돌립니다.
        toggleVideo.style.zIndex = 0;
      }
    },
    clickExport() {
      axios
        .post(this.baseUrl + "getCSVFile", {
          testcode: this.clickedTestcodeBtn,
        })
        .then((response) => {
          console.log(response.data);
          alert("Exported testcode: " + this.clickedTestcodeBtn);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    goToBegin() {
      var video1 = document.getElementById('videoNoartifact');
      var video2 = document.getElementById('videoYesartifact');
      var video3 = document.getElementById('toggleVideo');

      video1.pause();
      video1.currentTime = this.halfVideoFrameRate;
      video2.currentTime = this.halfVideoFrameRate;
      video3.currentTime = this.halfVideoFrameRate;
      this.isVideoPlaying = false;
    },
    goToEnd() {
      var video1 = document.getElementById('videoNoartifact');
      var video2 = document.getElementById('videoYesartifact');
      var video3 = document.getElementById('toggleVideo');
      const temp = +(video1.duration).toFixed(2);

      video1.pause();

      video1.currentTime = temp;
      video2.currentTime = temp;
      video3.currentTime = temp;
      this.isVideoPlaying = false;
      this.changeImgSource();
      this.isGoToEndClicked = true;
    },
    changeImgSource() {
      if (this.isVideoPlaying) {
        this.imgSrc = require("../images/play_icon/iconmonstr-media-control-5-240.png");
      } else {
        this.imgSrc = require("../images/play_icon/iconmonstr-media-control-48-240.png");
      }
    },
    // isVideoPaused() {
    //   var video1 = document.getElementById("videoNoartifact");
    //   var video2 = document.getElementById("videoYesartifact");
    //   var toggleVideo = document.getElementById("toggleVideo");
    //   // 비디오가 end 되면 실행
    //   const pauseAndPlayVideo = () => {
    //     video1.pause();
    //     video1.currentTime = this.halfVideoFrameRate;
    //     video2.currentTime = this.halfVideoFrameRate;
    //     toggleVideo.currentTime = this.halfVideoFrameRate;
    //     this.changeImgSource();
    //   };
    //   video1.addEventListener("ended", pauseAndPlayVideo());
    //   video2.addEventListener("ended", pauseAndPlayVideo());
    // },
    zoomIn() {
      this.zoom += 0.1;
      this.updateVideoStyle();
    },
    zoomOut() {
      if (this.zoom >= this.minZoom + 0.1) {
        this.zoom -= 0.1;
        this.updateVideoStyle();
      }
    },
    setZoomCenter() {
      // 가운데를 기준으로 줌 센터를 고정합니다.
      this.zoomCenterX = 50;
      this.zoomCenterY = 50;
      this.updateVideoStyle();
    },
    handleWheel(event) {
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
      // 스크롤 이벤트로 인한 줌 변경 시 항상 가운데를 기준으로 설정합니다.
      this.setZoomCenter(event);
      event.preventDefault();
    },
    handleDragStart(event) {
      this.dragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    },
    handleDragging(event) {
      if (this.dragging) {
        // Zoom level에 따라 드래그 속도 조정
        const adjustedX = (event.clientX - this.dragStartX) / this.zoom;
        const adjustedY = (event.clientY - this.dragStartY) / this.zoom;

        this.offsetX += adjustedX;
        this.offsetY += adjustedY;

        // 초기 드래그 위치 업데이트
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;

        this.updateVideoStyle();
      }
    },
    handleDragEnd() {
      this.dragging = false;
    },
    updateVideoStyle() {
      const scale = `scale(${this.zoom})`;
      const translate = `translate(${this.offsetX}px, ${this.offsetY}px)`;

      this.videoStyles = {
        transform: `${scale} ${translate}`,
        transformOrigin: `${this.zoomCenterX}% ${this.zoomCenterY}%`,
      };
    },
    resetZoomAndOffset() {
      this.zoom = this.minZoom;
      this.offsetX = 0;
      this.offsetY = 0;
    },
    removeSuffix() {
      this.originalImageName = this.imageOriginalNameList[this.currentPage];
      this.originalImageName = this.originalImageName.replace(
        /_0\.\d+\.mp4$/,
        ".mp4"
      );
      this.artifactImageName = this.imageArtifactNameList[this.currentPage];
      this.artifactImageName = this.artifactImageName.replace(
        /_0\.\d+\.mp4$/,
        ".mp4"
      );
    },
    // json 받아오는 형식
    // resData := map[string]string{
    // 	"currentPage": currentPage,
    // 	"videoIndex":   videoList,
    // }

    async getVideoIndexCurrentPage() {
      console.log("getVideoIndexCurrentPage");
      var temp = String(this.currentPage);
      // ** 여기서 currentPage를 넘겨줄 때 무조건 String형으로 넘겨줘야 함!! **
      await axios
        .post(this.baseUrl + "getVideoIndexCurrentPage", {
          userID: this.currentUser,
          testcode: this.testCode,
          currentPage: temp,
        })
        .then((response) => {
          // this.currentPage = parseInt(response.data.currentPage); //여기다 1 더해서
          this.videoIndex = response.data.videoList;
          this.totalLength = this.videoIndex.length;
          this.originalVideoNameList = response.data.originalVideoNameList;
          this.artifactVideoNameList = response.data.artifactVideoNameList;
          this.originalVideoFrameList = response.data.originalVideoFPSList;
          this.artifactVideoFrameList = response.data.artifactVideoFPSList;
          const curScore = response.data.userScore;

          for (var i = 0; i < this.videoIndex.length; i++) {
            if (this.videoIndex[i] == this.currentPage) {
              this.videoNameIndex = i;
              break;
            }
          }

          if (curScore != -1) {
            this.isPressed[curScore] = true;
            this.clickedButton = curScore;
            console.log("curScore: " + curScore);
          }

          console.log("video list: ", this.videoIndex);
          this.setProgressBar();
        })
        .catch((error) => {
          console.log(error);
          alert("login failed");
          this.$router.push(process.env.BASE_URL);
        });
    },
    navigateTo(item) {
      if (item === "Home") {
        this.$router.push("/");
      }
    },
    leftOriginalVideo() {
      return String(this.baseUrl + "postvideo/original/" + this.currentPage);
    },
    rightArtifactVideo() {
      return String(this.baseUrl + "postvideo/artifact/" + this.currentPage);
    },
    // 다음 비디오로 넘어가는 함수
    async changeNextVideo() {
      if (this.isVideoPlaying) {
        this.changeVideoButton();
      }
      this.userScoring = this.clickedButton;
      console.log("[changeNextVideo] user scoring: ", this.userScoring);

      // zomm = 1, offset = 0으로 초기화
      this.resetZoomAndOffset();

      // 바뀐 zoom과 offset을 적용
      this.updateVideoStyle();
      var videoEelement1 = document.getElementById("videoNoartifact");
      var videoEelement2 = document.getElementById("videoYesartifact");
      videoEelement1.style.transform = "scale(1)";
      videoEelement2.style.transform = "scale(1)";

      // 비디오가 play 중이면 stop 상태로 변경
      if (this.isToggled) {
        this.toggleVideo();
      }

      // 마지막 페이지인 경우
      if (this.currentPage == this.videoIndex[this.videoIndex.length - 1]) {
        // this.getVideoIndexCurrentPage();
        alert("This is the last page of this test code. Thank you!");
        this.$router.push({
          path: "/label/scoring",
          query: {
            currentPage: this.currentPage,
            userName: this.currentUser,
            testcode: this.testCode,
          },
        });
        this.getVideoIndexCurrentPage();
        return;
      } else {
        //
        this.videoNameIndex += 1;
        this.currentPage = this.videoIndex[this.videoNameIndex];
        console.log("[changeNextVideo] videoNameIndex: " + this.videoNameIndex);
        console.log("[changeNextVideo] currentPage: " + this.currentPage);
        this.isPressed = [false, false, false, false, false, false];
        await this.$router.push({
          path: "/label/scoring",
          query: {
            currentPage: this.currentPage,
            userName: this.currentUser,
            testcode: this.testCode,
          },
        });
        this.getUserScoringList();
        this.setProgressBar();
        this.getVideoIndexCurrentPage();
      }
    },
    changeBackVideo() {
      if (this.isVideoPlaying) {
        this.changeVideoButton();
      }
      this.userScoring = this.clickedButton;
      console.log("[changeBackVideo] user scoring: ", this.userScoring);
      this.resetZoomAndOffset();
      this.updateVideoStyle();
      if (this.isToggled) {
        this.toggleVideo();
      }
      var videoEelement1 = document.getElementById("videoNoartifact");
      var videoEelement2 = document.getElementById("videoYesartifact");
      videoEelement1.style.transform = "scale(1)";
      videoEelement2.style.transform = "scale(1)";

      // 첫번째 비디오인 경우
      if (this.currentPage == this.videoIndex[0]) {
        alert("This is the first page of this test code.");
        this.$router.push({
          path: "/label/scoring",
          query: {
            currentPage: parseInt(this.currentPage),
            userName: this.currentUser,
            testcode: this.testCode,
          },
        });
        this.getUserScoringList();
        this.getVideoIndexCurrentPage();
        this.setProgressBar();
        return;
      } else {
        this.videoNameIndex -= 1;
        this.currentPage = this.videoIndex[this.videoNameIndex];
        this.isPressed = [false, false, false, false, false, false];
        this.$router.push({
          path: "/label/scoring",
          query: {
            currentPage: this.currentPage,
            userName: this.currentUser,
            testcode: this.testCode,
          },
        });
        this.getUserScoringList();
        this.getVideoIndexCurrentPage();
        this.setProgressBar();
      }
    },
    // score button 누르면 점수를 백엔드로 보내는 함수
    toggleButton(index) {
      this.isPressed = [false, false, false, false, false, false];
      this.isPressed[index] = !this.isPressed[index];

      this.userScoring = index;
      axios
        .post(this.baseUrl + "postdata", {
          Title: "scoring data",
          Score: this.userScoring,
          CurrentUser: this.currentUser,
          ImageId: parseInt(this.currentPage),
          TestCode: this.testCode,
        })
        .then((res) => {
          //after post we have to init data form userScoring and currentPage
          this.userScoring = 0;
          // this.resetZoomAndOffset();
          // this.updateVideoStyle();
          console.log("[toggleButton]: " + res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // original video를 play 하면 artifact video, toggle video도 같이 play 되도록 하는 method
    addEventVideoPlay() {
      var video1 = document.getElementById('videoNoartifact');
      var video2 = document.getElementById('videoYesartifact');
      var video3 = document.getElementById('toggleVideo');

      var video1_currentTime = video1.currentTime;
      video1.currentTime = video1_currentTime;
      video2.currentTime = video1_currentTime;
      video3.currentTime = video1_currentTime;

      video1.addEventListener("play", () => {
        document.getElementById('videoYesartifact').play();
        document.getElementById('toggleVideo').play();
        this.isVideoPlaying = true;
        this.changeImgSource();
      });

      video1.addEventListener("pause", () => {
        document.getElementById('videoYesartifact').pause();
        document.getElementById('toggleVideo').pause();
        let T = 1 / this.originalVideoFrameList[this.videoNameIndex]
        let temp = +(~~(video2.currentTime / T) * T).toFixed(3) + this.halfVideoFrameRate;
        video1.currentTime = temp;
        video2.currentTime = temp;
        video3.currentTime = temp;
        this.isVideoPlaying = false;
        this.changeImgSource();
      })

      video1.addEventListener("ended", () => {
        this.isPlayButtonDisabled = true;

        if (this.isGoToEndClicked) {
          this.isGoToEndClicked = false;
          return;
        }
        setTimeout(() => {
          this.isPlayButtonDisabled = false;
        }, 300);

        video1.currentTime = 0;
        video2.currentTime = 0;
        video3.currentTime = 0;
        video1.play();
      })
    },
    // Play/Stop 및 text 변경 버튼
    changeVideoButton() {
      if (!this.isPlayButtonDisabled) {
        console.log("[changeVideoButton]: current isVideoPlaying: " + this.isVideoPlaying);
        let orignalVideo = document.getElementById("videoNoartifact");

        if (this.isVideoPlaying == false) {
          orignalVideo.play();
          this.isVideoPlaying = true;
        } else {
          orignalVideo.pause();
          this.isVideoPlaying = false;
        }
        this.changeImgSource();
      }
    },
    async seekBackward() {
      console.log("seekBackward");
      const video1 = this.$refs.videoNoartifact;
      const video2 = this.$refs.videoYesartifact;
      const video3 = this.$refs.toggleVideo;

      const videoFrame = 1 / this.originalVideoFrameList[this.videoNameIndex];
      const video1CurrentTime = video1.currentTime;
      const video2CurrentTime = video2.currentTime;
      const video3CurrentTime = video3.currentTime;
      console.log("videoFrame: ", videoFrame);

      if (videoFrame != 0) {
        if (video1CurrentTime - videoFrame <= 0 || video2CurrentTime - videoFrame <= 0 || video3CurrentTime - videoFrame <= 0) {
          video1.currentTime = this.halfVideoFrameRate;
          video2.currentTime = this.halfVideoFrameRate;
          video3.currentTime = this.halfVideoFrameRate;
          return;
        }
        const t = (~~(video1.currentTime / parseFloat(videoFrame) - 1) * videoFrame) + this.halfVideoFrameRate;
        video1.currentTime = t;
        video2.currentTime = t;
        video3.currentTime = t;
      }
    },
    async seekForward() {
      console.log("seekForward");
      const video1 = this.$refs.videoNoartifact;
      const video2 = this.$refs.videoYesartifact;
      const video3 = this.$refs.toggleVideo;
      const videoFrame = 1 / this.originalVideoFrameList[this.videoNameIndex];
      const video1CurrentTime = video1.currentTime;
      const video2CurrentTime = video2.currentTime;
      const video3CurrentTime = video3.currentTime;

      console.log("videoFrame: ", videoFrame);
      console.log("halfVideoFrameRate: ", this.halfVideoFrameRate);

      if (videoFrame != 0) {
        if (video1CurrentTime + videoFrame > video1.duration || video2CurrentTime + videoFrame > video1.duration || video3CurrentTime + videoFrame > video1.duration) {
          video1.currentTime = video1.duration - this.halfVideoFrameRate;
          video2.currentTime = video1.duration - this.halfVideoFrameRate;
          video3.currentTime = video1.duration - this.halfVideoFrameRate;
          return;
        }
        const t = (~~(video1.currentTime / parseFloat(videoFrame) + 1) * videoFrame) + this.halfVideoFrameRate;
        console.log("t: ", t);
        video1.currentTime = t;
        video2.currentTime = t;
        video3.currentTime = t;
      }
    },
  },
};
</script>

<style>
@import "../main.css";
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap");
</style>
