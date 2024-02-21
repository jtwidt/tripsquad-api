const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const getLocationInfo = async (req, res) => {
  const { keyword } = req.body;
  let response;

  try {
    response = await amadeus.referenceData.locations.get({
      keyword,
      subType: Amadeus.location.any,
    });
  } catch (error) {
    return res.status(400).send(error);
  }

  return res
    .status(200)
    .send({ count: response.result.meta.count, locations: response.data });
};

module.exports = {
  getLocationInfo,
};
