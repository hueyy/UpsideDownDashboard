import axios from 'axios'
import cheerio from 'cheerio'

class SingaporePower {

  static getTariff = async () => {
    const { data } = await axios.get(`https://www.spgroup.com.sg/what-we-do/billing`)
    const $ = cheerio.load(data)

    const electricityTariff = $(`.row.tariff-stats-wrapper > .col-sm-4.match-height > p`).text().trim().slice(0, 5)
    return electricityTariff
  }
}

export default SingaporePower