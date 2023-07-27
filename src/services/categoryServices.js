const db = require('../models/index')
const { Op } = require('sequelize');

const handleGetAllChildCategory = async () => {
    try {
        const data = await db.Category.findAll({
            where: {
                parentID: {
                [Op.not]: null
            }}
        })
        return {
            code: 0,
            msg: 'Successfully',
            data
        }
    } catch (err) {
        return err
    }
}

module.exports = {
    handleGetAllChildCategory
}