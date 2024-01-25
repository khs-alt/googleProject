<template>
  <div class="labelingPage">
    <div class="body-style">
      <div class="menu">
        <div class="menu-header" style="display: flex;">
          <div class="menu-content" style="justify-content: space-between;">
            <div class="progressBar">
              <div v-for="i in progressBarLength" :key="i" :class="getProgressBarClass(i - 1)"
                @click="toggleProgressModal((i - 1))">
              </div>
            </div>
            <div>
              <button class="signup-btn-style" style="margin-right: 10px;" @click="toggleHelpModal()">Help</button>
              <a href="/label/" style="margin-right: 10px;">
                <button class="signup-btn-style">Home</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-wrap" v-show="progressModal"> <!--진행상황-->
      <div class="modal-container">
        <h3>Progress</h3>
        <div style="display: flex; flex-wrap: wrap;">
          <div v-for="i in progressBarList[progressModalPage]" :key="i"><button
              style="margin: 2px; width: 40px; height: 30px; font-size: large; padding-top: 1px; display: flex; justify-content: center;"
              :class="userLabelingList[progressModalPage * 100 + i - 1] == true ? 'clicked-btn-style' : 'btn-style'"
              @click="changePage(progressModalPage * 100 + i)">{{ progressModalPage * 100 + i }}</button></div>
        </div>
        <div class="btncontainer">
          <button class="btn-style" @click="toggleProgressModal()">Close</button>
        </div>
      </div>
    </div>
    <div class="modal-wrap" v-show="openModal"> <!--사용법-->
      <div class="modal-container" style="width: fit-content;">
        <h3>{{ modalTitle[modalPage] }}</h3>
        <div :class="modalPage >= 2 ? 'exampleScore' : ''">
          <div v-for="i in modalContent[modalPage]" :key="i">
            <div v-if="modalPage < 2">
              <p>{{ i }}</p>
            </div>
            <div v-else>
              <img :src="helpPageImageNum((modalPage - 2) * 2)" style="width: 400px; height: 300px;">
              <p>{{ i }}</p>
            </div>
          </div>
        </div>
        <div class="btncontainer">
          <button class="btn-style" @click="changeModal(0)">&lt;</button>
          <button class="btn-style" @click="toggleHelpModal()">Close</button>
          <button class="btn-style" @click="changeModal(1)">></button>
        </div>
      </div>
    </div>
    <div class="home-main-content" style="padding-bottom: 0; padding-top: 10px;">
      <p style="font-size: 24px; margin-top: 10px;">Patch Ghosting Artifact Labeling System</p>
      <div class="labelcontainer">
        <div :class="this.imageWidth < this.imageHeight ? 'imagecontainer' : 'imagecontainer-column'">
          <div class="imageName">
            <div class="images">
              <div class="imageBox" style="width: imageWidth; height: imageHeight;">
                <div v-for="i in patchRow" :key="i">
                  <div v-for="j in patchColumn" :key="j">
                    <div
                      :class="userLabeling[(i - 1) * patchColumn + (j - 1)] == 0 ? 'labeled-border-0' : userLabeling[(i - 1) * patchColumn + (j - 1)] > 0 ? 'labeled-border' : ''"
                      :style="{ ...imageStyles, width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: ((j - 1) * borderBoxResize * zoom) + 'px', top: ((i - 1) * borderBoxResize * zoom) + 'px' }"
                      v-show="this.userLabeling[(i - 1) * patchColumn + (j - 1)] >= 0">
                      {{ this.userLabeling[(i - 1) * patchColumn + (j - 1)] }}
                    </div>
                  </div>
                </div>
                <img :src="serveOriginalImage()" ref="img"
                  :style="{ ...imageStyles, position: absolute, width: imageHeight > imageWidth ? 35 + 'vh' : auto, height: imageWidth > imageHeight ? 35 + 'vh' : auto }"
                  class="imageStyle" @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart"
                  @mouseup="handleDragEnd" @mousemove="handleDragging" />
                <div class="currentBorder"
                  :style="{ ...imageStyles, width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: leftValue * zoom + 'px', top: topValue * this.zoom + 'px' }">
                </div>
              </div>
            </div>
            <p style="font-size: 14px; margin-top: 10px;">{{ this.imageOriginalNameList[this.imageIndex] }}</p>
          </div>
          <div class="imageName">
            <div class="images">
              <div class="imageBox" style="width: imageWidth; height: imageHeight;">
                <div v-for="i in patchRow" :key="i">
                  <div v-for="j in patchColumn" :key="j">
                    <!-- 이 부분 수정(0이면 초록색으로 보이게) -->
                    <div
                      :class="userLabeling[(i - 1) * patchColumn + (j - 1)] == 0 ? 'labeled-border-0' : userLabeling[(i - 1) * patchColumn + (j - 1)] > 0 ? 'labeled-border' : ''"
                      :style="{ ...imageStyles, width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: ((j - 1) * borderBoxResize * zoom) + 'px', top: ((i - 1) * borderBoxResize * zoom) + 'px' }"
                      v-show="this.userLabeling[(i - 1) * patchColumn + (j - 1)] >= 0">
                      {{ this.userLabeling[(i - 1) * patchColumn + (j - 1)] }}
                    </div>
                  </div>
                </div>
                <img :src="serveArtifactImage()" ref="img"
                  :style="{ ...imageStyles, width: imageHeight > imageWidth ? 35 + 'vh' : auto, height: imageWidth > imageHeight ? 35 + 'vh' : auto }"
                  class="imageStyle" @wheel="handleWheel" @click="setZoomCenter" @mousedown="handleDragStart"
                  @mouseup="handleDragEnd" @mousemove="handleDragging" />
                <div class="currentBorder"
                  :style="{ ...imageStyles, width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: leftValue * zoom + 'px', top: topValue * zoom + 'px' }">
                </div>
              </div>
            </div>
            <p style="font-size: 14px; margin-top: 10px;">{{ this.imageArtifactNameList[this.imageIndex] }}</p>
          </div>
          <div style="clear:both;"></div>
        </div>
        <div class="patchbtncontainer">
          <div>
            <div class="patch-container">
              <div class="patchName">
                <div class="selected-patch-image"
                  :style="{ width: (borderBox * 2) + 'px', height: (borderBox * 2) + 'px' }">
                  <img :src="serveOriginalImage()" class="selected-patch"
                    :style="{ width: (imageWidth * 2) + 'px', height: (imageHeight * 2) + 'px', right: rightValue * 2 + 'px', bottom: bottomValue * 2 + 'px' }"
                    alt="original">
                </div>
                <label class="textLabel">original</label>
              </div>
              <div class="patchName">
                <div class="selected-patch-image"
                  :style="{ width: (borderBox * 2) + 'px', height: (borderBox * 2) + 'px' }">
                  <img :src="serveArtifactImage()" class="selected-patch"
                    :style="{ width: (imageWidth * 2) + 'px', height: (imageHeight * 2) + 'px', right: rightValue * 2 + 'px', bottom: bottomValue * 2 + 'px' }"
                    alt="denoised">
                </div>
                <label class="textLabel">denoised</label>
              </div>
              <div class="patchName">
                <div class="selected-patch-image"
                  :style="{ width: (borderBox * 2) + 'px', height: (borderBox * 2) + 'px' }">
                  <img :src="serveDifferenceImage()" class="selected-patch"
                    :style="{ width: (imageWidth * 2) + 'px', height: (imageHeight * 2) + 'px', right: rightValue * 2 + 'px', bottom: bottomValue * 2 + 'px' }"
                    alt="difference">
                </div>
                <label class="textLabel">difference</label>
              </div>
            </div>
          </div>
          <div class="btncontainer">
            <button v-for="  a   in   6  " :key="a" @click="labeling(a - 1)" class="btn-style"
              style="width: 50px; height: 40px; padding-top: 1px; font-size: x-large;"
              :class="{ 'clicked-btn-style': this.isPressed == a - 1 }">{{ buttonString[a - 1] }}</button>
          </div>
          <div class="btncontainer">
            <button class="btn-style" @click="changePreviousPage()">{{ buttonString[6] }}</button>
            <span style="margin: 0 10px;">{{ imageIndex + 1 }} / {{ imageIndexList.length }}</span>
            <button class="btn-style" @click="changeNextPage()">{{ buttonString[this.pageState] }}</button>
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
  name: 'scoringPage',
  data() {
    return {
      originalImageName: null,
      artifactImageName: null,
      openModal: true, //modal창
      progressModal: false, //progress modal창
      progressModalPage: 0,
      progressBarLength: 0,
      progressBarList: [0,], //progress bar 내용 갯수
      progressBarCount: [0,], //progress bar 내용의 한 거 개수
      modalPage: 0,
      helpPageImage: false,
      modalTitle: ["How To Use", "Examples of score 0", "Examples of score 1", "Examples of score 2", "Examples of score 3", "Examples of score 4", "Examples of score 5"],
      modalContent: [["1. Use the arrow keys to move the patch image.", "2. Press the number keys to score the patch image.", "3. Press the Prev button to go back to the previous image.", "4. Press the Next button to go to the next image.", "5. Press the Submit button to submit the score."], ["When the original and denoised images look almost same", "or you cannot feel any perceptually image quality degradation."], ["original", "denosied"], ["original", "denosied"], ["original", "denosied"], ["original", "denosied"], ["original", "denosied"]],
      imgSrc: [require("../images/score1_original.png"), require("../images/score1_denoised.png"), require("../images/score2_original.png"), require("../images/score2_denoised.png"), require("../images/score3_original.png"), require("../images/score3_denoised.png"), require("../images/score4_original.png"), require("../images/score4_denoised.png"), require("../images/score5_original.png"), require("../images/score5_denoised.png")],
      index: 0,
      imageIndex: 0,
      currentUser: this.$route.query.userName,
      testCode: this.$route.query.testcode,
      currentPage: parseInt(this.$route.query.currentPage),
      buttonString: ["0", "1", "2", "3", "4", "5", "Prev", "Next", "Submit"],
      pageState: 7,
      prevOriginalImage: null,  //이전 사진 preload
      prevArtifactImage: null,  //이전 사진 preload
      prevDifferenceImage: null,  //이전 사진 preload
      nextOriginalImage: null,  //다음 사진 preload
      nextArtifactImage: null,  //다음 사진 preload
      nextDifferenceImage: null,  //다음 사진 preload
      imageIndexList: [],
      imageOriginalNameList: [],
      imageArtifactNameList: [],
      // borderBox: 224, //Patch 이미지의 크기
      borderBox: 56, //240122 수정
      borderBoxResize: 0, //축소된 patch 이미지의 크기
      leftValue: 0, //borderBox의 left값
      topValue: 0,  //borderBox의 top값
      rightValue: 0,  //patch 이미지의 right값
      bottomValue: 0, //patch 이미지의 bottom값
      patchIndex: 0, //Patch 이미지의 인덱스
      patchLength: 0, //Patch 이미지의 총 개수
      patchColumn: 0, //Patch 이미지의 가로
      patchRow: 0, //Patch 이미지의 세로
      imageWidth: 0,  //이미지의 가로
      imageHeight: 0, //이미지의 세로
      resizeWidth: 0, //축소된 이미지의 가로
      resizeHeight: 0, //축소된 이미지의 세로
      i: 0, //patch 이미지의 세로 인덱스
      j: 0, //patch 이미지의 가로 인덱스
      // TODO: userLabeling 은 유저가 "patch"에 부여한 점수를 저장하는 배열, 
      // TODO: 따라서 전체 이미지를 리스트로 받아와서 각각이 라벨링이 되었는지 받아와야 함 
      // TODO: video scoring 에서의 getUserScoringList()와 같은 기능을 하는 함수가 필요함
      userLabeling: [],  //사용자가 부여한 점수
      userLabelingList: [], //사용자가 부여한 점수 리스트
      userLabelingCount: 0, //사용자가 부여한 점수 개수
      isPressed: -1, //눌린 점수 체크
      menuBar: 'Home',
      lastPage: false, //마지막 이미지인지 체크
      baseUrl: process.env.BASE_URL + "api/",
      // zoom 관련 변수
      dragging: false,
      dragStartX: 0,
      dragStartY: 0,
      offsetX: 0,
      offsetY: 0,
      isMouseOverMinus: false,
      isMouseOverPlus: false,
      isMouseOverPlay: false,
      // video의 index list. 안의 값은 순차적이지 않고 비디오들의 고유한 인덱스 값으로 구성
      videoIndex: [],
      zoom: 1,
      minZoom: 1,
      // video style을 바꿈으로써 줌과 offset을 조절
      imageStyles: {},
      zoomCenterX: 50,
      zoomCenterY: 50,
    }
  },

  created() {
  },

  mounted() {
    window.addEventListener('keydown', this.keydown);
    this.getImageIndexCurrentPage();
    this.getUserLabeling();
    this.getImageNameList();
    this.checkProgressBar();
    this.setProgressBar();
    this.getUserLabelingList();
    //this.preloadImage();
    window.addEventListener('resize', this.resizeImage);
    document.addEventListener('mousemove', this.handleDragging);
    document.addEventListener('mouseup', this.handleDragEnd);
  },

  unmounted() {
    window.removeEventListener('keydown', this.keydown);
  },

  methods: {
    resetZoomAndOffset() {
      this.zoom = this.minZoom;
      this.offsetX = 0;
      this.offsetY = 0;
    },
    zoomIn() {
      this.zoom += 0.2;
      this.updateImageStyle();
    },

    zoomOut() {
      if (this.zoom >= this.minZoom + 0.2) {
        this.zoom -= 0.2;
        this.updateImageStyle();
      }
    },

    setZoomCenter() {
      // 패치를 기준으로 줌 센터를 고정합니다.
      // this.zoomCenterX = this.j * this.borderBoxResize * this.zoom;
      // this.zoomCenterY = this.i * this.borderBoxResize * this.zoom;
      this.zoomCenterX = this.j * this.borderBoxResize;
      this.zoomCenterY = this.i * this.borderBoxResize;
      this.updateImageStyle();
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
      event.preventDefault()
      this.dragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    },

    handleDragging(event) {
      event.preventDefault()
      if (this.dragging) {
        // Zoom level에 따라 드래그 속도 조정
        const adjustedX = (event.clientX - this.dragStartX) / this.zoom;
        const adjustedY = (event.clientY - this.dragStartY) / this.zoom;

        this.offsetX += adjustedX;
        this.offsetY += adjustedY;

        // 초기 드래그 위치 업데이트
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;

        this.updateImageStyle();
      }
    },

    handleDragEnd() {
      this.dragging = false;
    },

    updateImageStyle() {
      let img = this.$refs.img;
      const imgNaturalWidth = img.naturalWidth;
      let currentWidth = img.width;
      this.borderBoxResize = ((this.borderBox * currentWidth) / imgNaturalWidth);

      const scale = `scale(${this.zoom})`;
      const translate = `translate(${this.offsetX}px, ${this.offsetY}px)`;

      this.imageStyles = {
        transform: `${scale} ${translate}`,
        transformOrigin: `${this.zoomCenterX}px ${this.zoomCenterY}px`,
      };
      this.setPatch(this.i, this.j);
    },

    resetZoomAndOffset() {
      this.zoom = this.minZoom;
      this.offsetX = 0;
      this.offsetY = 0;
    },

    setProgressBar() {
      this.progressBarLength = Math.ceil(this.imageIndexList.length / 100);
      this.progressBarList = [];
      for (var i = 0; i < this.progressBarLength; i++) {
        if (i == this.progressBarLength - 1) {
          this.progressBarList.push(this.imageIndexList.length % 100);
        } else {
          this.progressBarList.push(100);
        }
      }
      this.checkProgressBar();
    },

    toggleHelpModal() {
      this.openModal = !this.openModal;
    },

    toggleProgressModal(index) {
      this.progressModal = !this.progressModal;
      this.progressModalPage = index;
    },

    checkProgressBar() {
      for (let i = 0; i < this.progressBarLength; i++) {
        this.userLabelingCount = 0;
        this.progressBarCount[i] = 0;
        for (let j = 0; j < this.progressBarList[i]; j++) {
          if (this.userLabelingList[(i * 100) + j] == true) {
            this.progressBarCount[i]++;
          }
          else this.userLabelingCount++;
        }
        if (this.userLabelingCount == this.progressBarList[i]) this.progressBarCount[i] = -1;
      }
    },

    //TODO: progress bar를 진행도에 따라 class를 바꾸는 함수
    getProgressBarClass(index) {
      const progress = this.progressBarCount[index]; //한 것 개수
      const total = this.progressBarList[index]; //전체 개수

      if (progress == total) {
        return 'progressBar-item'; // 다 했을 때
      } else if (progress >= total * 0.7) {
        return 'progressBar-item-1'; // 70% 이상 했을 때
      } else if (progress >= total * 0.35) {
        return 'progressBar-item-2'; // 35% 이상 했을 때
      } else {
        return 'progressBar-item-empty';
      }
    },

    changeModal(flag) {
      if (flag == 0) {
        if (this.modalPage == 0) {
          this.modalPage = this.modalTitle.length - 1;
        } else {
          this.modalPage--;
        }
      } else {
        if (this.modalPage == this.modalTitle.length - 1) {
          this.modalPage = 0;
        } else {
          this.modalPage++;
        }
      }
    },

    helpPageImageNum(index) {
      this.helpPageImage = !this.helpPageImage;
      if (this.helpPageImage == false) {
        return this.imgSrc[index + 1];
      }
      return this.imgSrc[index];
    },

    //진행상황 페이지에서 페이지 이동
    async changePage(index) {
      this.currentPage = this.imageIndexList[index - 1];
      console.log("[changePage] currentPage: " + this.currentPage);
      this.imageIndex = index - 1;
      console.log("[changePage] imageIndex: " + this.imageIndex);
      console.log("[changePage] imageIndexList: " + this.imageIndexList);
      this.isPressed = [false, false, false, false, false, false]
      await this.$router.push({
        path: '/label/label',
        query: {
          currentPage: this.currentPage,
          userName: this.currentUser,
          testcode: this.testCode,
        }
      });
      // this.getImageIndexCurrentPage();
      this.getUserLabeling();
      this.makeImageTemplete();
      this.i = 0;
      this.j = 0;
      this.setProgressBar();
      this.checkProgressBar();
      this.getUserLabelingList();
    },

    serveOriginalImage() {
      return String(this.baseUrl + "postimage/original/" + (this.currentPage))
    },

    serveArtifactImage() {
      return String(this.baseUrl + "postimage/artifact/" + (this.currentPage))
    },

    serveDifferenceImage() {
      return String(this.baseUrl + "postimage/difference/" + (this.currentPage))
    },

    // async preloadImage() {
    //   if (this.currentPage === 0) {
    //     this.nextOriginalImage = new Image();
    //     this.nextArtifactImage = new Image();
    //     this.nextDifferenceImage = new Image();
    //     this.nextOriginalImage.src = String(this.baseUrl + "postimage/original/" + (this.currentPage + 1));
    //     this.nextArtifactImage.src = String(this.baseUrl + "postimage/artifact/" + (this.currentPage + 1));
    //     this.nextDifferenceImage.src = String(this.baseUrl + "postimage/difference/" + (this.currentPage + 1));
    //   }
    //   else if (this.currentPage === this.imageIndexList.length - 1) {
    //     this.prevOriginalImage = new Image();
    //     this.prevArtifactImage = new Image();
    //     this.prevDifferenceImage = new Image();
    //     this.prevOriginalImage.src = String(this.baseUrl + "postimage/original/" + (this.currentPage - 1));
    //     this.prevArtifactImage.src = String(this.baseUrl + "postimage/artifact/" + (this.currentPage - 1));
    //     this.prevDifferenceImage.src = String(this.baseUrl + "postimage/difference/" + (this.currentPage - 1));
    //   }
    //   else {
    //     this.nextOriginalImage = new Image();
    //     this.nextArtifactImage = new Image();
    //     this.nextDifferenceImage = new Image();
    //     this.nextOriginalImage.src = String(this.baseUrl + "postimage/original/" + (this.currentPage + 1));
    //     this.nextArtifactImage.src = String(this.baseUrl + "postimage/artifact/" + (this.currentPage + 1));
    //     this.nextDifferenceImage.src = String(this.baseUrl + "postimage/difference/" + (this.currentPage + 1));
    //     this.prevOriginalImage = new Image();
    //     this.prevArtifactImage = new Image();
    //     this.prevDifferenceImage = new Image();
    //     this.prevOriginalImage.src = String(this.baseUrl + "postimage/original/" + (this.currentPage - 1));
    //     this.prevArtifactImage.src = String(this.baseUrl + "postimage/artifact/" + (this.currentPage - 1));
    //     this.prevDifferenceImage.src = String(this.baseUrl + "postimage/difference/" + (this.currentPage - 1));
    //   }
    // },
    // Backend에서 patch size(행렬) 가져오는 method
    getImageIndexCurrentPage() {
      let temp = String(this.currentPage);
      console.log(temp);
      axios
        .post(this.baseUrl + "getImageIndexCurrentPage", {
          userID: this.currentUser,
          testcode: this.testCode,
        })
        .then((response) => {
          console.log("[getImageIndexCurrentPage] response.data.current_page: " + response.data.current_page)
          console.log("[getImageIndexCurrentPage] response.data.image_list.length: " + response.data.image_list.length)
          this.imageIndexList = response.data.image_list;
          if (this.currentPage <= 0 || this.currentPage > response.data.image_list.length - 1) {
            this.currentPage = response.data.current_page; //url로 접근하는데 범위 밖일 때
          }
          else if (response.data.current_page < 0) {
            this.currentPage = 0; //유저의 데이터가 없을 때 0번째로
          }
          else if (response.data.current_page >= 0 && this.currentPage == response.data.current_page) {
            this.currentPage = temp; //마지막으로 한 페이지
          }

          // currentPage를 받아서 labeling 이미지를 만듦
          // cuurentPage에 따라 imageID가 달라져서 이를 반영하기 위해 axios를 받은 후에 makeImageTemplete()를 호출함
          // makeImageTemplete()에서는 labeling 이미지를 만드는 함수임

          for (let i = 0; i < this.imageIndexList.length; i++) {
            if (this.imageIndexList[i] == this.currentPage) {
              this.imageIndex = i;
              break;
            }
          }

          console.log("[getImageIndexCurrentPage] before route current page is " + this.currentPage);
          this.$router.push({
            query: {
              userName: this.currentUser,
              currentPage: this.currentPage,
              testcode: this.testCode
            }
          });
          this.makeImageTemplete();
        })
        .catch((error) => {
          console.log(error);
          alert("login failed")
          this.$router.push(process.env.BASE_URL);
        })
    },
    makeImageTemplete() {
      this.getImageSize()
        .then(() => {
          this.resizeImage();
        })
        .catch((error) => {
          console.error(error);
        });
    },

    //TODO: nameList를 가져오는 함수
    getImageNameList() {
      axios
        .post(this.baseUrl + "imageNameList", {
          user_id: this.currentUser,
          testcode: this.testCode,
        })
        .then((response) => {
          console.log("[getImageNameList] axios get image list success\n");
          console.log("[getImageNameList] response.data.image_list\n" + response.data.image_list)
          this.imageIndexList = response.data.image_list;
          this.imageOriginalNameList = response.data.original_list;
          this.imageArtifactNameList = response.data.artifact_list;
          this.findIndex();
          this.checkProgressBar();
          // this.removeSuffix();
        })
        .catch((error) => {
          console.log(error);
        })
    },

    //홈으로 가게 하는 함수
    navigateTo(item) {
      if (item == 'Home') {
        this.$router.push('/');
      } else {
        alert("Still developed")
      }
    },

    //사용자의 전체 레이블링 데이터 가져오는 함수
    getUserLabelingList() {
      axios
        .post(this.baseUrl + "getUserLabelingList", {
          user_id: this.currentUser,
          testcode: this.testCode,
        })
        .then((response) => {
          this.userLabelingList = response.data.userLabelingList;
          this.setProgressBar();
        })
        .catch((error) => {
          console.log(error);
        })

    },

    //라벨링 여부에 따라 userLabeling 가져오는 함수
    getUserLabeling() {
      console.log("[getUserLabeling] get current page is " + this.currentPage)
      let temp = parseInt(this.currentPage);
      axios
        .post(this.baseUrl + "getUserImageScore", {
          current_user: this.currentUser,
          image_id: temp,
        })
        //Backend에서 들어간 iamge_id의 다음 id를 가져오는 기능이 내장됨
        //따라서 그 다음 image_id값에 접근함
        .then((response) => {
          if (this.userLabelingList[this.imageIndex] == true) { //r
            console.log("[getUserLabeling] axios get label image success\n");
            console.log("[getUserLabeling] patch data\n" + response.data.patch)
            this.userLabeling = response.data.patch;
            this.isPressed = this.userLabeling[this.patchIndex];
            return;
          }
          else {
            this.userLabeling = [];
            this.isPressed = this.userLabeling[this.patchIndex];
          }
          this.checkProgressBar();
        })
        .catch((error) => {
          console.log(error);
        })
    },

    // 이미지의 사이즈를 구하는 함수
    // getImgaeSize를 Promise를 반환하는 함수로 변경
    getImageSize() {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = this.serveOriginalImage();

        let self = this;
        img.onload = function () {
          // 이미지 로딩 완료시 로직
          self.imageWidth = img.width;
          self.imageHeight = img.height;

          self.patchColumn = (Math.floor(self.imageWidth / self.borderBox) + 1);
          self.patchRow = (Math.floor(self.imageHeight / self.borderBox) + 1);
          self.patchLength = self.patchColumn * self.patchRow;
          self.setPatch(self.i, self.j);

          resolve(); // Promise가 성공적으로 완료됨
        };

        img.onerror = function () {
          reject(new Error("이미지 로드 실패")); // 이미지 로드 실패시
        };
      });
    },

    // resizeImage 함수
    resizeImage() {
      console.log(this.imageWidth, this.imageHeight)
      if (this.imageWidth)
        this.resizeWidth = this.imageWidth * 0.2;
      this.resizeHeight = this.imageHeight * 0.2;
      let img = this.$refs.img;
      const imgNaturalWidth = img.naturalWidth;
      let currentWidth = img.width;
      this.borderBoxResize = (this.borderBox * currentWidth) / imgNaturalWidth;
    },

    // progress bar의 개수를 구하는 함수
    // countProgressBar() {
    //   this.progressBarLength = 0;
    //   if (this.imageIndexList.length % 100 == 0 ? this.progressBarLength = this.imageIndexList.length / 100 : this.progressBarLength = Math.floor(this.imageIndexList.length / 100) + 1);
    //   for (let i = 0; i < this.progressBarLength; i++) {
    //     if (i == this.progressBarLength - 1) {
    //       this.progressBarList.push(this.imageIndexList.length % 100);
    //     }
    //     else {
    //       this.progressBarList.push(100);
    //     }
    //   }
    // },

    //patch 이미지의 위치를 조정하는 함수
    setPatch(i, j) {
      if (j < 0) { //<-화살표 방향
        if (i <= 0) this.i = this.patchRow - 1; //맨 윗줄일 때
        else this.i--;
        this.j = this.patchColumn - 1;
      } else if (j > this.patchColumn - 1) { //->화살표 방향
        if (i >= this.patchRow - 1) this.i = 0;
        else this.i++;
        this.j = 0;
      } else if (i < 0) { //^ 방향
        this.i = this.patchRow - 1;
      } else if (i > this.patchRow - 1) { //v 방향
        this.i = 0;
      }
      this.rightValue = this.j * this.borderBox; //patch 이미지의 위치값
      this.bottomValue = this.i * this.borderBox; //patch 이미지의 위치값
      this.leftValue = this.j * this.borderBoxResize; //borderBox의 위치값
      this.topValue = this.i * this.borderBoxResize;  //borderBox의 위치값
      this.patchIndex = this.j + (this.i * this.patchColumn); //patch 이미지의 인덱스
    },

    //키보드 이벤트 함수
    keydown(e) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.changeBackPatchImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.changeNextPatchImage();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.changeUpImage();
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.changeDowmImage();
          break;
        case '0':
          this.labeling(0);
          break;
        case '1':
          this.labeling(1);
          break;
        case '2':
          this.labeling(2);
          break;
        case '3':
          this.labeling(3);
          break;
        case '4':
          this.labeling(4);
          break;
        case '5':
          this.labeling(5);
          break;
      }
    },

    //테두리 주는 함수
    addBorder(index) {
      let i = Math.floor(index / this.patchColumn);
      let j = index % this.patchColumn;
      if (this.userLabeling[index] > 0) {
        return { left: j * this.borderBox + 'px', top: i * this.borderBox + 'px' };
      }
      return {};
    },

    // 점수 부여 및 다음 Patch 이미지로 변경
    labeling(num) {
      console.log("index: " + this.patchIndex);
      this.userLabeling[this.patchIndex] = num;
      this.isPressed = this.userLabeling[this.patchIndex];
      setTimeout(() => {
        this.changeNextPatchImage()
      }, 500); //0.5초 후에 다음 patch로 넘어감
    },

    changeNextPatchImage() {
      this.setPatch(this.i, ++this.j);
      this.isPressed = this.userLabeling[this.patchIndex];
    },

    // 이전 patch로 변경
    changeBackPatchImage() {
      this.setPatch(this.i, --this.j);
      this.isPressed = this.userLabeling[this.patchIndex];
    },

    //위 화살표 누르면 한 줄 위로 올라가는 method
    changeUpImage() {
      this.setPatch(--this.i, this.j);
      this.isPressed = this.userLabeling[this.patchIndex];
    },

    //아래 화살표 누르면 한 줄 아래로 내려가는 method
    changeDowmImage() {
      this.setPatch(++this.i, this.j);
      this.isPressed = this.userLabeling[this.patchIndex];
    },

    //부여된 점수 back-end로 전송
    postUserLabeling() {
      for (let i = 0; i < this.patchLength; i++) {
        if (this.userLabeling[i] == undefined) this.userLabeling[i] = -1;
      }
      console.log(this.userLabeling);
      console.log("[postUserLabeling] current page is " + this.currentPage)
      let temp = parseInt(this.currentPage);
      axios
        .post(this.baseUrl + "postimagedata", {
          current_user: this.currentUser,
          image_id: temp,
          test_code: this.testCode,
          score: this.userLabeling,
        })
        .then((response) => {
          console.log("[postUserLabeling] response.data: " + response.data)
          //사용자가 입력한 데이터가 없을 경우
        })
        .catch((error) => {
          console.log(error);
        })
    },

    changePreviousPage() {
      this.pageState = 7;
      if (this.imageIndex == 0) {
        this.postUserLabeling();
        alert("this is first image");
      }
      else {
        this.postUserLabeling();
        this.imageIndex -= 1;
        this.i = 0;
        this.j = 0;
        this.currentPage = this.imageIndexList[this.imageIndex];
        this.$refs.img = this.prevImage;
        this.makeImageTemplete();
        this.getUserLabeling();
        //this.preloadImage();
        this.setProgressBar();
        this.checkProgressBar();
        this.getUserLabelingList();
        this.$router.push({
          query: {
            userName: this.currentUser,
            currentPage: this.currentPage,
            testcode: this.testCode
          }
        });
        this.resetZoomAndOffset();
      }
    },

    changeNextPage() {
      if (this.imageIndex >= this.imageIndexList.length - 1) {
        this.postUserLabeling();
        alert("this is last page");
      } else {
        if (this.imageIndex == this.imageIndexList.length - 2) this.pageState = 8;
        this.postUserLabeling();
        this.imageIndex += 1;
        this.i = 0;
        this.j = 0;
        this.currentPage = this.imageIndexList[this.imageIndex];
        this.$refs.img = this.nextImage;
        this.makeImageTemplete();
        this.getUserLabeling();
        //this.preloadImage();
        this.setProgressBar();
        this.checkProgressBar();
        this.getUserLabelingList();
        this.$router.push({
          query: {
            userName: this.currentUser,
            currentPage: this.currentPage,
            testcode: this.testCode
          }
        });
        this.resetZoomAndOffset();
      }
    },

    findIndex() {
      for (let i = 0; i < this.imageIndexList.length; i++) {
        if (this.imageIndexList[i] == this.currentPage) {
          this.imageIndex = i;
          break;
        }
      }
      console.log("[findIndex] index is " + this.imageIndex);
      this.currentPage = this.imageIndexList[this.imageIndex];
    },
  }
}
</script>

<style>
@import '../main.css';
</style>
