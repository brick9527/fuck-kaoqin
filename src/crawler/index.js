const puppeteer = require('puppeteer');

const { formatForm } = require('../libs/format_form');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://10.8.2.25/');

  await page.$eval('input[name=username]', el => {
    el.value = 'fand';
    return el;
  });

  await page.$eval('input[name=password]', el => {
    el.value = 'fd123\\=-';
    return el;
  });

  await page.click('.btn-login');
  // const scrfToken = await page.$eval('input[name=csrfmiddlewaretoken]', el => el.value);

  const form = await page.$eval('#dataTable tbody', el => el.innerText.split(/\s/));
  // await page.screenshot({ path: 'example.png' });
  const formData = formatForm(form.slice(0, 15));

  // dataHandler(formData);
  console.log(formData);

  await browser.close();
})();
