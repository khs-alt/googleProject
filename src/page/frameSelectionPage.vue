<template>
  <div style="position: fixed; overflow: hidden; width: 100%; height: 100%;">
    <div class="body-style">
      <div class="menu">
        <div class="menu-header" style="display: flex;">
          <div class="menu-content" style="margin-right: 0; justify-content: right;">
            <a href="/label/" style="margin-right: 10px;">
              <button class="signup-btn-style">Home</button>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="home-main-content" style="padding-bottom: 0; padding-top: 10px; margin-bottom: 8px;">
      <p style="font-size: 24px; margin-top: 10px; margin-bottom:4px">{{ this.testcode }}</p>
      <div>
        <!-- 현재 비디오 시간 -->
        <div>
          Time : {{ this.videoCurrentTime }} / {{ this.videoDuration }}
        </div>
      </div>
      <div>
        <div>
          Frame : {{ this.currentFrame }} / {{ this.totalFrameLength }}
        </div>
        <div>
          selected frame {{ this.selectedVideoTimeList.length }} framse out of {{ this.totalFrameLength }} per video
        </div>
      </div>
      <div class="video-container">
        <div class="videoPlayer">
          <div id="video-margin" style="display: flex; max-height: 60%;">
            <div style="margin: 15px;">
              <!-- original video  -->
              <div id="left-video-cover">
                <div style="display: flex;">
                  <!-- TODO: -->
                  <video @loadedmetadata="setInitialTime" id="videoNoartifact" :style="videoStyles" class="video-style"
                    ref="videoNoartifact" controlsList="nodownload" key="videoNoartifact" :src="leftOriginalVideo()"
                    @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart" @mouseup="handleDragEnd"
                    @mousemove="handleDragging" preload="auto">
                  </video>
                  <!-- <video id="videoNoartifact" :style="videoStyles" class="video-style" ref="videoNoartifact"
                    controlsList="nodownload" key="videoNoartifact" :src="tempVideo" @wheel="handleWheel"
                    @click="setZoomCenter" @mousedown="handleDragStart" @mouseup="handleDragEnd"
                    @mousemove="handleDragging" preload="auto">
                  </video> -->
                </div>
              </div>
              <div>
                <div style="margin-top: 8px; font-size: 14px; ">{{
                  this.originalVideoNameList[videoNameIndex] }}
                </div>
              </div>
            </div>
            <!-- artifact video -->
            <div style="margin: 15px;">
              <div id="right-video-cover">
                <!-- TODO: -->
                <video @loadedmetadata="setInitialTime" id="videoYesartifact" :style="videoStyles" :class="video - style"
                  class="video-style" ref="videoYesartifact" controlsList="nodownload" key="videoYesartifact"
                  :src="rightArtifactVideo()" @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart"
                  @mouseup="handleDragEnd" @mousemove="handleDragging" preload="auto">
                </video>
                <!-- <video id="videoYesartifact" :style="videoStyles" :class="video - style" class="video-style"
                  ref="videoYesartifact" controlsList="nodownload" key="videoYesartifact" :src="tempVideo2"
                  @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart" @mouseup="handleDragEnd"
                  @mousemove="handleDragging" preload="auto">
                </video> -->
              </div>
              <div>
                <div style="margin-top: 8px; font-size: 14px;">{{
                  this.artifactVideoNameList[videoNameIndex] }}
                </div>
              </div>
            </div>
            <!-- diff video -->
            <div style="margin: 15px;">
              <div id="right-video-cover">
                <!-- TODO: -->
                <video @loadedmetadata="setInitialTime" id="diffVideo" :style="videoStyles" :class="video - style"
                  class="video-style" ref="diffVideo" controlsList="nodownload" key="diffVideo" :src="diffVideo()"
                  @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart" @mouseup="handleDragEnd"
                  @mousemove="handleDragging" preload="auto">
                </video>
                <!-- <video id="diffVideo" :style="videoStyles" :class="video - style" class="video-style" ref="diffVideo"
                  controlsList="nodownload" key="diffVideo" :src="tempVideo2" @wheel="handleWheel" @click="setZoomCenter"
                  @mousedown="handleDragStart" @mouseup="handleDragEnd" @mousemove="handleDragging" preload="auto">
                </video> -->
              </div>
              <div>
                <div style="margin-top: 8px; font-size: 14px;">{{
                  this.diffVideoNameList[videoNameIndex] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="scoring-button">
        <div style="margin-bottom: 0px;">
          <button class="btn-style" style="padding-bottom: 6px; padding-top: 6px;" @click="goToBegin">
            <img style="width: 30px; height: 30px;" src="../images/play_icon/iconmonstr-media-control-52-240.png">
          </button>
          <button @click="seekBackward" @mouseover="isMouseOverMinus = true" @mouseout="isMouseOverMinus = false"
            :class="{ 'btn-style': !isMouseOverMinus, 'clicked-btn-style': isMouseOverMinus }"
            style="margin-right: 4px; padding-bottom: 6px; padding-top: 6px;">
            <img class="icon-style" src="../images/play_icon/iconmonstr-media-control-18-240.png" alt="-1 frame">
          </button>
          <button id="videoButton" key="videoButton" @click="changeVideoButton(); changeImgSource()"
            @mouseover="isMouseOverPlay = true" @mouseout="isMouseOverPlay = false"
            :class="{ 'btn-style': !isMouseOverPlay, 'clicked-btn-style': isMouseOverPlay }"
            style="padding-bottom: 6px; padding-top: 6px;">
            <img class="icon-style" :src=imgSrc>
          </button>
          <button @click="seekForward" @mouseover="isMouseOverPlus = true" @mouseout="isMouseOverPlus = false"
            :class="{ 'btn-style': !isMouseOverPlus, 'clicked-btn-style': isMouseOverPlus }"
            style="margin-left: 4px; padding-bottom: 6px; padding-top: 6px;s">
            <img class="icon-style" src="../images/play_icon/iconmonstr-media-control-13-240.png" alt="+1 frame">
          </button>
          <button class="btn-style" @click="goToEnd" style="padding-bottom: 6px; padding-top: 6px;">
            <img class="icon-style" src="../images/play_icon/iconmonstr-media-control-53-240.png">
          </button>
        </div>
        <div style="display: flex; margin-left: auto; margin-right: auto; margin-bottom: 10px;">
          <div style="margin-left: auto; margin-right: auto; display: flex;">
            <button v-on="click" class="btn-style"
              style="font-size: x-large; width: 80px; height: 40px; padding-top: 0px;"
              @click="[changeBackVideo()]">prev</button>
            <button v-on="click"
              :class="{ 'clicked-btn-style': this.isVideoFrameSelected(), 'btn-style': !this.isVideoFrameSelected() }"
              style="font-size: x-large; width: 100px; height: 40px; padding-top: 0px;"
              @click="addVideoFrame()">check</button>
            <button v-on="click" class="btn-style"
              style="font-size: x-large; width: 80px; height: 40px; padding-top: 0px;"
              @click="[changeNextVideo()]">next</button>
            <button class="btn-style" v-on="clickVideoFrameExport()">EXPORT</button>
          </div>
          <!-- <div>{{ this.selectedVideoTimeList }}</div> -->
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
  name: 'frameSelectionPage',
  data() {
    return {
      // testcode: this.$route.params.testcode,
      testcode: history.state.testcode,
      isVideoPlaying: false,
      baseUrl: process.env.BASE_URL + "api/",
      leftVideoUrl: "",
      rightVideoUrl: "",
      isMouseOverMinus: false,
      isMouseOverPlus: false,
      isMouseOverPlay: false,
      videoIndexString: "",
      videoIndex: [],
      zoom: 1,
      minZoom: 1,
      videoStyles: {},
      zoomCenterX: 50,
      zoomCenterY: 50,
      // video url list
      videoList: [],
      originalVideoNameList: [],
      artifactVideoNameList: [],
      diffVideoNameList: [],
      videoNameIndex: 0,
      videoFrameList: [],
      // originalVideoFrameList: [],
      // artifactVideoFrameList: [],
      dragging: false,
      dragStartX: 0,
      dragStartY: 0,
      offsetX: 0,
      offsetY: 0,
      totalLength: 0,
      imgSrc: require("../images/play_icon/iconmonstr-media-control-48-240.png"),
      isToggled: false,
      videoOriginalWidth: 0,
      videoCurrentTime: 0.00,
      videoDuration: 0.00,
      // tempVideo: require("./1.mp4"),
      // tempVideo2: require("./1.mp4"),
      selectedVideoTime: 0.00,
      selectedVideoTimeList: [],
      selectedVideoFrameList: [],
      currentPage: 1,
      totalFrameLength: 0,
      currentFrame: 0,
      halfVideoFrameRate: 0.015,
      T: 0.03,
    }
  },
  created() {
    console.log("testcode: " + history.state.testcode);
    // console.log($route.params.name);
  },
  mounted() {
    this.addEventVideoPlay();
    document.addEventListener('mousemove', this.handleDragging);
    document.addEventListener('mouseup', this.handleDragEnd);
    window.addEventListener("keydown", this.keydown);
    this.getVideoIndex();
    // this.changeVideoButton();
    // this.isVideoPaused();

    this.addEventVideoCurrentTime();
    this.getSelectedFrameList();
    // this.setHalfVideoFrame();
    this.isVideoFrameSelected();
  },
  computed: {
    currentPageIndex() {
      return parseInt(this.videoNameIndex) + 1;
    },
  },
  methods: {
    clickVideoFrameExport() {
      axios
        .get(this.baseUrl + 'admin/exportVideoFrame')
        .then((response) => {
          console.log("response.data: " + response.data);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'video_frame_data.csv'); // 다운로드될 파일 이름
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.log(error);
        })
    },
    setT() {
      this.T = 1 / this.videoFrameList[this.videoNameIndex];
      this.halfVideoFrameRate = this.T / 2;
      console.log("[setT] T: ", this.T);
      console.log("[setT] halfVideoFrameRate: ", this.halfVideoFrameRate);
    },
    setInitialTime() {
      const video1 = this.$refs.videoNoartifact;
      const video2 = this.$refs.videoYesartifact;
      const video3 = this.$refs.diffVideo;

      // 비디오의 currentTime을 halfVideoFrameRate 값으로 설정
      video1.currentTime = this.halfVideoFrameRate;
      video2.currentTime = this.halfVideoFrameRate;
      video3.currentTime = this.halfVideoFrameRate;
    },
    isVideoFrameSelected() {
      const temp = String(this.currentFrame);
      if (this.selectedVideoFrameList.includes(temp)) {
        return true;
      } else {
        return false;
      }
    },
    async getSelectedFrameList() {
      axios
        .get(this.baseUrl + "admin/getSelectedFrameList", {
          params: {
            video_index: this.currentPage
          }
        })
        .then((response) => {
          if (response.data.selected_video_frame_time_list != null) {
            this.selectedVideoTimeList = response.data.selected_video_frame_time_list;
          } else if (response.data.selected_video_frame_time_list == null) {
            this.selectedVideoTimeList = [];
          }
          if (response.data.selected_video_frame_list != null) {
            this.selectedVideoFrameList = response.data.selected_video_frame_list;
          } else if (response.data.selected_video_frame_list == null) {
            this.selectedVideoFrameList = [];
          }
          console.log("[getSelectedFrameList] response data: ", response.data)
          console.log("[getSelectedFrameList] response: ", response.data.selected_video_frame_time_list)
          console.log("[getSelectedFrameList] response: ", response.data.selected_video_frame_list)
          console.log("[getSelectedFrameList]  : ", this.selectedVideoTimeList);
          console.log("[getSelectedFrameList]  : ", this.selectedVideoFrameList);
          // this.setHalfVideoFrame();
        })
    },
    addVideoFrame() {
      // 지금 선택된 video frame이 selectedVideoTimeList에 없으면 추가
      // const videoTime = String(Math.round(this.videoCurrentTime * 100) / 100)
      const videoFrame = String(this.currentFrame)
      var video = document.getElementById('videoNoartifact');
      const t = String(Math.round(((~~(video.currentTime / parseFloat(this.T)) * this.T) + this.halfVideoFrameRate) * 1000) / 1000);
      console.log("[addVideoFrame] t: ", t);

      if (!this.selectedVideoFrameList.includes(videoFrame)) {
        this.selectedVideoTimeList.push(t);
        this.selectedVideoFrameList.push(videoFrame);
        console.log("[addVideoFrame] selectedVideoTimeList: ", this.selectedVideoTimeList)
        console.log("[addVideoFrame] selectedVideoFrameList: ", this.selectedVideoFrameList)
        console.log("[addVideoFrame] currentFrame: ", this.currentFrame)
      } else {
        // video frame이 이미 선택되있는 상태에서 클릭하면 video frame을 제거
        this.selectedVideoTimeList.splice(this.selectedVideoTimeList.indexOf(t), 1);
        this.selectedVideoFrameList.splice(this.selectedVideoFrameList.indexOf(videoFrame), 1);
        console.log("[addVideoFrame] selectedVideoTimeList: ", this.selectedVideoTimeList)
        console.log("[addVideoFrame] selectedVideoFrameList: ", this.selectedVideoFrameList)
        console.log("[addVideoFrame] currentFrame: ", this.currentFrame)
      }
      this.isVideoFrameSelected();
    },
    addEventVideoCurrentTime() {
      var video = document.getElementById('videoNoartifact');
      video.addEventListener("loadeddata", (event) => {
        console.log(event.target.currentTime);
        this.videoCurrentTime = event.target.currentTime;
        this.videoDuration = event.target.duration.toFixed(3);
        // const currentVideoFrameRate = (1 / this.videoFrameList[this.videoNameIndex])
        this.totalFrameLength = (Math.round(this.videoDuration / this.T));
        this.currentFrame = ~~((this.videoCurrentTime) / this.T)
      });
      video.addEventListener("timeupdate", (event) => {
        this.videoCurrentTime = event.target.currentTime
        // const currentVideoFrameRate = (1 / this.videoFrameList[this.videoNameIndex])
        this.totalFrameLength = (Math.round(this.videoDuration / this.T));
        this.currentFrame = ~~((this.videoCurrentTime) / this.T)
      })
      // this.videoCurrentTime = video1.currentTime;
      // this.currentTime = video1.currentTime;
      // this.videoDuration = video1.duration;
    },
    getVideoIndex() {
      axios
        .get(this.baseUrl + "admin/getVideoIndex", {
          params: {
            testcode: this.testcode
          }
        })
        .then((response) => {
          this.videoIndex = response.data.video_list;
          this.currentPage = this.videoIndex[this.videoNameIndex];
          console.log("[getVideoIndex] videoIndex: ", this.videoIndex);
          this.originalVideoNameList = response.data.original_video_list;
          this.artifactVideoNameList = response.data.artifact_video_list;
          this.diffVideoNameList = response.data.diff_video_list;
          this.videoFrameList = response.data.video_frame_list;
          // this.setHalfVideoFrame();
          this.setT();
        })
        .catch((error) => {
          console.log(error);
        })
      console.log("[getVideoIndex] outside videoIndex: ", this.videoIndex);
    },
    // frame을 선택하면 백엔드로 요청을 보내는 함수
    async postVideoFrameTimeList() {
      let tempCurrentVideo = parseInt(this.currentPage)
      // console.log("[postVideoFrameTimeList] selectedVideoFrameList type: " + typeof (this.selectedVideoFrameList[0]))
      console.log("[postVideoFrameTimeList] selectedVideoFrameList: " + this.selectedVideoFrameList)
      // console.log("[postVideoFrameTimeList] selectedVideoTimeList type: " + typeof (this.selectedVideoTimeList[0]))
      console.log("[postVideoFrameTimeList] selectedVideoTimeList: " + this.selectedVideoTimeList)
      console.table("[postVideoFrameTimeList] selectedVideoTimeList" + this.selectedVideoTimeList)

      await axios
        .post(this.baseUrl + "admin/postVideoFrameTime", {
          videoIndex: tempCurrentVideo,
          videoFrame: this.selectedVideoFrameList,
          selectedVideoTime: this.selectedVideoTimeList
        })
        .then((response) => {
          console.log("[postVideoFrameTimeList] response: " + response.data);
          //this.selectedVideoTimeList = [];
        })
    },
    //키보드 이벤트 함수
    keydown(e) {
      switch (e.key) {
        // case ' ':
        //     e.preventDefault();
        //     this.changeVideoButton();
        //     this.changeImgSource()
        //     var video1 = document.getElementById('videoNoartifact');
        //     if (video1.paused) {
        //         this.playVideos();
        //     } else {
        //         this.pauseVideos();
        //     }
        //     break;
        // 비디오 frmae 선택 
        // case 'Enter':
        //   e.preventDefault();
        //   break;
        case 'ArrowLeft':
          e.preventDefault();
          this.seekBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.seekForward();
          break;
        case '0':
          this.toggleButton(0);
          break;
        case '1':
          this.toggleButton(1);
          break;
        case '2':
          this.toggleButton(2);
          break;
        case '3':
          this.toggleButton(3);
          break;
        case '4':
          this.toggleButton(4);
          break;
        case '5':
          this.toggleButton(5);
          break;
      }
    },
    goToBegin() {
      var video1 = document.getElementById('videoNoartifact');
      var video2 = document.getElementById('videoYesartifact');
      var video3 = document.getElementById('diffVideo');

      video1.pause();
      video1.currentTime = this.halfVideoFrameRate;
      video2.currentTime = this.halfVideoFrameRate;
      video3.currentTime = this.halfVideoFrameRate;
      this.isVideoPlaying = false;
    },
    goToEnd() {
      var video1 = document.getElementById('videoNoartifact');
      var video2 = document.getElementById('videoYesartifact');
      var video3 = document.getElementById('diffVideo');
      const temp = +(video1.duration).toFixed(2);
      video1.currentTime = temp;
      video2.currentTime = temp;
      video3.currentTime = temp;
      this.isVideoPlaying = false;
    },
    changeImgSource() {
      if (this.isVideoPlaying == true) {
        this.imgSrc = require("../images/play_icon/iconmonstr-media-control-5-240.png")
      } else {
        this.imgSrc = require("../images/play_icon/iconmonstr-media-control-48-240.png")
      }
    },
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
      }
    },
    resetZoomAndOffset() {
      this.zoom = this.minZoom;
      this.offsetX = 0;
      this.offsetY = 0;
    },
    leftOriginalVideo() {
      return String(this.baseUrl + "postvideo/original/" + this.currentPage)
    },
    rightArtifactVideo() {
      return String(this.baseUrl + "postvideo/artifact/" + this.currentPage)
    },
    diffVideo() {
      return String(this.baseUrl + "postvideo/diff/" + this.currentPage)
    },
    changeNextVideo() {
      if (this.isVideoPlaying == true) {
        this.changeVideoButton();
      }
      this.resetZoomAndOffset();
      this.updateVideoStyle();
      var videoEelement1 = document.getElementById('videoNoartifact');
      var videoEelement2 = document.getElementById('videoYesartifact');
      videoEelement1.style.transform = "scale(1)";
      videoEelement2.style.transform = "scale(1)";

      if (this.isToggled) {
        this.toggleVideo()
      }
      // post frame time list 
      this.postVideoFrameTimeList();

      if (this.currentPage == this.videoIndex[this.videoIndex.length - 1]) {
        alert("This is the last page of this test code. Thank you!");
      } else {
        this.videoNameIndex += 1
        this.currentPage = this.videoIndex[this.videoNameIndex];
      }
      // this.selectedVideoFrameList = [];
      // this.setHalfVideoFrame();
      this.getSelectedFrameList();
      this.setT();
    },
    changeBackVideo() {
      if (this.isVideoPlaying == true) {
        this.changeVideoButton();
      }
      this.resetZoomAndOffset();
      this.updateVideoStyle();
      if (this.isToggled) {
        this.toggleVideo()
      }
      var videoEelement1 = document.getElementById('videoNoartifact');
      var videoEelement2 = document.getElementById('videoYesartifact');
      videoEelement1.style.transform = "scale(1)";
      videoEelement2.style.transform = "scale(1)";

      // post frame time list 
      this.postVideoFrameTimeList();

      if (this.currentPage == this.videoIndex[0]) {
        alert("This is the first page of this test code.");
      } else {
        this.videoNameIndex -= 1
        this.currentPage = this.videoIndex[this.videoNameIndex];
      }
      // this.selectedVideoFrameList = [];
      // this.setHalfVideoFrame();
      this.getSelectedFrameList();
      this.setT();
    },
    addEventVideoPlay() {
      var video1 = document.getElementById('videoNoartifact');
      var video2 = document.getElementById('videoYesartifact');
      var video3 = document.getElementById('diffVideo');

      var video2_currentTime = video2.currentTime;
      video1.currentTime = video2_currentTime;
      video2.currentTime = video2_currentTime;
      video3.currentTime = video2_currentTime;

      video1.addEventListener("play", () => {
        document.getElementById('videoYesartifact').play();
        document.getElementById('diffVideo').play();
      });
      video1.addEventListener("pause", () => {
        document.getElementById('videoYesartifact').pause();
        document.getElementById('diffVideo').pause();
        let T = 1 / this.videoFrameList[this.videoNameIndex]
        let temp = +(~~(video2.currentTime / T) * T).toFixed(3) + this.halfVideoFrameRate;
        video1.currentTime = temp;
        video2.currentTime = temp;
        video3.currentTime = temp;
      })
      // video1.addEventListener("ended", () => {
      //   video1.currentTime = 0;
      //   video2.currentTime = 0;
      //   video3.currentTime = 0;
      //   video1.play();
      // })
    },
    // Play/Stop 및 text 변경 버튼
    changeVideoButton() {
      var video1 = document.getElementById('videoNoartifact');
      if (this.isVideoPlaying == false) {
        video1.play();
        this.isVideoPlaying = true;
      } else {
        video1.pause();
        this.isVideoPlaying = false;
      }
      this.changeImgSource();
    },
    setHalfVideoFrame() {
      this.halfVideoFrameRate = (1 / this.videoFrameList[this.videoNameIndex]) / 2;
    },
    async seekBackward() {
      console.log("seekBackward");
      const video1 = this.$refs.videoNoartifact;
      const video2 = this.$refs.videoYesartifact;
      const video3 = this.$refs.diffVideo;

      // const videoFrame = (Math.round((1 / this.videoFrameList[this.videoNameIndex]) * 100) / 100);
      // const video1CurrentTime = (Math.round((video1.currentTime) * 100) / 100);
      // const video2CurrentTime = (Math.round((video2.currentTime) * 100) / 100);
      // const video3CurrentTime = (Math.round((video3.currentTime) * 100) / 100);
      const videoFrame = 1 / this.videoFrameList[this.videoNameIndex];
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
      const video3 = this.$refs.diffVideo;
      // const videoFrame = (Math.round((1 / this.videoFrameList[this.videoNameIndex]) * 100) / 100);
      // const video1CurrentTime = (Math.round((video1.currentTime) * 100) / 100);
      // const video2CurrentTime = (Math.round((video2.currentTime) * 100) / 100);
      // const video3CurrentTime = (Math.round((video3.currentTime) * 100) / 100);
      const videoFrame = 1 / this.videoFrameList[this.videoNameIndex];
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
  }
}
</script>

<style>
@import '../main.css';
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
</style>
