const db = require('../models/index');
const { Op } = require('sequelize');

const handleCreateUser = async (data) => {
  const { fullName, phone, email, password } = data;
  try {
    const [user, created] = await db.User.findOrCreate({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
      defaults: {
        fullName,
        phone,
        email,
        password,
        role: 'R2',
      },
    });
    if (!created) {
      return {
        code: 1,
        msg: 'Email hoặc SĐT đã đăng ký',
      };
    } else {
      return {
        code: 0,
        msg: 'Successfully',
      };
    }
  } catch (e) {
    return e;
  }
};

const handleCheckUserLogin = async (data) => {
  try {
    const { email, password } = data;
    const user = await db.User.findOne({
      where: {
        email,
        role: 'R2',
      },
    });
    if (!user) {
      return {
        code: 1,
        msg: 'Email không tồn tại',
      };
    }
    if (password === user.password) {
      return {
        code: 0,
        msg: 'Successfully',
        data: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
        },
      };
    }
    return {
      code: 0,
      msg: 'Mật khẩu không chính xác',
    };
  } catch (e) {
    return e;
  }
};

const handleAddProductToCart = async (data) => {
  try {
    console.log(data);
    const {
      userID,
      productID,
      quantity,
      sizeValue,
      colorValue,
      price,
      thumbnail,
      productName,
      saleOff,
    } = data;
    const isExist = await db.Cart.findOne({
      where: {
        userID,
        productID,
        sizeValue,
        colorValue,
      },
    });
    if (isExist) {
      await db.Cart.update(
        {
          quantity: quantity + isExist.quantity,
        },
        {
          where: {
            userID,
            productID,
            sizeValue,
            colorValue,
          },
        },
      );
      return {
        code: 0,
        msg: 'Successfully',
      };
    } else {
      await db.Cart.create({
        userID,
        productID,
        quantity,
        sizeValue,
        colorValue,
        price,
        thumbnail,
        productName,
        saleOff,
      });
      return {
        code: 0,
        msg: 'Successfully',
      };
    }
  } catch (e) {
    return e;
  }
};

const handleDeleteProductToCart = async (id) => {
  try {
    await db.Cart.destroy({
      where: {
        id,
      },
    });
    return {
      code: 0,
      msg: 'Successfully',
    };
  } catch (e) {
    return e;
  }
};

const handleGetProductCart = async (userID) => {
  try {
    const data = await db.Cart.findAll({
      where: {
        userID,
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

const handleDeleteProductCartByUserID = async (userID) => {
  try {
    await db.Cart.destroy({
      where: {
        userID,
      },
    });
    return {
      code: 0,
      msg: 'Successfully',
    };
  } catch (e) {
    return e;
  }
};

module.exports = {
  handleCreateUser,
  handleCheckUserLogin,
  handleAddProductToCart,
  handleDeleteProductToCart,
  handleGetProductCart,
  handleDeleteProductCartByUserID,
};
