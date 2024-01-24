import { mount } from "@vue/test-utils";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import YourComponent from "../../src/page/homePage.vue"; // Your Vue 컴포넌트 파일 경로로 대체해야 합니다.
import ScoringPage from "../../src/page/scoringPage.vue"; // Your Vue 컴포넌트 파일 경로로 대체해야 합니다.

describe("Home page", () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    wrapper = mount(YourComponent);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore(); // 모든 테스트 이후에 Axios Mock을 초기화합니다.
  });

  it("should handle a successful login", async () => {
    // 모의 Axios 요청을 설정합니다.
    mock.onPost(wrapper.vm.baseUrl + "api/login").reply(200, {
      path: "scoring",
      lastPage: 1,
    });

    // 데이터 입력 및 로그인 버튼 클릭
    wrapper.setData({
      userId: "testuser",
      password: "testpassword",
      testcode: "12345",
    });
    await wrapper.vm.submitLoginAction();

    // 예상대로 동작하는지 확인합니다.
    // expect(wrapper.vm.currentUser).toBe("testuser");
    expect(wrapper.vm.currentPage).toBe(1);
    // 기타 테스트할 내용 추가

    // 필요한 Assertions을 추가합니다.
  });
});

describe("Scoring page", () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    wrapper = mount(ScoringPage);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore(); // 모든 테스트 이후에 Axios Mock을 초기화합니다.
  });

  it("", async () => {
    // 모의 Axios 요청을 설정합니다.
    mock.onPost(wrapper.vm.baseUrl + "getVideoIndexCurrentPage").reply(200, {
      videoList: [1, 2, 3],
      originalVideoNameList: [
        "original_video1",
        "original_video2",
        "original_video3",
      ],
      artifactVideoNameList: [
        "artifact_video1",
        "artifact_video2",
        "artifact_video3",
      ],
      originalVideoFPSList: ["30", "30", "30"],
      artifactVideoFPSList: ["30", "30", "30"],
      curScore: 1,
    });

    // 데이터 입력 및 로그인 버튼 클릭
    wrapper.setData({
      userID: "testuser",
      testcode: "testcode",
      currentPage: "1",
    });
    await wrapper.vm.getVideoIndexCurrentPage();

    // 예상대로 동작하는지 확인합니다.
    expect(wrapper.vm.isPressed[1]).toBe(true);
    expect(wrapper.vm.clickedButton).toBe(1);
    expect(wrapper.vm.videoIndex).toBe([1, 2, 3]);
    expect(wrapper.vm.leftOriginalVideo()).toBe(
      wrapper.vm.baseUrl + "postvideo/original/1"
    );
    // 기타 테스트할 내용 추가
  });
});
