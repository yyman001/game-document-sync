const request = require('request')
const cheerio = require('cheerio')

export interface fullGameTable {
  title: string;
  content: string;
}

export const fullGame = (steamId:string):Promise<Array<fullGameTable>|null> => {
  return new Promise<Array<fullGameTable>|null>((resolve, reject) => {
    request(
      {
        // eg: https://www.pcgamingwiki.com/api/appid.php?appid=1245620
        url: `https://www.pcgamingwiki.com/api/appid.php?appid=${steamId}`,
        proxy: 'http://127.0.0.1:7890'
      },
      function (error: any, response: { statusCode: number }, body: any) {
        const table: Array<fullGameTable> = []

        if (!error && response.statusCode === 200) {
          const $ = cheerio.load(body)
          const saveLocations = $('#table-gamedata')

          saveLocations.each(function () {
            const tr = $(this).find('tr')
            tr.each(function () {
              const title = $(this).children().eq(0).text().replace(/^\s+|\s+$/g, '')
              const content = $(this).children().eq(1).text().replace(/^\s+|\s+$/g, '')

              table.push({
                title,
                content
              })
            })
          })

          resolve(table)
          return
        }

        resolve(null)
      }
    )
  })
}
