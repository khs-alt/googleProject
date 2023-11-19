<template>
  <div class="menu">
    <button class="btn-style" @click="navigateTo(this.menuBar)">{{ this.menuBar }}</button>
  </div>
  <div class="labelContainor">
    <div class="imageContainor">
      <!-- <div class="image-grid-wrapper">
        <div class="image-grid">
          <div v-for="(item, index) in originalPatchImageList" :key="index"
            :class="addBorder(index)"
            class="image-grid-item">
            <img :src="item" class="imageStyle" />
          </div>
        </div>
      </div>
      <div class="image-grid-wrapper">
        <div class="image-grid">
          <div v-for="(item, index) in artifactPatchImageList" :key="index"
            :class="addBorder(index)"
            class="image-grid-item">
            <img :src="item" class="imageStyle" />
          </div>
        </div>
      </div> -->
      <div class="images">
        <img :src="originalImage" ref="img" :style="{width: resizeWidth + 'px', height: resizeHeight + 'px'}" class="imageStyle" />
        <div class="currentBorder"
          :style="{ width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: leftValue + 'px', top: topValue + 'px' }">
        </div>
      </div>
      <div class="images">
        <img :src="artifactImage" ref="img" :style="{width: resizeWidth + 'px', height: resizeHeight + 'px'}" class="imageStyle" />
        <div class="currentBorder"
          :style="{ width: borderBoxResize + 'px', height: borderBoxResize + 'px', left: leftValue + 'px', top: topValue + 'px' }">
        </div>
      </div>
      <div style="clear:both;"></div>
    </div>
    <div class="patchbtnContainor">
      <div>
        <div class="patch-container">
          <div class="selected-patch-image">
            <img :src="originalImage" class="selected-patch" :style="{ right: rightValue + 'px', bottom: bottomValue + 'px' }"
              alt="original">
          </div>
          <label>: original</label>
          <div class="selected-patch-image">
            <img :src="artifactImage" class="selected-patch" :style="{ right: rightValue + 'px', bottom: bottomValue + 'px' }"
              alt="artifact">
          </div>
          <label>: artifact</label>
        </div>
      </div>
      <div class="btnContainor">
        <button v-for="a in 6" :key="a" @click="labeling(a - 1)" class="scoreButton"
          :class="{ 'pressed': this.isPressed === a - 1 }">{{ buttonString[a - 1]
          }}</button>
      </div>
      <div class="btnContainor">
        <button class="scoreButton" @click="changeBackImage()">Previous Page</button>
        <button class="scoreButton" @click="changeNextImage()">Next Page</button>
      </div>
    </div>
  </div>
</template>



