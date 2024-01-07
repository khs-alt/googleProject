<template>
    <div style="position: fixed; overflow: hidden; width: 100%; height: 100%;">
        <div class="body-style">
            <div class="menu">
                <div class="menu-header">
                    <div class="menu-content">
                        <a href="/label/" style="margin-right: 10px;">
                            <button class="signup-btn-style">Home</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="home-main-content" style="padding-bottom: 0; padding-top: 10px; margin-bottom: 8px;">
            <p style="font-size: 24px; margin-top: 10px; margin-bottom:4px">{{ this.testcode }}</p>
            <div class="video-container">
                <div class="videoPlayer">
                    <div id="video-margin" style="display: flex; max-height: 60%;">
                        <div style="margin: 15px;">
                            <div id="left-video-cover">
                                <div style="display: flex;">
                                    <video id="videoNoartifact" :style="videoStyles" class="video-style"
                                        ref="videoNoartifact" controlsList="nodownload" key="videoNoartifact"
                                        :src="leftOriginalVideo()" @wheel="handleWheel" @click="setZoomCenter"
                                        @mousedown="handleDragStart" @mouseup="handleDragEnd" @mousemove="handleDragging"
                                        onChange="isVideoPaused" preload="auto">
                                    </video>
                                </div>
                            </div>
                            <div>
                                <div style="margin-top: 8px; font-size: 14px; ">{{
                                    this.originalVideoNameList[videoNameIndex] }}
                                </div>
                            </div>
                        </div>
                        <div style="margin: 15px;">
                            <div id="right-video-cover">
                                <video id="videoYesartifact" :style="videoStyles" :class="video - style" class="video-style"
                                    ref="videoYesartifact" controlsList="nodownload" key="videoYesartifact"
                                    :src="rightArtifactVideo()" @wheel="handleWheel" @click="setZoomCenter"
                                    @mousedown="handleDragStart" @mouseup="handleDragEnd" @mousemove="handleDragging"
                                    onChange="isVideoPaused" preload="auto">
                                </video>
                            </div>
                            <div>
                                <div style="margin-top: 8px; font-size: 14px;">{{
                                    this.artifactVideoNameList[videoNameIndex] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="scoring-button">
                <div style="margin-bottom: 0px;">
                    <button class="btn-style" style="padding-bottom: 6px; padding-top: 6px;" @click="goToBegin">
                        <img style="width: 30px; height: 30px;"
                            src="../images/play_icon/iconmonstr-media-control-52-240.png">
                    </button>
                    <button @click="seekBackward" @mouseover="isMouseOverMinus = true" @mouseout="isMouseOverMinus = false"
                        :class="{ 'btn-style': !isMouseOverMinus, 'clicked-btn-style': isMouseOverMinus }"
                        style="margin-right: 4px; padding-bottom: 6px; padding-top: 6px;">
                        <img class="icon-style" src="../images/play_icon/iconmonstr-media-control-18-240.png"
                            alt="-1 frame">
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
                        <img class="icon-style" src="../images/play_icon/iconmonstr-media-control-13-240.png"
                            alt="+1 frame">
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
                        <button v-on="click" class="btn-style"
                            style="font-size: x-large; width: 100px; height: 40px; padding-top: 0px;"
                            @click="[selectArtifactFrame()]">check</button>
                        <button v-on="click" class="btn-style"
                            style="font-size: x-large; width: 80px; height: 40px; padding-top: 0px;"
                            @click="[changeNextVideo()]">next</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>Copyright © 2023 Pi:Lab, SMU. All rights reserved.</p>
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
            videoButtonText: "Stop",
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
            // tempVideo: require("./original.mp4"),
            // tempVideo2: require("./denoise.mp4"),
            selectedVideoTime: 0.00,
        }
    },
    created() {
        console.log("testcode: " + history.state.testcode);
        // console.log($route.params.name);
    },
    mounted() {
        this.getVideoIndex();
        this.changeVideoButton();
        this.addEventVideoPlay();
        this.isVideoPaused();
        document.addEventListener('mousemove', this.handleDragging);
        document.addEventListener('mouseup', this.handleDragEnd);
        window.addEventListener("keydown", this.keydown);
    },
    setup() {
        // console.log("setup")
    },
    computed: {
        // TODO: 주석 풀기 
        currentPageIndex() {
            return parseInt(this.videoNameIndex) + 1;
        },
    },
    methods: {
        getVideoIndex() {
            axios
                .get(this.baseUrl + "admin/getVideoIndex", {
                    testcode: this.testcode
                })
                .then((response) => {
                    this.videoIndex = response.videoIndex,
                        this.originalVideoNameList = response.originalVideoNameList,
                        this.artifactVideoNameList = response.artifactVideoNameList,
                        this.videoFrameList = response.videoFrameList
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        // frame을 선택하면 백엔드로 요청을 보내는 함수
        async selectArtifactFrame() {
            var video = document.getElementById("videoNoartifact");
            this.selectedVideoTime = video.currentTime;
            axios
                .post(this.baseUrl + "admin/selectArtifactFrame", {
                    videoIndex: this.videoIndex,
                    selectedVideoTime: this.selectedVideoTime
                })
                .then((response) => {
                    console.log(response);
                })
        },
        async getVideoHeight() {
            var video1 = document.getElementById('videoNoartifact');
            const temp = video1.style.height;
            var video1Height = document.getElementById('left-video-cover');
            var video2Height = document.getElementById('right-video-cover');
            var video3Height = document.getElementById('toggleVideo');
            video1Height.style.height = temp;
            video2Height.style.height = temp;
            video3Height.style.height = temp;
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
                case 'Enter':
                    e.preventDefault();
                    this.selectArtifactFrame();
                    break;
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
            video1.pause();
            video2.pause();
            video1.currentTime = 0;
            video2.currentTime = 0;
        },
        goToEnd() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            const originalFrame = this.originalVideoFrameList[this.videoNameIndex];
            const temp = video1.duration - (1 / originalFrame) * 2;
            video1.currentTime = temp;
            video2.currentTime = temp;
        },
        changeImgSource() {
            if (this.videoButtonText != "Play") {
                this.imgSrc = require("../images/play_icon/iconmonstr-media-control-5-240.png")
            } else {
                this.imgSrc = require("../images/play_icon/iconmonstr-media-control-48-240.png")
            }
        },
        isVideoPaused() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            // 비디오가 end 되면 실행
            const pauseAndPlayVideo = () => {
                // this.videoButtonText = "Play";
                if (video1.currentTime < video2.currentTime) {
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    this.changeImgSource();
                } else {
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    this.changeImgSource();
                }
            };
            video1.addEventListener("ended", pauseAndPlayVideo());
            video2.addEventListener("ended", pauseAndPlayVideo());
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
            // console.log("leftOriginalVideo: " + this.baseUrl + "postvideo/original/" + this.currentPage)
            return String(this.baseUrl + "postvideo/original/" + this.currentPage)
        },
        rightArtifactVideo() {
            // console.log("rightArtifactVideo: " + this.baseUrl + "postvideo/artifact/" + this.currentPage)
            return String(this.baseUrl + "postvideo/artifact/" + this.currentPage)
        },
        changeNextVideo() {
            if (this.videoButtonText == 'Stop') {
                this.changeVideoButton();
            }
            this.userScoring = this.clickedButton
            console.log("user scoring: ", this.userScoring)
            this.resetZoomAndOffset();
            this.updateVideoStyle();
            var videoEelement1 = document.getElementById('videoNoartifact');
            var videoEelement2 = document.getElementById('videoYesartifact');
            videoEelement1.style.transform = "scale(1)";
            videoEelement2.style.transform = "scale(1)";

            if (this.isToggled) {
                this.toggleVideo()
            }

            if (this.currentPage == this.videoIndex[this.videoIndex.length - 1]) {
                // this.getVideoIndexCurrentPage();
                alert("This is the last page of this test code. Thank you!");
                this.$router.push({
                    path: '/label/scoring',
                    query: {
                        currentPage: this.currentPage,
                        userName: this.currentUser,
                        testcode: this.testcode,
                    }
                })
                this.getVideoIndexCurrentPage();
                return;
            } else {
                // this.getVideoIndexCurrentPage();
                this.videoNameIndex += 1
                this.currentPage = this.videoIndex[this.videoNameIndex];
                this.isPressed = [false, false, false, false, false, false]
                this.$router.push({
                    path: '/label/scoring',
                    query: {
                        currentPage: this.currentPage,
                        userName: this.currentUser,
                        testcode: this.testcode,
                    }
                })
                this.getVideoIndexCurrentPage();
            }
        },
        changeBackVideo() {
            if (this.videoButtonText == 'Stop') {
                this.changeVideoButton();
            }
            this.userScoring = this.clickedButton
            console.log("user scoring: ", this.userScoring)
            this.resetZoomAndOffset();
            this.updateVideoStyle();
            if (this.isToggled) {
                this.toggleVideo()
            }
            var videoEelement1 = document.getElementById('videoNoartifact');
            var videoEelement2 = document.getElementById('videoYesartifact');
            videoEelement1.style.transform = "scale(1)";
            videoEelement2.style.transform = "scale(1)";
            if (this.currentPage == this.videoIndex[0]) {
                alert("This is the first page of this test code.");
                this.$router.push({
                    path: '/label/scoring',
                    query: {
                        currentPage: parseInt(this.currentPage),
                        userName: this.currentUser,
                        testcode: this.testcode,
                    }
                })
                this.getVideoIndexCurrentPage();
                return;
            } else {
                this.videoNameIndex -= 1
                this.currentPage = this.videoIndex[this.videoNameIndex];
                this.isPressed = [false, false, false, false, false, false]
                this.$router.push({
                    path: '/label/scoring',
                    query: {
                        currentPage: this.currentPage,
                        userName: this.currentUser,
                        testcode: this.testcode,
                    }
                })
                this.getVideoIndexCurrentPage();
            }
        },
        // score button 눌렸는지 안눌렸는지 확인하는 method
        toggleButton(index) {
            this.isPressed = [false, false, false, false, false, false]
            this.isPressed[index] = !this.isPressed[index]

            this.userScoring = index
            axios
                .post(this.baseUrl + "postdata", {
                    Title: "scoring data",
                    Score: this.userScoring,
                    CurrentUser: this.currentUser,
                    ImageId: parseInt(this.currentPage),
                    TestCode: this.testcode
                })
                .then(res => {
                    //after post we have to init data form userScoring and currentPage
                    this.userScoring = 0
                    // this.isPressed = [false, false, false, false, false, false]
                    this.resetZoomAndOffset();
                    this.updateVideoStyle();
                    console.log(res.data)
                })
                .catch(error => {
                    console.error(error);
                })
        },
        // video 2개 동시에 플레이 시키는 method
        playVideos() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            // toggleVideo는 videoYesartifact와 같은 비디오 
            const videoFrame = 1 / this.videoFrameList[this.videoNameIndex];

            if (video1 && video2) {
                if (video1.currentTime + videoFrame * 3 >= video1.duration || video2.currentTime + videoFrame * 3 >= video2.duration
                    || video1.ended || video2.ended) {
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                }
                video1.currentTime = video2.currentTime;
                video1.currentTime = video2.currentTime;
                // var temp = VideoDecoder()
                // temp.flush();
                video1.play();
            }
        },
        addEventVideoPlay() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            var video2_currentTime = video2.currentTime;
            video1.currentTime = video2_currentTime;
            video2.currentTime = video2_currentTime;

            video1.addEventListener("play", () => {
                document.getElementById('videoYesartifact').play();
            });
            video1.addEventListener("pause", () => {
                document.getElementById('videoYesartifact').pause();
                var temp = video2.currentTime;
                video1.currentTime = temp;
                video2.currentTime = temp;
            })
            video1.addEventListener("ended", () => {
                video1.currentTime = 0;
                video2.currentTime = 0;
                video1.play();
            })
        },
        // video 2개 동시에 Stop 시키는 method
        pauseVideos() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');

            if (video1 && video2) {
                var temp = video2.currentTime;
                video1.currentTime = temp;
                video1.pause();
            }
        },
        // Play/Stop 및 text 변경 버튼
        async changeVideoButton() {
            if (this.videoButtonText == "Play") {
                this.playVideos();
                this.videoButtonText = "Stop";
            } else {
                this.videoButtonText = "Play";
                this.pauseVideos();
            }
            this.changeImgSource();
        },
        async seekBackward() {
            const video1 = this.$refs.videoNoartifact;
            const video2 = this.$refs.videoYesartifact;

            // videoFrame을 하나로 통일 했음
            const videoFrame = this.videoFrameList[this.videoNameIndex];
            if (videoFrame != 0) {
                if (videoFrame) {
                    if (video1.currentTime - videoFrame <= 0 || video2.currentTime - videoFrame <= 0) {
                        return;
                    }
                    video1.currentTime -= videoFrame;
                    video2.currentTime -= videoFrame;
                }
            }
        },
        async seekForward() {
            const video1 = this.$refs.videoNoartifact;
            const video2 = this.$refs.videoYesartifact;

            // videoFrame을 하나로 통일 했음
            const videoFrame = this.videoFrameList[this.videoNameIndex];
            if (videoFrame != 0) {
                if (videoFrame) {
                    if (video1.currentTime - videoFrame * 3 >= video1.duration || video2.currentTime - videoFrame * 3 >= video1.duration) {
                        return;
                    }
                    video1.currentTime += videoFrame;
                    video2.currentTime += videoFrame;
                }
            }
        },
    },
}
</script>

<style>
@import '../main.css';
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
</style>
