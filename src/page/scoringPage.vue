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
                <button @click="seekBackward" @mouseover="isMouseOverMinus = true" @mouseout="isMouseOverMinus = false"
                    :class="{ 'btn-style': !isMouseOverMinus, 'clicked-btn-style': isMouseOverMinus }"
                    style="margin-right: 2%;">-1
                    frame</button>
                <button id="videoButton" key="videoButton" @click="changeVideoButton" @mouseover="isMouseOverPlay = true"
                    @mouseout="isMouseOverPlay = false"
                    :class="{ 'btn-style': !isMouseOverPlay, 'clicked-btn-style': isMouseOverPlay }">{{
                        videoButtonText }}</button>
                <button @click="seekForward" @mouseover="isMouseOverPlus = true" @mouseout="isMouseOverPlus = false"
                    :class="{ 'btn-style': !isMouseOverPlus, 'clicked-btn-style': isMouseOverPlus }"
                    style="margin-left: 2%;">+1
                    frame</button>
            </div>
            <div style="display: flex; margin-left: auto; margin-right: auto;">
                <div style="margin-left: auto; margin-right: auto; display: flex;">
                    <button v-on="click" class="btn-style"
                        style="font-size: x-large; width: 120px; height: 55px; padding-top: 9px;"
                        @click="changeBackVideo">prev</button>
                    <button v-for="a in 5" ref="score" :key="a" v-on:click="clickedButton = a"
                        style="width: 80px; height: 55px; font-size:x-large; padding-top: 9px;"
                        :class="{ 'clicked-btn-style': isPressed[a], 'btn-style': !isPressed[a] }"
                        @click="toggleButton(a)">{{ a }}</button>
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
            clickedButton: 0,
            noScore: false,
            maxVideonum: 3,
            userScoring: 0,
            scoreNum: [1, 2, 3, 4, 5],
            isPressed: [false, false, false, false, false],
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
        // TODO: backend에서 leftVideFrame, rightVideoFrame을 받아와서 leftVideoFrame, rightVideoFrame에 저장해야 함.
        // TODO: 비디오 drag & drop 할 때, 비디오가 화면 밖으로 없어지는 현상 수정 필요
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
                if(video1.currentTime < video2.currentTime) {
                    console.log("video1 ended: " + video1.currentTime)
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                    // document.getElementById("videoNoartifact").currentTime = video2.currentTime;
                    // document.getElementById("videoNoartifact").currentTime = video2.currentTime;
                }else{
                    console.log("video2 ended: " + video2.currentTime)
                    // document.getElementById("videoYesartifact").currentTime = video1.currentTime;
                    // document.getElementById("videoYesartifact").currentTime = video1.currentTime;
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
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
                if(video1.currentTime < video2.currentTime) {
                    // document.getElementById("videoNoartifact").currentTime = video2.currentTime;
                    // document.getElementById("videoNoartifact").currentTime = video2.currentTime;
                    console.log("video1 ended: " + video1.currentTime)
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
                }else{
                    // document.getElementById("videoYesartifact").currentTime = video1.currentTime;
                    // document.getElementById("videoYesartifact").currentTime = video1.currentTime;
                    console.log("video2 ended: " + video2.currentTime)
                    video1.pause();
                    video2.pause();
                    video1.currentTime = 0;
                    video2.currentTime = 0;
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
        // zoomIn() {
        //     this.zoom += 0.1;
        //     this.updateVideoStyle();
        // },
        // zoomOut() {
        //     if (this.zoom > this.minZoom + 0.1) {
        //         this.zoom -= 0.1;
        //         this.updateVideoStyle();
        //     }
        // },
        // // updateVideoStyle() {
        // //     this.videoStyles = {
        // //         transform: `scale(${this.zoom})`,
        // //         transformOrigin: `${this.zoomCenterX}% ${this.zoomCenterY}%`,
        // //     }
        // // },
        // setZoomCenter(event) {
        //     const rect1 = this.$refs.videoNoartifact.getBoundingClientRect();
        //     const rect2 = this.$refs.videoYesartifact.getBoundingClientRect();

        //     if (event.target.id === 'videoNoartifact') {
        //         this.zoomCenterX = ((event.clientX - rect1.left) / rect1.width) * 100;
        //         this.zoomCenterY = ((event.clientY - rect1.top) / rect1.height) * 100;
        //     } else if (event.target.id === 'videoYesartifact') {
        //         this.zoomCenterX = ((event.clientX - rect2.left) / rect2.width) * 100;
        //         this.zoomCenterY = ((event.clientY - rect2.top) / rect2.height) * 100;
        //     }
        //     this.updateVideoStyle();
        // },
        // handleWheel(event) {
        //     if (event.deltaY < 0) {
        //         this.zoomIn();
        //     } else {
        //         this.zoomOut();
        //     }
        //     this.setZoomCenter(event);
        //     event.preventDefault();
        // },

        // handleDragStart(event) {
        //     this.dragging = true;
        //     this.dragStartX = event.clientX;
        //     this.dragStartY = event.clientY;
        //     document.addEventListener('mousemove', this.handleDragging);
        //     document.addEventListener('mouseup', this.handleDragEnd);
        // },
        // handleDragging(event) {
        //     if (this.dragging) {
        //         const dx = event.clientX - this.dragStartX;
        //         const dy = event.clientY - this.dragStartY;
        //         this.offsetX += dx;
        //         this.offsetY += dy;
        //         this.dragStartX = event.clientX;
        //         this.dragStartY = event.clientY;
        //         this.updateVideoStyle();
        //     }
        // },
        // handleDragEnd() {
        //     this.dragging = false;
        //     document.removeEventListener('mousemove', this.handleDragging);
        //     document.removeEventListener('mouseup', this.handleDragEnd);
        // },
        // updateVideoStyle() {
        //     const scale = `scale(${this.zoom})`;
        //     const translate = `translate(${this.offsetX / this.zoom}px, ${this.offsetY / this.zoom}px)`;

        //     this.videoStyles = {
        //         transform: `${scale} ${translate}`,
        //         transformOrigin: `${this.zoomCenterX}% ${this.zoomCenterY}%`,
        //     }
        // },


        // updateVideoStyle() {
        //     this.videoStyles = {
        //         transform: `scale(${this.zoom}) translate(${this.offsetX}px, ${this.offsetY}px)`,
        //         transformOrigin: `${this.zoomCenterX}% ${this.zoomCenterY}%`,
        //     }
        // },

        // TODO: drag and drop 으로 확대/축소한 상태에서 이동 가능하게 만들기

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
                    this.videoList = response.data.videoList;
                    this.originalVideoNameList = response.data.originalVideoNameList;
                    this.artifactVideoNameList = response.data.artifactVideoNameList;
                    this.originalVideoFrameList = response.data.originalVideoFPSList;
                    this.artifactVideoFrameList = response.data.artifactVideoFPSList;

                    console.log("getVideoIndexCurrentPage response")
                    console.log("current page: ", this.currentPage);
                    console.log("video list: ", this.videoList)
                    console.log("original video name list: ", this.originalVideoNameList)
                    console.log("artifact video name list: ", this.artifactVideoNameList)
                    console.log("original video frame list: ", this.originalVideoFrameList)
                    console.log("artifact video frame list: ", this.artifactVideoFrameList)
                    this.parsingStringToIntArray();
                    this.parsingOriginalNameList();
                    this.parsingArtifactNameList();
                    this.leftOriginalVideo();
                    this.rightArtifactVideo();

                    // 원래는 백에서 index를 받아와야하는데, 여기서는 index를 받아오지 않고, 프론트에서 videoList에서 index를 찾아서 videoNameIndex에 저장
                    for (var i = 0; i < this.videoList.length; i++) {
                        if (this.videoIndex[i] == this.currentPage) {
                            this.videoNameIndex = i
                            console.log("videoNameIndex: ", this.videoNameIndex)
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        parsingStringToIntArray() {
            var temp = this.videoList.split(",");
            for (var i in temp) {
                this.videoIndex.push(parseInt(temp[i]));
            }
            console.log("parsingStringToIntArray")
            console.log("video index: ", this.videoIndex);
            console.log("video index length: " + this.videoIndex.length);
        },
        parsingOriginalNameList() {
            this.originalVideoNameList = this.originalVideoNameList.split(",");
            console.log("original name: ", this.originalVideoNameList);
        },
        parsingArtifactNameList() {
            this.artifactVideoNameList = this.artifactVideoNameList.split(",");
            console.log("artifact index: ", this.artifactVideoNameList);
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

                        for (var i in this.videoIndex.length) {
                            if (this.videoIndex[i] == this.videoIndex[this.videoIndex.length - 1]) {
                                console.log("This is the last page");
                                console.log("last page: ", this.currentPage);
                                alert("Successfully submitted. This is the last page.")
                                return;
                            } else if (this.videoIndex[i] == this.currentPage) {
                                this.currentPage = this.videoIndex[i + 1];
                                console.log("next page : " + this.currentPage);
                                alert("Successfully submitted.")
                                return;
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        },
        // 다음 비디오로 비디오 변경
        changeNextVideo() {
            if (this.clickedButton == 0) {
                alert("Please choose score.")
            } else {
                this.userScoring = this.clickedButton
                console.log("changeNextVideo")
                console.log("user scoring: ", this.userScoring)
                console.log("current user:", this.currentUser)
                console.log("current page: ", this.currentPage)
                console.log("test code: ", this.testCode)

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
                            ImageId: parseInt(this.currentPage) + 1,
                            TestCode: this.testCode
                        })
                        .then(res => {
                            //after post we have to init data form userScoring and currentPage
                            console.log("response: ", res.data)
                            this.userScoring = 0
                            this.isPressed = [false, false, false, false, false]
                            this.videoNameIndex += 1
                            console.log("videoNameIndex: ", this.videoNameIndex)

                            this.resetZoomAndOffset();
                            this.updateVideoStyle();
                            // var videoEelement1 = document.getElementById('videoNoartifact');
                            // var videoEelement2 = document.getElementById('videoYesartifact');
                            // videoEelement1.style.transform = "scale(1)";
                            // videoEelement2.style.transform = "scale(1)";

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
        // 이전 비디오로 비디오 변경
        changeBackVideo() {
            this.isPressed = [false, false, false, false, false]
            console.log("changeBackVideo")

            if (this.currentPage == this.videoIndex[0]) {
                alert("This is the first page.");
                console.log("first page: ", this.currentPage);
                return;
            } else {
                for (var i = 1; i < this.videoIndex.length; i++) {
                    if (this.videoIndex[i] == this.currentPage) {
                        this.videoNameIndex -= 1
                        this.currentPage = this.videoIndex[i - 1];
                        console.log("video index : ", this.videoIndex[i])
                        console.log("prev page: " + this.currentPage);
                        console.log("videoNameIndex: ", this.videoNameIndex)

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
            this.isPressed = [false, false, false, false, false]
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
            } else {
                this.pauseVideos();
                this.videoButtonText = "Play";
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

                if (video1 && video2) {
                    if (video1.currentTime == 0) {
                        video1.currentTime = halfOriginalFrame;
                        video2.currentTime = halfArtifactFrame;
                    } else {
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
