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
    <div class="home-main-content" style="padding-bottom: 0; padding-top: 10px;">
        <p style="font-size: 24px; margin-top: 10px">Video Ghosting Artifact Scoring System</p>
        <div style="position: relative;">
            <div style="margin-right: 10px;">{{ currentPageIndex }}/{{ totalLength }}</div>
            <div style="margin-left: auto; margin-right: auto;" class="toggle-switch" :class="{ 'active': isToggled }"
                @click="toggleVideo">
                <div class="toggle-button" :style="{ left: isToggled ? '24px' : '0px' }"></div>
            </div>
        </div>
        <div class="video-container">
            <div class="videoPlayer">
                <div id="video-margin" style="display: flex; max-height: 60%;">
                    <div style="margin: 15px;">
                        <div style="max-width: 100%; max-height: 550px; overflow: hidden; border: solid 1px gray;">
                            <!-- toggle된 video -->
                            <div v-show="isToggled" style="position: relative;">
                                <div style="height: 550px; overflow: hidden;">
                                    <video id="toggleVideo" :style="videoStyles"
                                        style="position: absolute; max-width: 100%; max-height: 550px;" ref="toggleVideo"
                                        controlsList="nodownload" key="videoDiff" :src="rightArtifactVideo()"
                                        @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart"
                                        @mouseup="handleDragEnd" @mousemove="handleDragging" onChange="isVideoPaused"
                                        preload="auto">
                                    </video>
                                </div>
                            </div>
                            <video id="videoNoartifact" :style="videoStyles" style="height: 550px; max-width: 100%;"
                                ref="videoNoartifact" controlsList="nodownload" key="videoNoartifact"
                                :src="leftOriginalVideo()" @wheel="handleWheel" @click="setZoomCenter"
                                @mousedown="handleDragStart" @mouseup="handleDragEnd" @mousemove="handleDragging"
                                onChange="isVideoPaused" preload="auto">
                            </video>
                        </div>
                        <div>
                            <div style="margin-top: 8px;">{{ this.originalVideoNameList[videoNameIndex] }}</div>
                        </div>
                    </div>
                    <div style="margin: 15px;">
                        <div style="max-width: 100%; max-height: 550px; overflow: hidden; border: solid 1px gray;">
                            <video id="videoYesartifact" :style="videoStyles" style="height: 550px; max-width: 100%;"
                                ref="videoYesartifact" controlsList="nodownload" key="videoYesartifact"
                                :src="rightArtifactVideo()" @wheel="handleWheel" @click="setZoomCenter"
                                @mousedown="handleDragStart" @mouseup="handleDragEnd" @mousemove="handleDragging"
                                onChange="isVideoPaused" preload="auto">
                            </video>
                        </div>
                        <div>
                            <div style="margin-top: 8px;">{{ this.artifactVideoNameList[videoNameIndex] }}</div>
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
                        style="font-size: x-large; width: 120px; height: 55px; padding-top: 9px;"
                        @click="[changeBackVideo(), preloadNextVideo()]">prev</button>
                    <button v-for="a in 6" ref="score" :key="a - 1" v-on:click="clickedButton = a - 1"
                        style="width: 80px; height: 55px; font-size:x-large; padding-top: 9px;"
                        :class="{ 'clicked-btn-style': isPressed[a - 1], 'btn-style': !isPressed[a - 1] }"
                        @click="toggleButton(a - 1)">{{ a - 1 }}</button>
                    <button v-on="click" class="btn-style"
                        style="font-size: x-large; width: 180px; height: 55px; padding-top: 6px;"
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
            currentPage: this.$route.query.currentPage,
            currentUser: this.$route.query.userName,
            testCode: this.$route.query.testcode,
            videoButtonText: "Play",
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
        }
    },
    created() { },
    mounted() {
        this.changeVideoButton();
        this.getVideoIndexCurrentPage();
        this.addEventVideoPlay();
        this.isVideoPaused();
        document.addEventListener('mousemove', this.handleDragging);
        document.addEventListener('mouseup', this.handleDragEnd);
        this.preloadNextVideo();
    },
    computed: {
        currentPageIndex() {
            return parseInt(this.videoNameIndex) + 1;
        },
    },
    methods: {
        async preloadNextVideo() {
            // this.preloadedNextOriginalVideo = new Video();
            // this.preloadedNextOriginalVideo = new Video();
            // this.preloadedPrevOriginalVideo = new Video();
            // this.preloadedPrevOriginalVideo = new Video();

            if (this.videoIndex[0] == this.currentPage) {
                this.preloadedNextOriginalVideo = String(this.baseUrl + "/postvideo/original/" + (this.currentPage));
                this.preloadedNextOriginalVideo = String(this.baseUrl + "/postvideo/artifact/" + (this.currentPage));
            }
            else if (this.videoIndex[this.videoIndex.length - 1] == this.currentPage) {
                this.preloadedNextOriginalVideo = String(this.baseUrl + "/postvideo/original/" + (this.currentPage));
                this.preloadedNextOriginalVideo = String(this.baseUrl + "/postvideo/artifact/" + (this.currentPage));
            } else {
                for (let i = 0; i < this.videoIndex.length; i++) {
                    if (this.videoIndex[i] == this.currentPage) {
                        this.preloadedNextOriginalVideo = String(this.baseUrl + "/postvideo/original/" + (this.videoIndex[i + 1]));
                        this.preloadedNextOriginalVideo = String(this.baseUrl + "/postvideo/artifact/" + (this.videoIndex[i + 1]));
                        this.preloadedPrevOriginalVideo = String(this.baseUrl + "/postvideo/original/" + (this.videoIndex[i - 1]));
                        this.preloadedPrevOriginalVideo = String(this.baseUrl + "/postvideo/artifact/" + (this.videoIndex[i - 1]));
                        console.log("preloadedNextOriginalVideo: " + this.preloadedNextOriginalVideo)
                        console.log("preloadedNextArtifactVideo: " + this.preloadedNextArtifactVideo)
                        console.log("preloadedPrevOriginalVideo: " + this.preloadedPrevOriginalVideo)
                        console.log("preloadedPrevArtifactVideo: " + this.preloadedPrevArtifactVideo)
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
            video1.pause();
            video2.pause();
            video1.currentTime = 0;
            video2.currentTime = 0;
        },
        goToEnd() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            const originalFrame = this.originalVideoFrameList[this.videoNameIndex];
            const temp = video1.duration - 1 / originalFrame;
            video1.pause();
            video2.pause();
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
            if (this.zoom > this.minZoom + 0.1) {
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
            await axios
                .post(this.baseUrl + "getVideoIndexCurrentPage", {
                    userID: this.currentUser,
                    testcode: this.testCode,
                })
                .then((response) => {
                    this.currentPage = parseInt(response.data.currentPage);//여기다 1 더해서 
                    this.videoIndex = response.data.videoList;
                    this.totalLength = this.videoIndex.length;
                    this.originalVideoNameList = response.data.originalVideoNameList;
                    this.artifactVideoNameList = response.data.artifactVideoNameList;
                    this.originalVideoFrameList = response.data.originalVideoFPSList;
                    this.artifactVideoFrameList = response.data.artifactVideoFPSList;
                    var curScore = 0;
                    curScore = response.data.userScore;
                    this.videoNameIndex = this.currentPage;
                    if (curScore != -1) {
                        this.isPressed[curScore] = true;
                        this.clickedButton = curScore;
                    }
                    console.log("current page: ", this.currentPage);
                    console.log("video list: ", this.videoIndex)
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
            if (this.baseUrl + "/postvideo/original/" + (this.currentPage) == this.preloadNextVideo) {
                return this.preloadedNextOriginalVideo;
            } else if (this.baseUrl + "/postvideo/original/" + (this.currentPage) == this.preloadedPrevOriginalVideo) {
                return this.preloadedPrevOriginalVideo;
            } else {
                return String(this.baseUrl + "/postvideo/original/" + (this.currentPage))
            }
        },
        rightArtifactVideo() {
            if (this.baseUrl + "/postvideo/original/" + (this.currentPage) == this.preloadNextVideo) {
                return this.preloadedNextOriginalVideo;
            } else if (this.baseUrl + "/postvideo/original/" + (this.currentPage) == this.preloadedPrevOriginalVideo) {
                return this.preloadedPrevOriginalVideo;
            } else {
                return String(this.baseUrl + "/postvideo/original/" + (this.currentPage))
            }
        },
        submitScoring() {
            for (var i = 0; i < 5; i++) {
                if (this.isPressed[i]) {
                    this.isClicked = true
                }
            }
            if (this.isClicked == false) {
                //console.log("Please chose the score!")
            } else {
                this.userScoring = this.clickedButton
                axios
                    .post(this.baseUrl + "postdata", {
                        Title: "scoring data",
                        Score: this.userScoring,
                        CurrentUser: this.currentUser,
                        ImageId: parseInt(this.currentPage),
                        TestCode: this.testCode
                    })
                    .then(res => {
                        console.log(res.data)
                        //after post we have to init data form userScoring and currentPage
                        this.userScoring = 0
                        if (this.videoIndex[this.videoIndex.length - 1] == this.currentPage) {
                            alert("Successfully submitted. This is the last page.")
                        } else {
                            for (var i = 0; i < this.videoIndex.length; i++) {
                                if (this.videoIndex[i] == this.currentPage) {
                                    this.currentPage = this.videoIndex[i + 1];
                                    alert("Successfully submitted.")
                                    return;
                                }
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        },
        changeNextVideo() {
            if (this.clickedButton == -1) {
                alert("Please choose score.")
            } else {
                if (this.videoButtonText == 'Stop') {
                    this.changeVideoButton();
                }
                this.userScoring = this.clickedButton
                console.log("user scoring: ", this.userScoring)
                console.log("next current page: ", this.currentPage)
                //마지막 페이지 확인
                if (this.currentPage == this.videoIndex[this.videoIndex.length - 1]) {
                    axios
                        .post(this.baseUrl + "postdata", {
                            Title: "scoring data",
                            Score: this.userScoring,
                            CurrentUser: this.currentUser,
                            ImageId: parseInt(this.currentPage),
                            TestCode: this.testCode
                        })
                        .catch(error => {
                            console.error(error);
                        })
                    alert("This is the last page of this test code. Thank you!");
                    return;
                } else {
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
                            this.isPressed = [false, false, false, false, false, false]
                            this.videoNameIndex += 1
                            // score가 response로 날아옴
                            var curScore = res.data;
                            this.resetZoomAndOffset();
                            this.updateVideoStyle();
                            // 사용자가 scoring한 점수가 없으면 curScore == -1
                            if (curScore != -1) {
                                this.isPressed[curScore] = true;
                                this.clickedButton = curScore;
                                //console.log("isPressed: " + curScore);
                            }
                            for (var i = 0; i < this.videoIndex.length; i++) {
                                //console.log("video index : ", this.videoIndex[i])
                                if (this.videoIndex[i] == this.currentPage) {
                                    this.currentPage = this.videoIndex[i + 1];
                                    this.$router.push({
                                        query: {
                                            userName: this.userId,
                                            currentPage: this.currentPage,
                                            testcode: this.testcode,
                                        }
                                    });
                                    return;
                                }
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        })
                }
                this.clickedButton = -1
            }
        },
        changeBackVideo() {
            if (this.currentPage == this.videoIndex[0]) {
                alert("This is the first page.");
                return;
            } else {
                if (this.videoButtonText == 'Stop') {
                    this.changeVideoButton();
                }
                this.isPressed = [false, false, false, false, false, false]
                for (var i = 1; i < this.videoIndex.length; i++) {
                    if (this.videoIndex[i] == this.currentPage) {
                        this.videoNameIndex -= 1
                        this.currentPage = this.videoIndex[i - 1];
                        this.$router.push({
                            query: {
                                userName: this.userId,
                                currentPage: this.currentPage,
                                testcode: this.testcode
                            }
                        });
                        var curScore = 0;
                        axios
                            .post(this.baseUrl + "getUserScore", {
                                CurrentUser: this.currentUser,
                                ImageId: parseInt(this.currentPage),
                                TestCode: this.testCode,
                            })
                            .then((response) => {
                                curScore = response.data;
                                //console.log(curScore)
                                if (curScore != -1) {
                                    this.isPressed[curScore] = true;
                                    this.clickedButton = curScore;
                                } else {
                                    curScore = -1
                                    this.clickedButton = curScore;
                                    this.isPressed = [false, false, false, false, false, false]
                                }
                                //console.log("curScore: " + curScore);
                            })
                            .catch((err) => {
                                console.log(err);
                            })

                        var videoEelement1 = document.getElementById('videoNoartifact');
                        var videoEelement2 = document.getElementById('videoYesartifact');
                        videoEelement1.style.transform = "scale(1)";
                        videoEelement2.style.transform = "scale(1)";
                        return;
                    }
                }
                this.clickedButton = -1
            }
        },
        // score button 눌렸는지 안눌렸는지 확인하는 method
        toggleButton(index) {
            this.isPressed = [false, false, false, false, false, false]
            this.isPressed[index] = !this.isPressed[index]
        },
        // video 2개 동시에 플레이 시키는 method
        playVideos() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            // toggleVideo는 videoYesartifact와 같은 비디오 
            var toggleVideo = document.getElementById('toggleVideo');
            if (video1 && video2 && toggleVideo) {
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
        pauseVideos() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            var toggleVideo = document.getElementById('toggleVideo');

            if (video1 && video2 && toggleVideo) {
                var temp = video2.currentTime;
                video1.currentTime = temp;
                toggleVideo.currentTime = temp;
                video1.pause();
            }
        },
        // Play/Stop 및 text 변경 버튼
        changeVideoButton() {
            if (this.videoButtonText == "Play") {
                this.playVideos();
                this.videoButtonText = "Stop";
            } else {
                this.videoButtonText = "Play";
                this.pauseVideos();
            }
            this.changeImgSource();
        },
        seekBackward() {
            const video1 = this.$refs.videoNoartifact;
            const video2 = this.$refs.videoYesartifact;
            var video3 = document.getElementById("toggleVideo");
            const originalFrame = this.originalVideoFrameList[this.videoNameIndex];
            const artifactFrame = this.artifactVideoFrameList[this.videoNameIndex];
            if (originalFrame != 0 && artifactFrame != 0) {
                const halfOriginalFrame = (1 / originalFrame) / 2;
                const halfArtifactFrame = (1 / artifactFrame) / 2;

                if (video1 && video2) {
                    if (video1.currentTime == 0) {
                        video1.currentTime = halfOriginalFrame;
                        video2.currentTime = halfArtifactFrame;
                        video3.currentTime = halfArtifactFrame
                    } else {
                        video1.currentTime -= 1 / originalFrame;
                        video2.currentTime -= 1 / artifactFrame;
                        video3.currentTime -= 1 / artifactFrame;
                    }
                }
            }
        },
        seekForward() {
            const video1 = this.$refs.videoNoartifact;
            const video2 = this.$refs.videoYesartifact;
            const video3 = document.getElementById('toggleVideo');
            const originalFrame = 1 / this.originalVideoFrameList[this.videoNameIndex];
            const artifactFrame = 1 / this.artifactVideoFrameList[this.videoNameIndex];

            if (originalFrame != 0 && artifactFrame != 0) {
                const halfOriginalFrame = (1 / originalFrame) / 2;
                const halfArtifactFrame = (1 / artifactFrame) / 2;
                if (video1 && video2) {
                    if (video1.currentTime == 0 || video2.currentTime == 0) {
                        video1.currentTime = halfOriginalFrame;
                        video2.currentTime = halfArtifactFrame;
                        video3.currentTime = halfArtifactFrame;
                    } else {
                        // 마지막 프레임을 버림
                        if (video1.currentTime + originalFrame * 3 >= video1.duration) {
                            return;
                        }
                        video1.currentTime += originalFrame;
                        video2.currentTime += artifactFrame;
                        video3.currentTime += artifactFrame;
                    }
                }
            }
        }
    },
}
</script>

<style>
@import '../main.css';
</style>
