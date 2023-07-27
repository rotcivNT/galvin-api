const db = require('../models/index');

const handleGetAllVoucher = async () => {
  try {
    const data = await db.Voucher.findAll();
    return {
      code: 0,
      msg: 'Successfully',
      data,
    };
  } catch (e) {
    return e;
  }
};

const handleGetVoucherByCode = async (code) => {
  try {
    const data = await db.Voucher.findOne({
      where: {
        code,
      },
    });
    return {
      code: 0,
      msg: 'Successfully',
      data,
    };
  } catch (e) {
    return e;
  }
};

module.exports = {
  handleGetAllVoucher,
  handleGetVoucherByCode,
};
