import Page from './Page';
import {Meeting, menuWaitTime} from '../constants';
import enterTime from '../helpers/enterTime';

class PreMeeting extends Page {
  get createMeetingButton() {
    return $('#create-meeting-button');
  }
  get inputStart() {
    return $('#start');
  }
  get inputEnd() {
    return $('#end');
  }
  get inputTitle() {
    return $('#title');
  }
  get inputDescription() {
    return $('#description');
  }


  async createMeeting(meeting:Meeting) {
    await this.menu.click();
    const {start, end, title, description} = meeting;
    await this.createMeetingButton.waitForClickable({timeout: menuWaitTime});
    await this.createMeetingButton.click();
    // await this.setValue(browser, await this.inputStart, start);
    // await this.setValue(browser, await this.inputEnd, end);
    await enterTime(browser, await this.inputStart, start);
    await enterTime(browser, await this.inputEnd, end);
    await this.setValue(browser, await this.inputTitle, title);
    await this.setValue(browser, await this.inputDescription, description);
    await this.btnSubmit.click();
  }
}

export default new PreMeeting();