<script>
import axios from 'axios'
export default {
  name: 'scoringPage',
  data() {
    return {
      buttonString: ["0", "1", "2", "3", "4", "5"],
      originalPatchImageList: [],
      artifactPatchImageList: [],
      originalImage: require('../images/addPadding.png'),
      artifactImage: require('../images/addPadding.png'),
      //patchImageList: [require('../images/1.jpg'), require('../images/1.jpg')], //Patch 이미지 리스트
      borderBox: 144, //Patch 이미지의 크기
      borderBoxResize: 0, //축소된 patch 이미지의 크기
      leftValue: 0, //borderBox의 left값
      topValue: 0,  //borderBox의 top값
      rightValue: 0,  //patch 이미지의 right값
      bottomValue: 0, //patch 이미지의 bottom값
      patchSize: [], //Patch 이미지의 사이즈(총 개수, 가로, 세로)
      patchIndex: 0, //Patch 이미지의 인덱스
      patchLength: 0, //Patch 이미지의 총 개수
      patchColumn: 0, //Patch 이미지의 가로
      patchRow: 0, //Patch 이미지의 세로
      imageWidth: 0,  //이미지의 가로
      imageHeight: 0, //이미지의 세로
      resizeWidth: 0, //축소된 이미지의 가로
      resizeHeight: 0, //축소된 이미지의 세로
      i: 0, //patch 이미지의 가로 인덱스
      j: 0, //patch 이미지의 세로 인덱스
      userLabeling: [],  //사용자가 부여한 점수
      isPressed: -1, //눌린 점수 체크
      clickedButton: 0, //눌린 버튼 체크
      isClicked: false, //버튼이 눌렸는지 체크
      menuBar: 'Home',
      currentPage: 0, //현재 이미지의 번호
      lastPage: false, //마지막 이미지인지 체크
      baseUrl: "http://localhost:8000",
    }
  },
  created() {
    this.getImages();
  },
  mounted() {
    this.getPatchImagesTemp();
    this.getImgaeSize();
    this.resizeImage();
    window.addEventListener('keydown', this.keydown);
  },
  unmounted() {
    window.removeEventListener('keydown', this.keydown);
  },

  methods: {
    //이미지의 사이즈를 구하는 함수
    getImgaeSize() {
      let img = new Image();
      img.src = this.originalImage;
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      this.patchColumn = Math.floor(this.imageWidth / this.borderBox);
      this.patchRow = Math.floor(this.imageHeight / this.borderBox);
      this.patchLength = this.patchColumn * this.patchRow;
      this.setPatch(this.i, this.j);

      console.log("원래 이미지 사이즈");
      console.log(this.imageWidth);
      console.log(this.imageHeight);
      console.log(this.patchColumn);
      console.log(this.patchRow);
      console.log(this.patchLength);
    },

    resizeImage() {
      this.resizeWidth = this.imageWidth * 0.25;
      this.resizeHeight = this.imageHeight * 0.25;
      this.borderBoxResize = this.borderBox * 0.25;
      console.log("축소된 이미지 사이즈");
      console.log(this.resizeWidth);
      console.log(this.resizeHeight);
    },


    //patch 이미지의 위치를 조정하는 함수
    setPatch(i, j) {
      if (i < 0) { //<-화살표 방향
        if (j <= 0) this.j = this.patchRow; //맨 윗줄일 때
        else this.j--;
        this.i = this.patchColumn - 1;
        console.log("왼쪽으로가!");
      } else if (i > this.patchColumn - 1) { //->화살표 방향
        if (j >= this.patchRow) this.j = 0;
        else this.j++;
        this.i = 0;
        console.log("오른쪽으로가!");
      } else if (j < 0) { //^ 방향
        this.j = this.patchRow;
        console.log("위로가!");
      } else if (j > this.patchRow) { //v 방향
        this.j = 0;
        console.log("아래로가!");
      }
      console.log("i: " + this.i + " j: " + this.j);
      this.rightValue = this.i * this.borderBox; //patch 이미지의 위치값
      this.bottomValue = this.j * this.borderBox; //patch 이미지의 위치값
      this.leftValue = this.i * this.borderBoxResize; //borderBox의 위치값
      this.topValue = this.j * this.borderBoxResize;  //borderBox의 위치값
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
      if (this.patchIndex === index) {
        return 'highlight-border';
      } else if (this.userLabeling[index] > 0) {
        return 'labeling-complate';
      } else {
        return '';
      }
    },

    // TODO: 임시로 로컬에서 patch 이미지 가져오는 method 백엔드 연결하면 삭제하기
    // 임시로 로컬에서 patch 이미지 가져오는 method
    async getPatchImagesTemp() {
      for (let i = 0; i < this.patchRow; i++) {
        for (let j = 0; j < this.patchColumn; j++) {
          let image = require(`../images/patches/original/denoised_frame_0001_30000_patch_${i}_${j}.png`)
          this.originalPatchImageList.push(image)

        }
      }
      for (let i = 0; i < this.patchRow; i++) {
        for (let j = 0; j < this.patchColumn; j++) {
          let image = require(`../images/patches/artifact/denoised_frame_0002_30000_patch_${i}_${j}.png`)
          this.artifactPatchImageList.push(image)
        }
      }
    },

    // Backend에서 patch size(행렬) 가져오는 method
    // TODO: 백엔드 연결 필요
    getPatchSize() {
      axios
        .get(this.baseUrl + `/patchsize`)
        .then((response) => {
          console.log("axios get patch size success\n");
          this.patchSize = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
    },
    //TODO: Backend에서 patch image 가져오는 method 백엔드 연결 필요 
    getPatchImages() {
      axios
        .get(this.baseUrl + `/patch`)
        .then((response) => {
          console.log("axios get patch image success\n");
          this.patchImageList = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
    },
    // TODO: 백엔드 연결 필요 
    getPatchIndex() {
      axios
        .get(this.baseUrl + `/patchindex`)
        .then((response) => {
          console.log("axios get patch index success\n");
          this.patchIndex = response.data;
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

    // Backend에서 greed image 가져오는 method
    getImages() {
      axios
        .get(this.baseUrl + `/label/` + this.currentPage, {})
        .then((response) => {
          console.log("axios get label image success\n");
          this.imageList = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
    },

    // 점수 부여 및 다음 Patch 이미지로 변경
    labeling(num) {
      console.log(this.patchIndex);
      this.userLabeling[this.patchIndex] = num;
      console.log(this.userLabeling);
      if (this.patchIndex + 1 >= this.patchLength) {
        alert("this is last patch image");
      } else this.changeNextPatchImage();
    },

    changeNextPatchImage() {
      // this.patchIndex = this.patchIndex + 1 > this.patchLength - 1 ? 0 : this.patchIndex + 1;
      // console.log(this.patchIndex);

      // if (this.userLabeling[this.patchIndex] >= 0) {
      //   this.isPressed = this.userLabeling[this.patchIndex];
      //   return;
      // }

      // this.isPressed = -1;
      this.setPatch(++this.i, this.j);
    },

    // 이전 이미지로 변경
    changeBackPatchImage() {
      // this.patchIndex = this.patchIndex - 1 < 0 ? this.patchLength - 1 : this.patchIndex - 1;
      // console.log(this.patchIndex);
      // if (this.userLabeling[this.patchIndex] >= 0) {
      //   this.isPressed = this.userLabeling[this.patchIndex];
      //   return;
      // }

      // this.isPressed = this.userLabeling[this.patchIndex];
      this.setPatch(--this.i, this.j);
    },

    //위 화살표 누르면 한 줄 위로 올라가는 method
    changeUpImage() {
      // if (this.patchIndex - this.patchColumn <= 0) {
      //   this.patchIndex = this.patchLength - (this.patchColumn - this.patchIndex);
      // } else {
      //   this.patchIndex -= this.patchColumn;
      // }

      // this.isPressed = this.userLabeling[this.patchIndex];
      this.setPatch(this.i, --this.j);
    },

    //아래 화살표 누르면 한 줄 아래로 내려가는 method
    changeDowmImage() {
      // if (this.patchIndex + this.patchColumn >= this.patchLength) {
      //   this.patchIndex = this.patchColumn - (this.patchLength - this.patchIndex);
      // } else {
      //   this.patchIndex += this.patchColumn;
      // }

      // this.isPressed = this.userLabeling[this.patchIndex];
      this.setPatch(this.i, ++this.j);
    },

    //부여된 점수 back-end로 전송
    postUserLabeling() {
      for (let i = 0; i < this.patchLength; i++) {
        if (this.userLabeling[i] === undefined) {
          this.userLabeling[i] = 0;
        }
      }
      console.log(this.userLabeling);

      axios
        .post(this.baseUrl + `/label/` + this.currentPage, {
          data: this.userLabeling
        })
        .then((response) => {
          console.log(response);
          this.userLabeling = [];
        })
        .catch((error) => {
          console.log(error);
        })
    },

    changeBackImage() {
      if (this.currentPage === 0) {
        alert("this is first image");
      } else {
        this.currentPage -= 1;
        this.getImages();
      }
    },

    changeNextImage() {
      if (this.currentPage >= this.patchLength) {
        alert("this is last image");
      } else {

        this.postUserLabeling();
        this.currentPage += 1;
        this.getImages();
      }
    },

    //TODO: 누르면 다시 해제되게 바꾸기
    // score button 눌렸는지 안눌렸는지 확인하는 버튼
    toggleButton(index) {
      this.isPressed = index;
    },
  }
}
</script>

<style>
@import '../main.css';
</style>
