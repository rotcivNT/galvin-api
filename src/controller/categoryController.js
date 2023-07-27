const categoryServices = require('../services/categoryServices')

const getAllChildCategory = async (req, res) => {
    try {
        const data = await categoryServices.handleGetAllChildCategory();
        return res.status(200).json(data)
      } catch (err) {
        return res.status(200).json({ errCode: -1, errMessage: "Server error!" });
      }
}

module.exports = {
  getAllChildCategory
}