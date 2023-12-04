<template>
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
        <p style="font-size: 24px; margin-top: 10px">Video Ghosting Artifact Scoring System</p>
        <div style="display: flex;">
            <div style="font-size: 20px; margin-left: auto; margin-right: 10px;">
                {{ currentPageIndex }}/{{ totalLength }}
            </div>
            <div style="margin-right: auto; margin-top: auto; margin-bottom: auto;" class="toggle-switch"
                :class="{ 'active': isToggled }" @click="toggleVideo">
                <div class="toggle-button" :style="{ left: isToggled ? '24px' : '0px' }"></div>
            </div>
        </div>
        <div>
            <div>{{ this.videoCurrentTime }} / {{ this.videoDuration }}</div>
        </div>
        <div class="video-container">
            <div class="videoPlayer">
                <div id="video-margin" style="display: flex; max-height: 60%;">
                    <div style="margin: 15px;">
                        <div id="left-video-cover"
                            style="max-width: 100%; max-height: 550px; overflow: hidden; border: solid 1px gray; width: fit-content; height: fit-content;">
                            <!-- toggle된 video -->
                            <div v-show="isToggled" style="position: relative;">
                                <div style="max-height: 550px; overflow: hidden;">
                                    <video id="toggleVideo" :style="videoStyles"
                                        style="position: absolute; max-width: 100%; max-height: 550px;" ref="toggleVideo"
                                        controlsList="nodownload" key="videoDiff" :src="rightArtifactVideo()"
                                        @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart"
                                        @mouseup="handleDragEnd" @mousemove="handleDragging" onChange="isVideoPaused"
                                        preload="auto">
                                    </video>
                                </div>
                            </div>
                            <div>
                                <video id="videoNoartifact" :style="videoStyles" style="max-height: 550px; max-width: 100%;"
                                    ref="videoNoartifact" controlsList="nodownload" key="videoNoartifact"
                                    :src="leftOriginalVideo()" @wheel="handleWheel" @click="setZoomCenter"
                                    @mousedown="handleDragStart" @mouseup="handleDragEnd" @mousemove="handleDragging"
                                    onChange="isVideoPaused" preload="auto">
                                </video>
                            </div>
                        </div>
                        <div>
                            <div style="margin-top: 8px; font-size: 14px; ">{{ this.originalVideoNameList[videoNameIndex] }}
                            </div>
                        </div>
                    </div>
                    <div style="margin: 15px;">
                        <div id="right-video-cover"
                            style="max-width: 100%; max-height: 550px; overflow: hidden; border: solid 1px gray; width: fit-content; height: fit-content;">
                            <video id="videoYesartifact" :style="videoStyles" style="max-height: 550px; max-width: 100%;"
                                ref="videoYesartifact" controlsList="nodownload" key="videoYesartifact"
                                :src="rightArtifactVideo()" @wheel="handleWheel" @click="setZoomCenter"
                                @mousedown="handleDragStart" @mouseup="handleDragEnd" @mousemove="handleDragging"
                                onChange="isVideoPaused" preload="auto">
                            </video>
                        </div>
                        <div>
                            <div style="margin-top: 8px; font-size: 14px;">{{ this.artifactVideoNameList[videoNameIndex] }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="scoring-button" style="margin-left: 50px; margin-right: 50px; max-width: 100%; margin-top: 0px;">
            <div style="margin-bottom: 5px;">
                <button class="btn-style" @click="goToBegin">
                    <img style="width: 30px; height: 30px;" src="../images/play_icon/iconmonstr-media-control-52-240.png">
                </button>
                <button @click="seekBackward" @mouseover="isMouseOverMinus = true" @mouseout="isMouseOverMinus = false"
                    :class="{ 'btn-style': !isMouseOverMinus, 'clicked-btn-style': isMouseOverMinus }"
                    style="margin-right: 2%;">
                    <img style="width: 30px; height: 30px;" src="../images/play_icon/iconmonstr-media-control-18-240.png"
                        alt="-1 frame">
                </button>
                <button id="videoButton" key="videoButton" @click="changeVideoButton(); changeImgSource()"
                    @mouseover="isMouseOverPlay = true" @mouseout="isMouseOverPlay = false"
                    :class="{ 'btn-style': !isMouseOverPlay, 'clicked-btn-style': isMouseOverPlay }">
                    <img style="width: 30px; height: 30px;" :src=imgSrc>
                </button>
                <button @click="seekForward" @mouseover="isMouseOverPlus = true" @mouseout="isMouseOverPlus = false"
                    :class="{ 'btn-style': !isMouseOverPlus, 'clicked-btn-style': isMouseOverPlus }"
                    style="margin-left: 2%;">
                    <img style="width: 30px; height: 30px;" src="../images/play_icon/iconmonstr-media-control-13-240.png"
                        alt="+1 frame">
                </button>
                <button class="btn-style" @click="goToEnd">
                    <img style="width: 30px; height: 30px;" src="../images/play_icon/iconmonstr-media-control-53-240.png">
                </button>
            </div>
            <div style="display: flex; margin-left: auto; margin-right: auto;">
                <div style="margin-left: auto; margin-right: auto; display: flex;">
                    <button v-on="click" class="btn-style"
                        style="font-size: x-large; width: 80px; height: 40px; padding-top: 0px;"
                        @click="[changeBackVideo(), preloadNextVideo()]">prev</button>
                    <button v-for="a in 6" ref="score" :key="a - 1" v-on:click="clickedButton = a - 1"
                        style="width: 50px; height: 40px; font-size:x-large; padding-top: 1px;"
                        :class="{ 'clicked-btn-style': isPressed[a - 1], 'btn-style': !isPressed[a - 1] }"
                        @click="toggleButton(a - 1)">{{ a - 1 }}</button>
                    <button v-on="click" class="btn-style"
                        style="font-size: x-large; width: 80px; height: 40px; padding-top: 0px;"
                        @click="[changeNextVideo(), preloadNextVideo()]">next</button>
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
import axios from 'axios'
export default {
    name: 'scoringPage',
    data() {
        return {
            clickedButton: -1,
            noScore: false,
            userScoring: 0,
            scoreNum: [0, 1, 2, 3, 4, 5],
            isPressed: [false, false, false, false, false, false],
            isClicked: false,
            menuBar: ['Home'],
            currentPage: parseInt(this.$route.query.currentPage),
            currentUser: this.$route.query.userName,
            testCode: this.$route.query.testcode,
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
            originalVideoFrameList: [],
            artifactVideoFrameList: [],
            dragging: false,
            dragStartX: 0,
            dragStartY: 0,
            offsetX: 0,
            offsetY: 0,
            totalLength: 0,
            imgSrc: require("../images/play_icon/iconmonstr-media-control-48-240.png"),
            isToggled: false,
            videoOriginalWidth: 0,
            preloadedNextOriginalVideo: "",
            preloadedNextArtifactVideo: "",
            preloadedPrevOriginalVideo: "",
            preloadedPrevArtifactVideo: "",
            videoCurrentTime: 0,
            videoDuration: 0,
        }
    },
    created() { },
    mounted() {
        this.changeVideoButton();
        this.getVideoIndexCurrentPage();
        this.addEventVideoPlay();
        this.isVideoPaused();
        // this.getVideoCurrentTime();
        document.addEventListener('mousemove', this.handleDragging);
        document.addEventListener('mouseup', this.handleDragEnd);
        window.addEventListener("keydown", this.keydown);
        this.addEventVideoCurrentTime();
        // this.preloadNextVideo();
    },
    computed: {
        // currentPageIndex() {
        //     return parseInt(this.videoNameIndex) + 1;
        // },
    },
    methods: {
        async addEventVideoCurrentTime() {
            var video = document.getElementById('videoNoartifact');
            video.addEventListener("timeupdate", (event) => {
                console.log("The currentTime attribute has been updated. Again.");
                console.log(event.target.currentTime);
                this.videoCurrentTime = event.target.currentTime;
                this.videoDuration = event.target.duration;
            });
            // this.videoCurrentTime = video1.currentTime;
            // this.currentTime = video1.currentTime;
            // this.videoDuration = video1.duration;
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

            console.log("video1Height: " + video1Height);
            console.log("video2Height: " + video2Height);
            console.log("video3Height: " + video3Height);
        },
        //키보드 이벤트 함수
        keydown(e) {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.changeBackVideo();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.changeNextVideo();
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
        async preloadNextVideo() {
            this.preloadedNextOriginalVideo = document.createElement('video');
            this.preloadedNextArtifactVideo = document.createElement('video');
            this.preloadedPrevOriginalVideo = document.createElement('video');
            this.preloadedPrevArtifactVideo = document.createElement('video');

            if (this.videoIndex[0] == this.currentPage) {
                this.preloadedNextOriginalVideo.src = String(this.baseUrl + "/postvideo/original/" + (this.currentPage));
                this.preloadedNextArtifactVideo.src = String(this.baseUrl + "/postvideo/artifact/" + (this.currentPage));
            }
            else if (this.videoIndex[this.videoIndex.length - 1] == this.currentPage) {
                this.preloadedNextOriginalVideo.src = String(this.baseUrl + "/postvideo/original/" + (this.currentPage));
                this.preloadedNextArtifactVideo.src = String(this.baseUrl + "/postvideo/artifact/" + (this.currentPage));
            } else {
                for (let i = 0; i < this.videoIndex.length; i++) {
                    if (this.videoIndex[i] == this.currentPage) {
                        this.preloadedNextOriginalVideo.src = String(this.baseUrl + "/postvideo/original/" + (this.videoIndex[i + 1]));
                        this.preloadedNextArtifactVideo.src = String(this.baseUrl + "/postvideo/artifact/" + (this.videoIndex[i + 1]));
                        this.preloadedPrevOriginalVideo.src = String(this.baseUrl + "/postvideo/original/" + (this.videoIndex[i - 1]));
                        this.preloadedPrevArtifactVideo.src = String(this.baseUrl + "/postvideo/artifact/" + (this.videoIndex[i - 1]));
                        console.log("preloadedNextArtifactVideo: " + this.preloadedNextArtifactVideo.src)
                        console.log("preloadedNextOriginalVideo: " + this.preloadedNextOriginalVideo.src)
                        console.log("preloadedPrevOriginalVideo: " + this.preloadedPrevOriginalVideo.src)
                        console.log("preloadedPrevArtifactVideo: " + this.preloadedPrevArtifactVideo.src)
                        break;
                    }
                }
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
            var originalVideoHeader = document.getElementById('videoNoartifact');
            var originalVideoStyle = window.getComputedStyle(originalVideoHeader);
            const leftMargin = originalVideoStyle.getPropertyValue('margin-left');
            if (this.isToggled) {
                // originalVideo의 위치와 크기를 가져옵니다.
                const rect = originalVideo.getBoundingClientRect();
                // toggleVideo를 originalVideo 위치 위로 배치합니다.
                toggleVideo.style.left = leftMargin;
                toggleVideo.style.width = rect.width + 'px';
                toggleVideo.style.height = rect.height + 'px';
                toggleVideo.style.zIndex = 10; // toggleVideo를 위로
                console.log("rect.width: " + rect.width)
                console.log("rect.height: " + rect.height)
                console.log("toggleVideo.style.width: " + toggleVideo.style.width)
                console.log("toggleVideo.style.height: " + toggleVideo.style.height)
            } else {
                // isToggled가 false일 때, toggleVideo를 원래 상태로 되돌립니다.
                toggleVideo.style.zIndex = 0;
            }
        },
        clickExport() {
            axios
                .post(this.baseUrl + 'getCSVFile', {
                    testcode: this.clickedTestcodeBtn
                })
                .then((response) => {
                    console.log(response.data);
                    alert("Exported testcode: " + this.clickedTestcodeBtn);
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        goToBegin() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            var video3 = document.getElementById('toggleVideo');
            // video1.pause();
            // video2.pause();
            video1.currentTime = 0;
            video2.currentTime = 0;
            video3.currentTime = 0;
            console.log("goToBegin");
            console.log("video1: " + video1.currentTime);
            console.log("video2: " + video2.currentTime);
            console.log("video3: " + video3.currentTime);
        },
        goToEnd() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            var video3 = document.getElementById('toggleVideo');
            const originalFrame = this.originalVideoFrameList[this.videoNameIndex];
            const temp = video1.duration - (1 / originalFrame) * 3;
            // video1.pause();
            // video2.pause();
            video1.currentTime = temp;
            video2.currentTime = temp;
            video3.currentTime = temp;
            console.log("goToEnd");
            console.log("video1: " + video1.currentTime);
            console.log("video2: " + video2.currentTime);
            console.log("video3: " + video3.currentTime);
        },
        changeImgSource() {
            if (this.videoButtonText != "Play") {
                this.imgSrc = require("../images/play_icon/iconmonstr-media-control-5-240.png")
            } else {
                this.imgSrc = require("../images/play_icon/iconmonstr-media-control-48-240.png")
            }
        },
        async isVideoPaused() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            var toggleVideo = document.getElementById('toggleVideo');
            video1.addEventListener("ended", () => {
                this.videoButtonText = "Play";
                if (video1.currentTime < video2.currentTime) {
                    video1.pause();
                    video2.pause();
                    toggleVideo.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    toggleVideo.currentTime = 0;
                    this.changeImgSource();
                } else {
                    video1.pause();
                    video2.pause();
                    toggleVideo.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    toggleVideo.currentTime = 0;
                    this.changeImgSource();
                }
            });
            video2.addEventListener("ended", () => {
                this.videoButtonText = "Play";
                if (video1.currentTime < video2.currentTime) {
                    video1.pause();
                    video2.pause();
                    toggleVideo.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    toggleVideo.currentTime = 0;
                    this.changeImgSource();
                } else {
                    video1.pause();
                    video2.pause();
                    toggleVideo.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    toggleVideo.currentTime = 0;
                    this.changeImgSource();
                }
            });
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
            this.dragStartX = event.clientX - this.offsetX;
            this.dragStartY = event.clientY - this.offsetY;
        },
        handleDragging(event) {
            if (this.dragging) {
                this.offsetX = event.clientX - this.dragStartX;
                this.offsetY = event.clientY - this.dragStartY;
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
        // json 받아오는 형식
        // resData := map[string]string{
        // 	"currentPage": currentPage,
        // 	"videoList":   videoList,
        // }
        async getVideoIndexCurrentPage() {
            console.log("getVideoIndexCurrentPage")
            var temp = String(this.currentPage)
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
                    var curScore = response.data.userScore;
                    this.videoNameIndex = this.currentPage;
                    if (curScore != -1) {
                        this.isPressed[curScore] = true;
                        this.clickedButton = curScore;
                        console.log("curScore: " + curScore)
                    }
                    console.log("current page: ", this.currentPage);
                    console.log("video list: ", this.videoIndex)
                    // this.$router.push({
                    //     query: {
                    //         currentPage: this.currentPage,
                    //         userName: this.currentUser,
                    //         testcode: this.testCode,
                    //     }
                    // })
                    this.leftOriginalVideo();
                    this.rightArtifactVideo();
                })
                .catch((error) => {
                    console.log(error);
                    alert("login failed")
                    this.$router.push(process.env.BASE_URL);
                })
        },
        navigateTo(item) {
            if (item === 'Home') {
                this.$router.push('/');
            }
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
            //마지막 페이지 확인
            // axios
            //     .post(this.baseUrl + "getUserScore", {
            //         CurrentUser: this.currentUser,
            //         ImageId: parseInt(this.currentPage),
            //         TestCode: this.testCode,
            //     })
            //     .then((response) => {
            //         var curScore = response.data;
            //         if (curScore != -1) {
            //             this.isPressed[curScore] = true;
            //             this.clickedButton = curScore;
            //         } else {
            //             curScore = -1
            //             this.clickedButton = curScore;
            //             this.isPressed = [false, false, false, false, false, false]
            //         }

            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     })
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
                alert("This is the last page of this test code. Thank you!");
                this.$router.push({
                    path: '/label/scoring',
                    query: {
                        currentPage: this.currentPage,
                        userName: this.currentUser,
                        testcode: this.testCode,
                    }
                })
                return;
            } else {
                this.videoNameIndex += 1
                // for (var i = 0; i < this.videoIndex.length; i++) {
                //     if (this.videoIndex[i] == this.currentPage) {
                this.currentPage = this.videoIndex[this.videoNameIndex];
                // this.rightArtifactVideo();
                // this.leftOriginalVideo();
                // break;
                //     }
                // }
                this.isPressed = [false, false, false, false, false, false]
                this.$router.push({
                    path: '/label/scoring',
                    query: {
                        currentPage: this.currentPage,
                        userName: this.currentUser,
                        testcode: this.testCode,
                    }
                })
            }
        },
        changeBackVideo() {
            if (this.videoButtonText == 'Stop') {
                this.changeVideoButton();
            }
            this.userScoring = this.clickedButton
            console.log("user scoring: ", this.userScoring)
            //마지막 페이지 확인
            // axios
            //     .post(this.baseUrl + "getUserScore", {
            //         CurrentUser: this.currentUser,
            //         ImageId: parseInt(this.currentPage),
            //         TestCode: this.testCode,
            //     })
            //     .then((response) => {
            //         var curScore = response.data;
            //         if (curScore != -1) {
            //             this.isPressed[curScore] = true;
            //             this.clickedButton = curScore;
            //         } else {
            //             curScore = -1
            //             this.clickedButton = curScore;
            //             this.isPressed = [false, false, false, false, false, false]
            //         }
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     })
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
                        testcode: this.testCode,
                    }
                })
                return;
            } else {
                this.videoNameIndex -= 1
                // for (var i = 0; i < this.videoIndex.length; i++) {
                //     if (this.videoIndex[i] == this.currentPage) {
                this.currentPage = this.videoIndex[this.videoNameIndex];
                // this.rightArtifactVideo();
                // this.leftOriginalVideo();
                // break;
                //     }
                // }
                this.isPressed = [false, false, false, false, false, false]
                this.$router.push({
                    path: '/label/scoring',
                    query: {
                        currentPage: this.currentPage,
                        userName: this.currentUser,
                        testcode: this.testCode,
                    }
                })
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
                    TestCode: this.testCode
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
        async playVideos() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            // toggleVideo는 videoYesartifact와 같은 비디오 
            var toggleVideo = document.getElementById('toggleVideo');
            const originalFrame = 1 / this.originalVideoFrameList[this.videoNameIndex];
            const artifactFrame = 1 / this.artifactVideoFrameList[this.videoNameIndex];

            if (video1 && video2 && toggleVideo) {
                if (video1.currentTime + originalFrame * 3 >= video1.currentTime || video2.currentTime + artifactFrame * 3 >= video2.currentTime
                    || toggleVideo.currentTime + artifactFrame * 3 >= toggleVideo.currentTime || video1.ended || video2.ended || toggleVideo.ended) {
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    toggleVideo.currentTime = 0;
                }
                video1.currentTime = video2.currentTime;
                video1.currentTime = video2.currentTime;
                toggleVideo.currentTime = video2.currentTime;
                toggleVideo.currentTime = video2.currentTime;
                video1.play();
            }
        },
        addEventVideoPlay() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            var toggleVideo = document.getElementById('toggleVideo');
            var video2_currentTime = video2.currentTime;
            video1.currentTime = video2_currentTime;
            toggleVideo.currentTime = video2_currentTime;
            video2.currentTime = video2_currentTime;
            video1.addEventListener("play", function () {
                document.getElementById('videoYesartifact').play();
                document.getElementById('toggleVideo').play();
                console.log("play");
                console.log("video1: " + video1.currentTime);
                console.log("video2: " + video2.currentTime);
                console.log("toggle: " + toggleVideo.currentTime);
                console.log("==========================");
            });
            video1.addEventListener("pause", function () {
                document.getElementById('videoYesartifact').pause();
                document.getElementById('toggleVideo').pause();
                var temp = video2.currentTime;
                video1.currentTime = temp;
                toggleVideo.currentTime = temp;
                video2.currentTime = temp;
                console.log("stop");
                console.log("video1: " + video1.currentTime);
                console.log("video2: " + video2.currentTime);
                console.log("toggle: " + toggleVideo.currentTime);
                console.log("==========================");
            })
        },
        // video 2개 동시에 Stop 시키는 method
        async pauseVideos() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            var toggleVideo = document.getElementById('toggleVideo');

            if (video1 && video2 && toggleVideo) {
                var temp = video2.currentTime;
                video1.currentTime = temp;
                toggleVideo.currentTime = temp;
                await video1.pause();
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
            const video3 = document.getElementById('toggleVideo');
            const originalFrame = 1 / this.originalVideoFrameList[this.videoNameIndex];
            const artifactFrame = 1 / this.artifactVideoFrameList[this.videoNameIndex];
            console.log("originalFrame: " + originalFrame)
            console.log("artifactFrame: " + artifactFrame)

            if (originalFrame != 0 && artifactFrame != 0) {
                // const halfOriginalFrame = (originalFrame) / 2;
                // const halfArtifactFrame = (artifactFrame) / 2;
                if (video1 && video2) {
                    if (video1.currentTime - originalFrame <= 0 || video2.currentTime - artifactFrame <= 0 || video3.currentTime <= 0) {
                        return;
                    }
                    video1.currentTime -= originalFrame;
                    video2.currentTime -= artifactFrame;
                    video3.currentTime -= artifactFrame;
                }
                console.log("seekForward")
                console.log("video1: " + video1.currentTime);
                console.log("video2: " + video2.currentTime);
                console.log("video3: " + video3.currentTime);
            }
        },
        async seekForward() {
            const video1 = this.$refs.videoNoartifact;
            const video2 = this.$refs.videoYesartifact;
            const video3 = document.getElementById('toggleVideo');
            const originalFrame = 1 / this.originalVideoFrameList[this.videoNameIndex];
            const artifactFrame = 1 / this.artifactVideoFrameList[this.videoNameIndex];
            console.log("originalFrame: " + originalFrame)
            console.log("artifactFrame: " + artifactFrame)

            if (originalFrame != 0 && artifactFrame != 0) {
                const halfOriginalFrame = (originalFrame) / 2;
                const halfArtifactFrame = (artifactFrame) / 2;
                if (video1 && video2) {
                    if (video1.currentTime == 0 || video2.currentTime == 0) {
                        video1.currentTime = halfOriginalFrame + originalFrame;
                        video2.currentTime = halfArtifactFrame + artifactFrame;
                        video3.currentTime = halfArtifactFrame + artifactFrame;
                    } else {
                        // 마지막 프레임을 버림
                        if (video1.currentTime + originalFrame * 3 >= video1.duration || video2.currentTime + artifactFrame * 3 >= video2.duration
                            || video3.currentTime + artifactFrame * 3 >= video3.duration || video1.ended || video2.ended || video3.ended) {
                            return;
                        }
                        video1.currentTime += originalFrame;
                        video2.currentTime += artifactFrame;
                        video3.currentTime += artifactFrame;
                    }
                    console.log("seekForward")
                    console.log("video1: " + video1.currentTime);
                    console.log("video2: " + video2.currentTime);
                    console.log("video3: " + video3.currentTime);
                }
            }
        },
    },
    watch: {
        '$route'(to, from) {
            console.log("to: " + to)
            console.log("from: " + from)
            console.log("call watch")
            this.getVideoIndexCurrentPage();
        }
    },
}
</script>

<style>
@import '../main.css';
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
</style>
