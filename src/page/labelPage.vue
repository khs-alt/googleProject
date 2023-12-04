<template>
  <div class="labelingPage">
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
      <p style="font-size: 24px; margin-top: 10px;">Patch Ghosting Artifact Labeling System</p>
      <div class="labelcontainer">
        <div :class="this.imageWidth <= 1080 ? 'imagecontainer' : 'imagecontainer-column'">
          <div class="imageName">
            <div class="images">
              <div v-for="i in patchRow" :key="i">
                <div v-for="j in patchColumn" :key="j">
                  <div class="labeled-border"
                    :style="{ width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: (j - 1) * borderBoxResize + 'px', top: (i - 1) * borderBoxResize + 'px' }"
                    v-show="this.userLabeling[(i - 1) * patchColumn + (j - 1)] > 0">
                    {{ this.userLabeling[(i - 1) * patchColumn + (j - 1)] }}
                  </div>
                </div>
              </div>
              <img :src="serveOriginalImage()" ref="img"
                :style="{ width: resizeWidth + 'px', height: resizeHeight + 'px' }" class="imageStyle" />
              <div class="currentBorder"
                :style="{ width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: leftValue + 'px', top: topValue + 'px' }">
              </div>
            </div>
            <p style="font-size: 14px; margin-top: 10px;">{{ this.imageOriginalNameList[this.imageIndex] }}</p>
          </div>
          <div class="imageName">
            <div class="images">
              <div v-for="i in patchRow" :key="i">
                <div v-for="j in patchColumn" :key="j">
                  <div class="labeled-border"
                    :style="{ width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: (j - 1) * borderBoxResize + 'px', top: (i - 1) * borderBoxResize + 'px' }"
                    v-show="this.userLabeling[(i - 1) * patchColumn + (j - 1)] > 0">
                    {{ this.userLabeling[(i - 1) * patchColumn + (j - 1)] }}
                  </div>
                </div>
              </div>
              <img :src="serveArtifactImage()" ref="img"
                :style="{ width: resizeWidth + 'px', height: resizeHeight + 'px' }" class="imageStyle" />
              <div class="currentBorder"
                :style="{ width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: leftValue + 'px', top: topValue + 'px' }">
              </div>
            </div>
            <p style="font-size: 14px; margin-top: 10px;">{{ this.imageOriginalNameList[this.imageIndex] }}</p>
          </div>
          <div style="clear:both;"></div>
        </div>
        <div class="patchbtncontainer">
          <div>
            <div class="patch-container">
              <div class="patchName">
                <div class="selected-patch-image" :style="{ width: borderBox + 'px', height: borderBox + 'px' }">
                  <img :src="serveOriginalImage()" class="selected-patch"
                    :style="{ right: rightValue + 'px', bottom: bottomValue + 'px' }" alt="original">
                </div>
                <label class="textLabel">original</label>
              </div>
              <div class="patchName">
                <div class="selected-patch-image" :style="{ width: borderBox + 'px', height: borderBox + 'px' }">
                  <img :src="serveArtifactImage()" class="selected-patch"
                    :style="{ right: rightValue + 'px', bottom: bottomValue + 'px' }" alt="artifact">
                </div>
                <label class="textLabel">artifact</label>
              </div>
              <div class="patchName">
                <div class="selected-patch-image" :style="{ width: borderBox + 'px', height: borderBox + 'px' }">
                  <img :src="serveDifferenceImage()" class="selected-patch"
                    :style="{ right: rightValue + 'px', bottom: bottomValue + 'px' }" alt="difference">
                </div>
                <label class="textLabel">difference</label>
              </div>
            </div>
          </div>
          <div class="btncontainer">
            <button v-for="  a   in   6  " :key="a" @click="labeling(a - 1)" class="scoreButton"
              :class="{ 'pressed': this.isPressed === a - 1 }">{{ buttonString[a - 1] }}</button>
          </div>
          <div class="btncontainer">
            <button class="scoreButton" @click="changePreviousPage()">{{ buttonString[6] }}</button>
            <span style="margin: 0 10px;">{{ imageIndex + 1 }} / {{ imageIndexList.length }}</span>
            <button class="scoreButton" @click="changeNextPage()">{{ buttonString[this.pageState] }}</button>
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
  name: 'scoringPage',
  data() {
    return {
      index: 0,
      imageIndex: 0,
      currentUser: this.$route.query.userName,
      testCode: this.$route.query.testcode,
      currentPage: parseInt(this.$route.query.currentPage),
      buttonString: ["0", "1", "2", "3", "4", "5", "Prev", "Next", "Submit"],
      pageState: 7,
      clickedArrowBtn: false,
      prevOriginalImage: null,  //이전 사진 preload
      prevArtifactImage: null,  //이전 사진 preload
      prevDifferenceImage: null,  //이전 사진 preload
      nextOriginalImage: null,  //다음 사진 preload
      nextArtifactImage: null,  //다음 사진 preload
      nextDifferenceImage: null,  //다음 사진 preload
      imageIndexList: [],
      imageOriginalNameList: [],
      imageArtifactNameList: [],
      borderBox: 224, //Patch 이미지의 크기
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
      userLabeling: [],  //사용자가 부여한 점수
      isPressed: -1, //눌린 점수 체크
      menuBar: 'Home',
      lastPage: false, //마지막 이미지인지 체크
      baseUrl: process.env.BASE_URL + "api/",
    }
  },

  created() {
  },

  mounted() {
    window.addEventListener('keydown', this.keydown);
    this.getImageIndexCurrentPage();
    this.getUserLabeling();
    this.getImageNameList();
    this.preloadImage();
  },

  unmounted() {
    window.removeEventListener('keydown', this.keydown);
  },

  methods: {
    serveOriginalImage() {
      return String(this.baseUrl + "postimage/original/" + (this.currentPage))
    },

    serveArtifactImage() {
      return String(this.baseUrl + "postimage/artifact/" + (this.currentPage))
    },

    serveDifferenceImage() {
      return String(this.baseUrl + "postimage/difference/" + (this.currentPage))
    },

    preloadImage() {
      if (this.currentPage === 0) {
        this.nextOriginalImage = new Image();
        this.nextArtifactImage = new Image();
        this.nextDifferenceImage = new Image();
        this.nextOriginalImage.src = String(this.baseUrl + "postimage/original/" + (this.currentPage + 1));
        this.nextArtifactImage.src = String(this.baseUrl + "postimage/artifact/" + (this.currentPage + 1));
        this.nextDifferenceImage.src = String(this.baseUrl + "postimage/difference/" + (this.currentPage + 1));
      }
      else if (this.currentPage === this.imageIndexList.length - 1) {
        this.prevOriginalImage = new Image();
        this.prevArtifactImage = new Image();
        this.prevDifferenceImage = new Image();
        this.prevOriginalImage.src = String(this.baseUrl + "postimage/original/" + (this.currentPage - 1));
        this.prevArtifactImage.src = String(this.baseUrl + "postimage/artifact/" + (this.currentPage - 1));
        this.prevDifferenceImage.src = String(this.baseUrl + "postimage/difference/" + (this.currentPage - 1));
      }
      else {
        this.nextOriginalImage = new Image();
        this.nextArtifactImage = new Image();
        this.nextDifferenceImage = new Image();
        this.nextOriginalImage.src = String(this.baseUrl + "postimage/original/" + (this.currentPage + 1));
        this.nextArtifactImage.src = String(this.baseUrl + "postimage/artifact/" + (this.currentPage + 1));
        this.nextDifferenceImage.src = String(this.baseUrl + "postimage/difference/" + (this.currentPage + 1));
        this.prevOriginalImage = new Image();
        this.prevArtifactImage = new Image();
        this.prevDifferenceImage = new Image();
        this.prevOriginalImage.src = String(this.baseUrl + "postimage/original/" + (this.currentPage - 1));
        this.prevArtifactImage.src = String(this.baseUrl + "postimage/artifact/" + (this.currentPage - 1));
        this.prevDifferenceImage.src = String(this.baseUrl + "postimage/difference/" + (this.currentPage - 1));
      }
    },
    // Backend에서 patch size(행렬) 가져오는 method
    async getImageIndexCurrentPage() {
      await axios
        .post(this.baseUrl + "getImageIndexCurrentPage", {
          userID: this.currentUser,
          testcode: this.testCode,
        })
        .then((response) => {
          console.log(response.data)
          console.log(response.data.image_list.length)
          if (this.currentPage <= 0 || this.currentPage > response.data.image_list.length - 1) {
            this.currentPage = response.data.current_page; //url로 접근하는데 범위 밖일 때
          }
          else if (response.data.current_page < 0) {
            this.currentPage = 0; //유저의 데이터가 없을 때 0번째로
          }
          else if (response.data.current_page >= 0 && this.currentPage === response.data.current_page) {
            this.currentPage = response.data.current_page + 1; //마지막으로 한 페이지
          }

          // currentPage를 받아서 labeling 이미지를 만듦
          // cuurentPage에 따라 imageID가 달라져서 이를 반영하기 위해 axios를 받은 후에 makeImageTemplete()를 호출함
          // makeImageTemplete()에서는 labeling 이미지를 만드는 함수임
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
          //console.log("resizeImage")
        })
        .catch((error) => {
          console.error(error);
        });
    },

    //TODO: nameList를 가져오는 함수
    getImageNameList() {
      axios
        .post(this.baseUrl + "imageNameList", {
          testcode: this.testCode,
        })
        .then((response) => {
          console.log("axios get image list success\n");
          console.log(response.data.image_list)
          this.imageIndexList = response.data.image_list;
          this.imageOriginalNameList = response.data.original_list;
          this.imageArtifactNameList = response.data.artifact_list;
          this.findIndex();
        })
        .catch((error) => {
          console.log(error);
        })
    },

    //홈으로 가게 하는 함수
    navigateTo(item) {
      if (item === 'Home') {
        this.$router.push('/');
      } else {
        alert("Still developed")
      }
    },

    //라벨링 여부에 따라 userLabeling 가져오는 함수
    getUserLabeling() {
      console.log("get current page is " + this.currentPage)
      axios
        .post(this.baseUrl + "getUserImageScore", {
          current_user: this.currentUser,
          image_id: this.currentPage,
        })
        //Backend에서 들어간 iamge_id의 다음 id를 가져오는 기능이 내장됨
        //따라서 그 다음 image_id값에 접근함
        .then((response) => {
          console.log(response.data)
          if (response.data.patch[0] != -1) { //r
            console.log("axios get label image success\n");
            // console.log("id is " + this.currentPage)
            console.log(response.data.patch)
            this.userLabeling = response.data.patch;
            this.isPressed = this.userLabeling[this.patchIndex];
            return;
          }
          else {
            this.userLabeling = [];
            this.isPressed = this.userLabeling[this.patchIndex];
          }
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
      this.resizeWidth = this.imageWidth * 0.25;
      this.resizeHeight = this.imageHeight * 0.25;
      this.borderBoxResize = this.borderBox * 0.25;
    },

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
          this.clickedArrowBtn = true;
          e.preventDefault();
          this.changeBackPatchImage();
          break;
        case 'ArrowRight':
          this.clickedArrowBtn = true;
          e.preventDefault();
          this.changeNextPatchImage();
          break;
        case 'ArrowUp':
          this.clickedArrowBtn = true;
          e.preventDefault();
          this.changeUpImage();
          break;
        case 'ArrowDown':
          this.clickedArrowBtn = true;
          e.preventDefault();
          this.changeDowmImage();
          break;
        case '0':
          this.clickedArrowBtn = true;
          this.labeling(0);
          break;
        case '1':
          this.clickedArrowBtn = true;
          this.labeling(1);
          break;
        case '2':
          this.clickedArrowBtn = true;
          this.labeling(2);
          break;
        case '3':
          this.clickedArrowBtn = true;
          this.labeling(3);
          break;
        case '4':
          this.clickedArrowBtn = true;
          this.labeling(4);
          break;
        case '5':
          this.clickedArrowBtn = true;
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
      this.changeNextPatchImage();
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
        if (this.userLabeling[i] === undefined && this.clickedArrowBtn === true) {
          this.userLabeling[i] = 0;
        }
        else this.userLabeling[i] = -1;
      }
      console.log(this.userLabeling);
      console.log("current page is " + this.currentPage)
      axios
        .post(this.baseUrl + "postimagedata", {
          current_user: this.currentUser,
          image_id: this.currentPage,
          test_code: this.testCode,
          score: this.userLabeling,
        })
        .then((response) => {
          console.log(response.data)
          //사용자가 입력한 데이터가 없을 경우
        })
        .catch((error) => {
          console.log(error);
        })
    },

    changePreviousPage() {
      this.pageState = 7;
      if (this.imageIndex === 0) {
        this.postUserLabeling();
        alert("this is first image");
      }
      else {
        this.postUserLabeling();
        this.imageIndex -= 1;
        this.i = 0;
        this.j = 0;
        this.currentPage = this.imageIndexList[this.imageIndex];
        this.clickedArrowBtn = false;
        this.$refs.img = this.prevImage;
        this.makeImageTemplete();
        this.getUserLabeling();
        this.preloadImage();
        this.$router.push({
          query: {
            userName: this.currentUser,
            currentPage: this.currentPage,
            testcode: this.testCode
          }
        });
      }
    },


    changeNextPage() {
      if (this.imageIndex >= this.imageIndexList.length - 1) {
        this.postUserLabeling();
        alert("this is last page");
      } else {
        if (this.imageIndex === this.imageIndexList.length - 2) this.pageState = 8;
        this.postUserLabeling();
        this.imageIndex += 1;
        this.i = 0;
        this.j = 0;
        this.currentPage = this.imageIndexList[this.imageIndex];
        this.clickedArrowBtn = false;
        this.$refs.img = this.nextImage;
        this.makeImageTemplete();
        this.getUserLabeling();
        this.preloadImage();
        this.$router.push({
          query: {
            userName: this.currentUser,
            currentPage: this.currentPage,
            testcode: this.testCode
          }
        });
      }
    },

    findIndex() {
      for (let i = 0; i < this.imageIndexList.length; i++) {
        if (this.imageIndexList[i] === this.currentPage) {
          this.imageIndex = i;
          break;
        }
      }
      console.log("index is " + this.imageIndex);
    },
  }
}
</script>

<style>
@import '../main.css';
</style>