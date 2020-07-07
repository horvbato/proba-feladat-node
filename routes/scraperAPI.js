var express = require("express");
var router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');

router.post("/", function(req, resp) {

  async function scrape() {
    const goalUrl = 'https://blog.risingstack.com/'
    const linkArray = []
    const finishedArray = []
    const postsNumber = req.body.number
    let numberOfPages = null

    
    axios(goalUrl)
      .then(res => {
        const html = res.data
        const $ = cheerio.load(html)
        const pageNumber = $('nav.pagination span').text().split('')
        const pageNumberLength = pageNumber.length - 1
        numberOfPages = pageNumber[pageNumberLength]
        
        if(postsNumber > numberOfPages || postsNumber < 1) {
          console.log('nem jo a szam')
        } else {
          for(let i = 1; i < postsNumber + 1; i++) {
            const url = 'https://blog.risingstack.com/page/'+i
            axios(url)
            .then(res => {
                const html = res.data
                const $$ = cheerio.load(html)
                $$('.post-header .post-title a').each((i, link) => {
                  const href = link.attribs.href
                  linkArray.push(href)
                })
              })
              .finally(() => {
                linkArray.forEach((item) => {
                  axios('https://blog.risingstack.com'+item)
                  .then(res => {
                      const _a = []
                      const html = res.data
                      const $$$ = cheerio.load(html)
                      $$$('h1').each((i, heading) => {
                        _a.push({'type': 'h1', 'content': $(heading).text()})
                      })
                      $$$('h2').each((i, heading) => {
                        _a.push({'type': 'h2', 'content': $(heading).text()})
                      })
                      $$$('h3').each((i, heading) => {
                        _a.push({'type': 'h3', 'content': $(heading).text()})
                      })
                      $$$('h4').each((i, heading) => {
                        _a.push({'type': 'h4', 'content': $(heading).text()})
                      })
                      finishedArray.push(_a)
                    })
                    .catch(console.error)
                    // .finally(() => {
                      //   resp.status(200).send(finishedArray)
                      // that.res.send(finishedArray)
                      // this.res.send(finishedArray)
                      // })
                    })
                  })
          }
        }
      })
      .catch(console.error)
      
      // console.log(finishedArray)
      let result = await finishedArray
      setTimeout(function(){ console.log(finishedArray) }, 6000);
  }


});

module.exports = router;