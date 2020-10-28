const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build(){
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);


    return new Proxy(customPage, {
      get: function(target, property){
        return customPage[property] ||  browser[property] || page[property];
      }
    })
  }

  constructor(page, browser){
    this.page = page;
    this.browser = browser;
  }

  async login(){
    const user = await userFactory();
    const {session, sig} = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session});
    await this.page.setCookie({ name: 'session.sig', value: sig});
    await this.page.goto('http://localhost:3000/blogs');

    //direct use will cause our page is not currently finished yet and fail the check
    // const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    await this.page.waitFor('a[href="/auth/logout"]');

  }

  async getContentOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }
}

module.exports = CustomPage;