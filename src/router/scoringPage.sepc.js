import { shallowMount } from '@vue/test-utils';
import scoring from './page/scoringPage.vue';

describe('scoringPage.vue', () => {
  it('비디오가 제대로 랜더링 되는지', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
