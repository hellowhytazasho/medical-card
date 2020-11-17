const config = require('config');
const axios = require('axios');

const { HttpError } = require('../errors');

const { vkApp: { token: VK_APP_TOKEN } } = config;

async function getVKUserData(userId) {
  try {
    const url = `https://api.vk.com/method/users.get?lang=ru&user_ids=${userId}&fields=photo_200_orig,sex,bdate&access_token=${VK_APP_TOKEN}&v=5.122`;
    const resp = await axios.get(url);
    const respData = resp.data;

    const userData = {
      userName: `${respData.response[0].first_name} ${respData.response[0].last_name}`,
      photo: respData.response[0].photo_200_orig,
      sex: respData.response[0].sex,
      birthday: respData.response[0].bdate,
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
