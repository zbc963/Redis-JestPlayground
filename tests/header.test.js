const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page');

// test('Adds two number',()=>{
//   const sum = 1 + 2;

//   expect(sum).toEqual(3);

// });

let page;

beforeEach(async ()=>{
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

// afterEach( async ()=>{
//   await page.close();
// })

test('the header has the correct text', async ()=>{
  // const text = await page.$eval('a.brand-logo',el=>el.innerHTML);
  const text = await page.getContentOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async()=>{
  await page.click('.right a');
  const url = await page.url();

  expect(url).toMatch('/accounts\.google\.com/')
})

test('when signed in, shows logout button', async ()=>{
  const user = await userFactory();
  const {session, sig} = sessionFactory(user);

  await page.setCookie({ name: 'session', value: session});
  await page.setCookie({ name: 'session.sig', value: sig});
  await page.goto('http://localhost:3000');

  //direct use will cause our page is not currently finished yet and fail the check
  // const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  await page.waitFor('a[href="/auth/logout"]');
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout');
})