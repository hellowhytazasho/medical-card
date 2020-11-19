const config = require('config');
const axios = require('axios');
const { parse } = require('date-fns');

const { HttpError } = require('../errors');

const { vkApp: { token: VK_APP_TOKEN } } = config;
const BAD_LENGTH = 4;

async function getVKUserData(userId) {
  try {
    const url = `https://api.vk.com/method/users.get?lang=ru&user_ids=${userId}&fields=photo_200_orig,sex,bdate&access_token=${VK_APP_TOKEN}&v=5.122`;
    const resp = await axios.get(url);
    const respData = resp.data;

    const bday = respData.response[0].bdate;
    console.log(bday);
    let birthday;

    if (bday) {
      if (bday.length <= BAD_LENGTH) {
        // eslint-disable-next-line no-unused-expressions
        birthday = null;
      } else {
        birthday = parse(bday, 'd.MM.yyyy', Date.now()).toString();
      }
    } else {
      birthday = null;
    }


    const userData = {
      userName: `${respData.response[0].first_name} ${respData.response[0].last_name}`,
      photo: respData.response[0].photo_200_orig,
      sex: respData.response[0].sex,
      birthday,
    };
    return userData;
  } catch (error) {
    throw new HttpError({
      message: 'User id not found in VK',
      code: 400,
    });
  }
}

module.exports = getVKUserData;
