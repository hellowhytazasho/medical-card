const config = require('config');
const axios = require('axios');

const logger = require('../logger')('vkApi');
const { HttpError } = require('../errors');

const { vkApp: { secretKey: VK_APP_TOKEN } } = config;

// eslint-disable-next-line camelcase
async function getUserImage(vk_user_id) {
  try {
    const url = `https://api.vk.com/method/users.get?user_ids=${vk_user_id}&fields=photo_200_orig&access_token=${VK_APP_TOKEN}&v=5.122`;
    const resp = axios.get(url);
    const respData = resp.data;
    logger.info(respData);
  } catch (error) {
    throw new HttpError({
      message: 'City not found in weather api DB',
      code: 400,
    });
  }
}

module.exports = getUserImage;
