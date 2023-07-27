const db = require('../models/index');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { v4: uuidv4 } = require('uuid');

function generateOrderID() {
  const prefix = 'ORD';
  const timestamp = Date.now();
  const orderID = `${prefix}${timestamp}`;
  return orderID;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL_APP_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

const confirmUrl = (token, orderID) => {
  return `http://localhost:3000/confirm/order/token=${token}&orderID=${orderID}`;
};

const sendGmail = async (receiver, url, customerName) => {
  const info = await transporter.sendMail({
    from: '"Galvin 👻" <ngocthang.devweb@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: 'Xác nhận đơn hàng bạn đã đặt', // Subject line
    text: 'Vui lòng xác nhận đơn hàng bạn đã đặt', // plain text body
    html: `
    <div>
      <h3>GALVIN <span>👻</span></h3>
      <p>Thông báo xác nhận đơn hàng</p>
      <p>Xin chào ${customerName}, bạn vừa đặt một đơn hàng trên web của chúng tôi, Hãy 
      click vào nút xác nhận bên dưới để xác nhận việc đặt hàng</p>
      <a style="text-decoration: none; padding: 12px 25px; background-color: #1666a2; color: #fff; font-size: 16px; 
      min-width: 100px; border-radius: 4px; display: inline-block; text-align: center;" 
      target="_blank"
      href=${url}>Xác nhận</a>
    </div>
    `, // html body
  });
};

const handleGetAllOrder = async () => {
  try {
    const data = await db.Order.findAll();
    return {
      code: 0,
      msg: 'Successfully',
      data,
    };
  } catch (e) {
    return { errCode: -1, errMessage: 'Server error!' };
  }
};

const handleCreateOrder = async (data) => {
  const token = uuidv4();
  const orderID = generateOrderID();
  const orderDate = Date.now().toString();
  const {
    paymentMethod,
    totalDue,
    shippedAddress,
    customerName,
    customerPhone,
    products,
    email,
  } = data;
  try {
    const data = await db.Order.create({
      employeeID: null,
      orderID,
      orderDate,
      status: 'Processing',
      paymentMethod,
      totalDue,
      shippedAddress,
      customerName,
      customerPhone,
      token,
    });
    if (data) {
      const promises = products.map(async (product) => {
        await db.OrderDetail.create({
          productID: product.productID,
          quantity: product.quantity,
          orderID: data.orderID,
          unitPrice: product.price,
          totalPrice: product.price * product.quantity,
        });
      });
      await Promise.all(promises);
      const url = confirmUrl(token, data.orderID);
      await sendGmail(email, url, customerName);
      return {
        code: 0,
        msg: 'Successfully',
      };
    } else {
      return {
        code: 1,
        msg: 'Error!',
      };
    }
  } catch (e) {
    return { errCode: -1, errMessage: 'Server error!' };
  }
};

const handleAcceptOrder = async ({ token, orderID }) => {
  try {
    const data = await db.Order.update(
      {
        status: 'Shipped',
      },
      {
        where: {
          orderID,
          token,
          status: 'Processing',
        },
      },
    );
    if (data[0]) {
      return {
        code: 0,
        msg: 'Successfully',
      };
    } else {
      return {
        code: 1,
        msg: 'Error!',
      };
    }
  } catch (e) {
    return e;
  }
};

const handleGetOrderDetails = async (orderID) => {
  try {
    const data = await db.OrderDetail.findAll({
      where: {
        orderID,
      },
      include: [
        {
          model: db.Product,
        },
      ],
    });
    if (!data) {
      return {
        code: 1,
        msg: 'Error!',
      };
    }
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
  handleGetAllOrder,
  handleCreateOrder,
  handleAcceptOrder,
  handleGetOrderDetails,
};
