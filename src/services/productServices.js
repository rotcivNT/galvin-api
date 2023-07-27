const db = require('../models/index');
const { uploadFileFB } = require('../utils/uploadFileFB');

function generateProductCode() {
  var prefix = 'GVCL';
  var currentTime = new Date();
  var timeString = currentTime.getTime().toString(); // Chuyển thời gian hiện tại thành chuỗi số
  var randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0'); // Số ngẫu nhiên từ 0 đến 9999, đảm bảo có 4 chữ số
  var productCode = prefix + timeString + randomDigits;
  return productCode;
}

const handleAddNewProduct = async (data) => {
  try {
    const productID = generateProductCode();
    const {
      productName,
      description,
      price,
      saleOff,
      categoryID,
      variantData,
    } = data;
    if (
      !productName ||
      !description ||
      !price ||
      !saleOff ||
      !categoryID ||
      variantData.length === 0
    ) {
      return {
        code: 1,
        msg: 'Missing params !',
      };
    }
    // Add to Product Table
    let promises;
    const directory = variantData[0].fileList[0].name;
    const res = await uploadFileFB(variantData[0].fileList[0], directory);
    const [product, inserted] = await db.Product.findOrCreate({
      where: { productID },
      defaults: {
        productName,
        description,
        price: +price,
        saleOff: +saleOff,
        categoryID: +categoryID,
        thumbnail: res,
      },
    });
    // Add to Product_Variant + Upload image to S3 Bucket
    variantData.forEach((dataItem) => {
      dataItem.sizeList.forEach(async (sizeItem) => {
        await db.Product_Variant.create({
          productID,
          colorID: dataItem.colorID,
          sizeID: sizeItem,
          qtyStock: dataItem.qtyStock,
        });
      });
      promises = dataItem.fileList.map(async (file) => {
        const res = await uploadFileFB(file, directory);
        try {
          await db.Product_Gallery.create({
            productID,
            colorID: dataItem.colorID,
            imagePath: res,
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
    await Promise.all(promises);
    return {
      code: 0,
      msg: 'Successfully',
    };
  } catch (err) {
    return err;
  }
};

const handleGetAllColor = async () => {
  try {
    const data = await db.Color.findAll({
      order: [['createdAt', 'ASC']],
    });
    return {
      code: 0,
      msg: 'Successfully',
      data,
    };
  } catch (err) {
    return err;
  }
};

const handleGetAllSize = async () => {
  try {
    const data = await db.Size.findAll();
    return {
      code: 0,
      msg: 'Successfully',
      data,
    };
  } catch (err) {
    return err;
  }
};

const handleGetAllProduct = async () => {
  try {
    const data = await db.Product.findAll();
    return {
      code: 0,
      msg: 'Successfully',
      data,
    };
  } catch (err) {
    return err;
  }
};

const handleUpdateProduct = async (data) => {
  try {
    const {
      productID,
      productName,
      description,
      price,
      saleOff,
      categoryID,
      colorID,
      sizeList,
      qtyStock,
      fileList,
    } = data;
    if (
      !productName ||
      !description ||
      !price ||
      !saleOff ||
      !categoryID ||
      !colorID ||
      sizeList.length === 0 ||
      !qtyStock
    ) {
      return {
        code: 1,
        msg: 'Missing params !',
      };
    }
    // Update Table Product
    const updateProduct = await db.Product.update(
      {
        productName,
        description,
        price,
        saleOff,
        categoryID,
      },
      { where: { productID } },
    );

    // Update Color
    const product = await db.Product_Variant.findOne({
      where: {
        productID,
        colorID,
      },
    });

    let promises;

    if (product) {
      // Update Product Variants + Gallery
      sizeList.forEach(async (sizeItem) => {
        await db.Product_Variant.update(
          {
            sizeID: sizeItem,
            qtyStock: qtyStock,
          },
          {
            where: {
              productID,
              colorID,
            },
          },
        );
      });
      promises = fileList[0].fileList.map(async (file) => {
        try {
          console.log('still');
          await db.Product_Gallery.update(
            {
              productID,
              colorID: colorID,
              imagePath: res,
            },
            {
              where: {
                productID,
                colorID,
              },
            },
          );
        } catch (err) {
          return err;
        }
      });
      return {
        code: 0,
        msg: 'Successfully',
      };
    } else {
      sizeList.forEach(async (sizeItem) => {
        await db.Product_Variant.create({
          productID,
          colorID,
          sizeID: sizeItem,
          qtyStock: qtyStock,
        });
      });
      promises = await fileList[0].fileList.map(async (file) => {
        try {
          console.log('still in');
          await db.Product_Gallery.create({
            productID,
            colorID: colorID,
            imagePath: res,
          });
        } catch (err) {
          return err;
        }
      });
    }
    await Promise.all(promises);
    return {
      code: 0,
      msg: 'Successfully',
    };
  } catch (err) {
    return err;
  }
};

const handleGetAllCategory = async () => {
  try {
    const data = await db.Category.findAll();
    return {
      code: 0,
      msg: 'Successfully',
      data,
    };
  } catch (err) {
    return err;
  }
};

const handleGetFirstProductByCateLog = async (catelogId) => {
  try {
    const data = await db.Product.findAll({
      where: { categoryID: catelogId },
      // include: [
      //   {
      //     model: db.Product_Variant,
      //     as: 'Variant',
      //   },
      //   {
      //     model: db.Product_Gallery,
      //     as: 'Gallery',
      //   },
      // ],
    });
    return {
      code: 0,
      msg: 'Successfully',
      data,
    };
  } catch (err) {
    return err;
  }
};

const handleGetNewProduct = async () => {
  try {
    const data = await db.Product.findAll({
      order: [['createdAt', 'DESC']],
      limit: 8,
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

const handleGetProductByID = async (id) => {
  try {
    const data = await db.Product.findOne({
      where: { id },
      include: [
        {
          model: db.Product_Gallery,
          as: 'Gallery',
        },
        {
          model: db.Product_Variant,
          as: 'Variant',
        },
      ],
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

const handleGetProductByCount = async ({ count, id }) => {
  try {
    // id -> id auto incre của product
    const product = await db.Product.findOne({
      where: { id },
    });
    const data = await db.Product.findAll({
      where: {
        categoryID: product.categoryID,
      },
      limit: +count,
    });
    return {
      code: 0,
      msg: 'Successfull',
      data,
    };
  } catch (e) {
    return e;
  }
};

const handleGetAllProductByCategory = async (payload) => {
  const { sizeList, colorID, categoryID } = payload;
  let data = [];
  let products;
  if (colorID) {
    products = await db.Product.findAll({
      where: {
        categoryID,
      },
      include: [
        {
          model: db.Product_Variant,
          as: 'Variant',
          where: {
            colorID: colorID,
          },
        },
      ],
    });
  } else {
    products = await db.Product.findAll({
      where: {
        categoryID,
      },
      include: [
        {
          model: db.Product_Variant,
          as: 'Variant',
        },
      ],
    });
  }
  if (sizeList && sizeList.length !== 0) {
    data = products.filter((product) => {
      const exists = product.Variant.find((item) =>
        sizeList.includes(item.sizeID),
      );
      return exists;
    });
  } else {
    data = products;
  }
  return {
    code: 0,
    msg: 'Successfully',
    data,
  };
};

module.exports = {
  handleAddNewProduct,
  handleGetAllColor,
  handleGetAllSize,
  handleGetAllProduct,
  handleUpdateProduct,
  handleGetAllCategory,
  handleGetFirstProductByCateLog,
  handleGetNewProduct,
  handleGetProductByID,
  handleGetProductByCount,
  handleGetAllProductByCategory,
};
