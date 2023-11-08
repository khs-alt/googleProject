<template>
    <div class="body-style">
        <div class="menu">
            <div class="menu-header">
                <div class="menu-content">
                    <a href="/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Home</button>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="home-main-content" style="padding-bottom: 0;">
        <div class="videoPlayer">
            <div style="display: flex; margin-left: auto; margin-right: auto; max-height: 60%;">
                <div style="margin: 15px;">
                    <transition name="fade" mode="out-in" appear>
                        <div style="max-width: 100%; max-height: 550px; overflow: hidden;">
                            <video id="videoNoartifact" :style="videoStyles" style="height: 550px; max-width: 100%;"
                                ref="videoNoartifact" controlsList="nodownload" key="videoNoartifact"
                                :src="leftOriginalVideo()" @wheel="handleWheel" @click="setZoomCenter"
                                @mousedown="handleDragStart" @mouseup="handleDragEnd" @mousemove="handleDragging"
                                onChange="isVideoPaused">
                            </video>
                        </div>
                    </transition>
                    <div>
                        <h5 style="margin-top: 8px;">{{ this.originalVideoNameList[videoNameIndex] }}</h5>
                    </div>
                </div>
                <div style="margin: 15px;">
                    <transition name="fade" mode="out-in" appear>
                        <div style="max-width: 100%; max-height: 550px; overflow: hidden;">
                            <video id="videoYesartifact" :style="videoStyles" style="height: 550px; max-width: 100%;"
                                ref="videoYesartifact" controlsList="nodownload" key="videoYesartifact"
                                :src="rightArtifactVideo()" @wheel="handleWheel" @click="setZoomCenter"
                                @mousedown="handleDragStart" @mouseup="handleDragEnd" @mousemove="handleDragging"
                                onChange="isVideoPaused">
                            </video>
                        </div>
                    </transition>
                    <div>
                        <h5 style="margin-top: 8px;">{{ this.artifactVideoNameList[videoNameIndex] }}</h5>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <!-- <h3>Progess Bar</h3>
        <div>
            TODO: progess bar 수정 필요
            <progress style="width: 100%;" :value="currentPage" max="100"></progress>
        </div> -->
        </div>
        <div style="margin-left: 50px; margin-right: 50px; max-width: 100%;">
            <div style="margin-bottom: 5px;">
                <button class="btn-style" @click="goToBegin">
                    <img style="width: 50p; height: 30px;" src="../images/play_icon/iconmonstr-media-control-52-240.png">
                </button>
                <button @click="seekBackward" @mouseover="isMouseOverMinus = true" @mouseout="isMouseOverMinus = false"
                    :class="{ 'btn-style': !isMouseOverMinus, 'clicked-btn-style': isMouseOverMinus }"
                    style="margin-right: 2%;">
                    <img style="width: 50px; height: 30px;" src="../images/play_icon/iconmonstr-media-control-18-240.png"
                        alt="-1 frame">
                </button>
                <!-- <button id="videoButton" key="videoButton" @click="changeVideoButton" @mouseover="isMouseOverPlay = true"
                    @mouseout="isMouseOverPlay = false"
                    :class="{ 'btn-style': !isMouseOverPlay, 'clicked-btn-style': isMouseOverPlay }">
                    {{videoButtonText }}</button> -->
                <button id="videoButton" key="videoButton" @click="changeVideoButton(); changeImgSource()"
                    @mouseover="isMouseOverPlay = true" @mouseout="isMouseOverPlay = false"
                    :class="{ 'btn-style': !isMouseOverPlay, 'clicked-btn-style': isMouseOverPlay }">
                    <img style="width: 50px; height: 30px;" :src=imgSrc>
                </button>
                <button @click="seekForward" @mouseover="isMouseOverPlus = true" @mouseout="isMouseOverPlus = false"
                    :class="{ 'btn-style': !isMouseOverPlus, 'clicked-btn-style': isMouseOverPlus }"
                    style="margin-left: 2%;">
                    <img style="width: 50px; height: 30px;" src="../images/play_icon/iconmonstr-media-control-13-240.png"
                        alt="+1 frame">
                </button>
                <button class="btn-style" @click="goToEnd">
                    <img style="width: 50p; height: 30px;" src="../images/play_icon/iconmonstr-media-control-53-240.png">
                </button>
            </div>
            <div style="display: flex; margin-left: auto; margin-right: auto;">
                <div style="margin-left: auto; margin-right: auto; display: flex;">
                    <button v-on="click" class="btn-style"
                        style="font-size: x-large; width: 120px; height: 55px; padding-top: 9px;"
                        @click="changeBackVideo">prev</button>
                    <button v-for="a in 6" ref="score" :key="a-1" v-on:click="clickedButton = a-1"
                        style="width: 80px; height: 55px; font-size:x-large; padding-top: 9px;"
                        :class="{ 'clicked-btn-style': isPressed[a-1], 'btn-style': !isPressed[a-1] }"
                        @click="toggleButton(a-1)">{{ a-1 }}</button>
                    <button v-on="click" class="btn-style"
                        style="font-size: x-large; width: 120px; height: 55px; padding-top: 9px;"
                        @click="changeNextVideo">next</button>
                </div>
            </div>
            <div>
                <button v-on="click" class="btn-style" style="width: 130px; height: 60px; font-size: x-large; padding: 9px;"
                    @click="submitScoring()">submit</button>
            </div>
        </div>
    </div>
