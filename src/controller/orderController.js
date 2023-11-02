const orderServices = require('../services/orderServices');

const getAllOrder = async (req, res) => {
  try {
    const data = await orderServices.handleGetAllOrder();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const createOrder = async (req, res) => {
  try {
    const data = await orderServices.handleCreateOrder(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!', err: e });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const data = await orderServices.handleAcceptOrder(req.query);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const data = await orderServices.handleGetOrderDetails(req.params.orderID);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getOrderByUserID = async (req, res) => {
  try {
    const data = await orderServices.handleGetOrderByUserID(req.params.userID);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
}

module.exports = {
  getAllOrder,
  createOrder,
  acceptOrder,
  getOrderDetails,
  getOrderByUserID
};
