import path from 'path';
import deleteValue from '../helpers/deleteValue';

/* eslint-disable valid-jsdoc */
const url = 'http://localhost:3000';
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/

export type ParamBrowser = WebdriverIO.Browser | WebdriverIO.MultiRemoteBrowser
export default class Page {
  internalBrowser: WebdriverIO.MultiRemoteBrowser

  constructor(paramBrowser?: WebdriverIO.MultiRemoteBrowser ) {
    this.internalBrowser = paramBrowser?? browser;
  }

  /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
  async open(path?: string) {
    return this.internalBrowser.url(path?? url);
  }
  get notification() {
    return $('#notistack-snackbar');
  }
  get menu() {
    // return $('#menu/-button');
    return $('#menu-button');
  }
  get inputFileUpload() {
    const fileUpload = $('#input-file-upload');
    this.internalBrowser.execute(
        (el:any) => el.style.display = 'block',
        fileUpload,
    );
    return fileUpload;
  }
  get btnSubmit() {
    return $('button[type="submit"]');
  }
  get logoutButton() {
    return $('#logout-button');
  }
  async clearValue(browser, selector) {
    await deleteValue(browser, selector);
  }
  async setValue(browser, selector, value) {
    await this.clearValue(browser, selector);
    await selector.setValue(value);
  }
  async joinPath(filePath:string) {
    return path.join(__dirname, filePath);
  }
  async logout() {
    await this.open();
    await this.internalBrowser.keys(['Escape']);
    await this.menu.waitForClickable({timeout: 1000});
    await this.menu.click();
    try {
      await this.logoutButton.waitForClickable({timeout: 1000});
      await this.logoutButton.click();
    } catch (e) {
      await this.open();
    }
  }
}
