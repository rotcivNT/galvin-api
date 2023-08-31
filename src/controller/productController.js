const productServices = require('../services/productServices');

const addNewProduct = async (req, res) => {
  try {
    const data = await productServices.handleAddNewProduct(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getAllColor = async (req, res) => {
  try {
    const data = await productServices.handleGetAllColor();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getAllSize = async (req, res) => {
  try {
    const data = await productServices.handleGetAllSize();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const data = await productServices.handleGetAllProduct();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const data = await productServices.handleUpdateProduct(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const data = await productServices.handleGetAllCategory();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getFirstProductByCateLog = async (req, res) => {
  try {
    const data = await productServices.handleGetFirstProductByCateLog(
      req.params.id,
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getNewProduct = async (req, res) => {
  try {
    const data = await productServices.handleGetNewProduct();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getProductByID = async (req, res) => {
  try {
    const data = await productServices.handleGetProductByID(req.params.id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getProductByCount = async (req, res) => {
  try {
    const data = await productServices.handleGetProductByCount(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const getAllProductByCategory = async (req, res) => {
  try {
    const query = {
      limit: req.query.limit,
      offset: req.query.offset,
    }
    const data = await productServices.handleGetAllProductByCategory(req.body, query);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
};

const searchProduct = async (req, res) => {
  try {
    const data = await productServices.handleSearchProduct(req.query.q);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ errCode: -1, errMessage: 'Server error!' });
  }
}

module.exports = {
  addNewProduct,
  getAllColor,
  getAllSize,
  getAllProduct,
  updateProduct,
  getAllCategory,
  getFirstProductByCateLog,
  getNewProduct,
  getProductByID,
  getProductByCount,
  getAllProductByCategory,
  searchProduct
};
