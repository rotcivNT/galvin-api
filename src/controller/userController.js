const userServices = require('../services/userServices');

const createUser = async (req, res) => {
  try {
    const data = await userServices.handleCreateUser(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const checkUserLogin = async (req, res) => {
  try {
    const data = await userServices.handleCheckUserLogin(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const data = await userServices.handleAddProductToCart(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const deleteProductToCart = async (req, res) => {
  try {
    const data = await userServices.handleDeleteProductToCart(req.params.id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getProductCart = async (req, res) => {
  try {
    const data = await userServices.handleGetProductCart(req.params.userID);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const deleteProductCartByUserID = async (req, res) => {
  try {
    const data = await userServices.handleDeleteProductCartByUserID(
      req.params.userID,
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

module.exports = {
  createUser,
  checkUserLogin,
  addProductToCart,
  deleteProductToCart,
  getProductCart,
  deleteProductCartByUserID,
};
