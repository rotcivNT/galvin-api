const voucherServices = require('../services/voucherServices');

const getAllVoucher = async (req, res) => {
  try {
    const data = await voucherServices.handleGetAllVoucher();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getVoucherByCode = async (req, res) => {
  try {
    const data = await voucherServices.handleGetVoucherByCode(req.params.code);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

module.exports = {
  getAllVoucher,
  getVoucherByCode,
};