</template>
<!-- TODO: 원래 기록되어있던 점수가 눌러있는 상태로 나오게 -->

<script>
import axios from 'axios'
export default {
    name: 'scoringPage',
    data() {
        return {
            clickedButton: -1,
            noScore: false,
            maxVideonum: 3,
            userScoring: 0,
            scoreNum: [0, 1, 2, 3, 4, 5],
            isPressed: [false, false, false, false, false, false],
            isClicked: false,
            menuBar: ['Home'],
            currentPage: this.$route.query.currentPage,
            currentUser: this.$route.query.userName,
            testCode: this.$route.query.testcode,
            videoButtonText: "Play",
            baseUrl: "http://localhost:8000",
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
            imgSrc: require("../images/play_icon/iconmonstr-media-control-48-240.png"),
        }
    },
    created() { },
    mounted() {
        this.changeVideoButton;
        this.getVideoIndexCurrentPage();
        this.addEventVideoPlay();
        this.isVideoPaused();
        document.addEventListener('mousemove', this.handleDragging);
        document.addEventListener('mouseup', this.handleDragEnd);
    },
    methods: {
        // TODO: 비디오 drag & drop 할 때, 비디오가 화면 밖으로 없어지는 현상 수정 필요
        clickExport() {
            axios
                .post(this.baseUrl + '/getCSVFile', {
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
            video1.pause();
            video2.pause();
            video1.currentTime = video1.duration;
            video2.currentTime = video2.duration;
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
            console.log("isVideoPaused: " + this.videoButtonText)

            video1.addEventListener("ended", () => {
                this.videoButtonText = "Play";
                // if(video2.currentTime < video2.duration){
                //     video2.currentTime = video2.duration;
                // }
                // // video2.currentTime = video1.duration;
                // console.log("video1: " + video1.currentTime)
                // console.log("video2: " + video2.currentTime)
                // console.log("video1 duration: " + video1.duration)
                if (video1.currentTime < video2.currentTime) {
                    console.log("video1 ended: " + video1.currentTime)
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    this.changeImgSource();
                    // document.getElementById("videoNoartifact").currentTime = video2.currentTime;
                    // document.getElementById("videoNoartifact").currentTime = video2.currentTime;
                } else {
                    console.log("video2 ended: " + video2.currentTime)
                    // document.getElementById("videoYesartifact").currentTime = video1.currentTime;
                    // document.getElementById("videoYesartifact").currentTime = video1.currentTime;
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    this.changeImgSource();
                }
            });
            video2.addEventListener("ended", () => {
                this.videoButtonText = "Play";
                // if(video1.currentTime < video1.duration){
                //     video1.currentTime = video1.duration;
                // }
                // // video1.currentTime = video2.duration;
                // console.log("video2 duration: " + video2.duration)
                // console.log("video1: " + video1.currentTime)
                // console.log("video2: " + video2.currentTime)
                if (video1.currentTime < video2.currentTime) {
                    // document.getElementById("videoNoartifact").currentTime = video2.currentTime;
                    // document.getElementById("videoNoartifact").currentTime = video2.currentTime;
                    console.log("video1 ended: " + video1.currentTime)
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    this.changeImgSource();
                } else {
                    // document.getElementById("videoYesartifact").currentTime = video1.currentTime;
                    // document.getElementById("videoYesartifact").currentTime = video1.currentTime;
                    console.log("video2 ended: " + video2.currentTime)
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
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
                .post(this.baseUrl + "/getVideoIndexCurrentPage", {
                    userID: this.currentUser,
                    testcode: this.testCode,
                })
                .then((response) => {
                    this.currentPage = response.data.currentPage;
                    this.videoIndex = response.data.videoList;
                    this.originalVideoNameList = response.data.originalVideoNameList;
                    this.artifactVideoNameList = response.data.artifactVideoNameList;
                    this.originalVideoFrameList = response.data.originalVideoFPSList;
                    this.artifactVideoFrameList = response.data.artifactVideoFPSList;
                    this.videoNameIndex = this.currentPage;

                    console.log("getVideoIndexCurrentPage response")
                    console.log("current page: ", this.currentPage);
                    console.log("video list: ", this.videoIndex)
                    console.log("original video name list: ", this.originalVideoNameList)
                    console.log("artifact video name list: ", this.artifactVideoNameList)
                    console.log("original video frame list: ", this.originalVideoFrameList)
                    console.log("artifact video frame list: ", this.artifactVideoFrameList)
                    this.leftOriginalVideo();
                    this.rightArtifactVideo();
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        navigateTo(item) {
            if (item === 'Home') {
                this.$router.push('/');
            }
        },
        leftOriginalVideo() {
            console.log("leftOriginalVideo")
            console.log("original page url: ", this.baseUrl + "/postvideo/original/" + (this.currentPage))
            return String(this.baseUrl + "/postvideo/original/" + (this.currentPage))
        },
        rightArtifactVideo() {
            console.log("rightArtifactVideo")
            console.log("artifact page url: ", this.baseUrl + "/postvideo/artifact/" + (this.currentPage))
            return String(this.baseUrl + "/postvideo/artifact/" + (this.currentPage))
        },
        submitScoring() {
            for (var i = 0; i < 10; i++) {
                if (this.isPressed[i]) {
                    this.isClicked = true
                }
            }
            if (this.isClicked == false) {
                console.log("Please chose the score!")
            } else {
                this.userScoring = this.clickedButton

                axios
                    .post(this.baseUrl + "/postdata", {
                        Title: "scoring data",
                        Score: this.userScoring,
                        CurrentUser: this.currentUser,
                        ImageId: parseInt(this.currentPage),
                        TestCode: this.testCode
                    })
                    .then(res => {
                        console.log(res)
                        // alert(res.data)
                        //after post we have to init data form userScoring and currentPage
                        this.userScoring = 0
                        if (this.videoIndex[this.videoIndex.length - 1] == this.currentPage) {
                            alert("Successfully submitted. This is the last page.")
                            return;
                        } else {
                            for (var i = 0; i < this.videoIndex.length; i++) {
                                if (this.videoIndex[i] == this.currentPage) {
                                    this.currentPage = this.videoIndex[i + 1];
                                    console.log("next page : " + this.currentPage);
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
                this.isPressed = [false, false, false, false, false, false]
                this.userScoring = this.clickedButton
                // console.log("changeNextVideo")
                // console.log("user scoring: ", this.userScoring)
                // console.log("current user:", this.currentUser)
                // console.log("current page: ", this.currentPage)
                // console.log("test code: ", this.testCode)

                console.log(this.currentPage)
                console.log(this.videoIndex)
                console.log(this.videoIndex[this.videoIndex.length - 1])

                if (this.currentPage == this.videoIndex[this.videoIndex.length - 1]) {
                    alert("This is the last page");
                    console.log("This is the last page");
                    return;
                } else {
                    axios
                        .post(this.baseUrl + "/postdata", {
                            Title: "scoring data",
                            Score: this.userScoring,
                            CurrentUser: this.currentUser,
                            ImageId: parseInt(this.currentPage),
                            TestCode: this.testCode
                        })
                        .then(res => {
                            //after post we have to init data form userScoring and currentPage
                            console.log("response: ", res.data)
                            this.userScoring = 0
                            this.isPressed = [false, false, false, false, false, false]
                            this.videoNameIndex += 1
                            console.log("videoNameIndex: ", this.videoNameIndex)
                            var curScore = res.data;
                            this.resetZoomAndOffset();
                            this.updateVideoStyle();

                            if (curScore != 0) {
                                this.isPressed[curScore] = true;
                                console.log("isPressed: " + curScore);
                            }
                            for (var i = 0; i < this.videoIndex.length; i++) {
                                console.log("video index : ", this.videoIndex[i])
                                if (this.videoIndex[i] == this.currentPage) {
                                    this.currentPage = this.videoIndex[i + 1];
                                    console.log("next page : " + this.currentPage);
                                    return;
                                }
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        })
                }

            }
        },
        changeBackVideo() {
            console.log("changeBackVideo")

            if (this.currentPage == this.videoIndex[0]) {
                alert("This is the first page.");
                console.log("first page: ", this.currentPage);
                return;
            } else {
                this.isPressed = [false, false, false, false, false, false]
                for (var i = 1; i < this.videoIndex.length; i++) {
                    if (this.videoIndex[i] == this.currentPage) {
                        this.videoNameIndex -= 1
                        this.currentPage = this.videoIndex[i - 1];
                        console.log("video index : ", this.videoIndex[i])
                        console.log("prev page: " + this.currentPage);
                        console.log("videoNameIndex: ", this.videoNameIndex)
                        var curScore = 0;
                        axios
                            .post(this.baseUrl + "/getUserScore", {
                                CurrentUser: this.currentUser,
                                ImageId: parseInt(this.currentPage),
                                TestCode: this.testCode,
                            })
                            .then((response) => {
                                curScore = response.data;
                                console.log(curScore)
                                if (curScore != 0) {
                                    this.isPressed[curScore] = true;
                                }
                                console.log("curScore: " + this.curSCore);
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
            }
        },
        // score button 눌렸는지 안눌렸는지 확인하는 method
        toggleButton(index) {
            this.isPressed = [false, false, false, false, false, false]
            this.isPressed[index] = !this.isPressed[index]
        },
        // video 2개 동시에 플레이 시키는 method
        // TODO: play 버튼 아이콘으로 변경 필요
        playVideos() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            if (video1 && video2) {
                video1.currentTime = video2.currentTime;
                video1.play();
            }
        },
        addEventVideoPlay() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            document.getElementById('videoNoartifact').currentTime = video2.currentTime;
            document.getElementById('videoNoartifact').currentTime = video2.currentTime;

            video1.addEventListener("play", function () {
                document.getElementById('videoYesartifact').play();
            });
            video1.addEventListener("pause", function () {
                document.getElementById('videoYesartifact').pause();
            })
        },
        // video 2개 동시에 Stop 시키는 method
        pauseVideos() {
            var video1 = document.getElementById('videoNoartifact');
            var video2 = document.getElementById('videoYesartifact');
            if (video1 && video2) {
                document.getElementById('videoNoartifact').currentTime = video2.currentTime;
                document.getElementById('videoNoartifact').currentTime = video2.currentTime;
                video1.pause();
            }
        },
        // Play/Stop 및 text 변경 버튼
        changeVideoButton() {
            console.log("changeVideoButton\n" + this.videoButtonText)
            if (this.videoButtonText == "Play") {
                this.playVideos();
                this.videoButtonText = "Stop";
                this.changeImgSource();
            } else {
                this.videoButtonText = "Play";
                this.pauseVideos();
            }
            console.log("after changeVideoButton\n" + this.videoButtonText)
        },
        seekBackward() {
            const video1 = this.$refs.videoNoartifact;
            const video2 = this.$refs.videoYesartifact;
            const originalFrame = this.originalVideoFrameList[this.videoNameIndex];
            const artifactFrame = this.artifactVideoFrameList[this.videoNameIndex];

            if (originalFrame != 0 && artifactFrame != 0) {
                const halfOriginalFrame = (1 / originalFrame) / 2;
                const halfArtifactFrame = (1 / artifactFrame) / 2;
                console.log("original frame: " + originalFrame)
                console.log("artifact frame: " + artifactFrame)

                if (video1 && video2) {
                    if (video1.currentTime == 0) {
                        video1.currentTime = halfOriginalFrame;
                        video2.currentTime = halfArtifactFrame;
                    } else {
                        video1.currentTime -= 1 / originalFrame;
                        video2.currentTime -= 1 / artifactFrame;
                    }
                }
            }
            console.log("current left time: " + video1.currentTime)
            console.log("current right time: " + video2.currentTime)
        },
        seekForward() {
            const video1 = this.$refs.videoNoartifact;
            const video2 = this.$refs.videoYesartifact;
            const originalFrame = this.originalVideoFrameList[this.videoNameIndex];
            const artifactFrame = this.artifactVideoFrameList[this.videoNameIndex];
            if (originalFrame != 0 && artifactFrame != 0) {
                const halfOriginalFrame = (1 / originalFrame) / 2;
                const halfArtifactFrame = (1 / artifactFrame) / 2;
                console.log("original frame: " + originalFrame)
                console.log("artifact frame: " + artifactFrame)
                if (video1 && video2) {
                    if (video1.currentTime == 0 || video2.currentTime == 0) {
                        video1.currentTime = halfOriginalFrame;
                        video2.currentTime = halfArtifactFrame;
                    } else {
                        // TODO: 마지막 프레임을 버림
                        if (video1.currentTime + (1 / originalFrame) * 3 >= video1.duration || video2.currentTime + (1 / artifactFrame) * 3 >= video2.duration) {
                            console.log("video1.duration: " + video1.duration)
                            console.log("video2.duration: " + video2.duration)
                            console.log("video1.currentTime: " + video1.currentTime)
                            console.log("video2.currentTime: " + video2.currentTime)
                            return;
                        }
                        video1.currentTime += 1 / originalFrame;
                        video2.currentTime += 1 / artifactFrame;
                    }
                }
            }
            console.log("current left time: " + video1.currentTime)
            console.log("current right time: " + video2.currentTime)
        },
    },
}
</script>

<style>
@import '../main.css';
</style>
