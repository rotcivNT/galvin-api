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

function toLowerCaseNonAccentVietnamese(str) {
  str = str.toLowerCase();
//     We can also use this instead of from line 11 to line 17
//     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
//     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
//     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
//     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
//     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
//     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
//     str = str.replace(/\u0111/g, "d");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
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
    const directory = variantData[0].fileList[0].name.slice(0, variantData[0].fileList[0].name.indexOf('.'));
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
    // Add to Product_Variant + Upload image to Firebase
    promises = variantData.map(async (dataItem) => {
      const newDirectory = dataItem.fileList[0].name.slice(0, dataItem.fileList[0].name.indexOf('.'));
      dataItem.sizeList.map(async (sizeItem) => {
        await db.Product_Variant.create({
          productID,
          colorID: dataItem.colorID,
          sizeID: sizeItem,
          qtyStock: dataItem.qtyStock,
        });
      });
      const imagePromises = dataItem.fileList.map(async (file) => {
        const res = await uploadFileFB(file, newDirectory);
        try {
          await db.Product_Gallery.create({
            productID,
            colorID: dataItem.colorID,
            imagePath: res,
          });
          return true;
        } catch (err) {
          return false;
        }
      });
      await Promise.all(imagePromises);
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

const handleGetAllProductByCategory = async (payload, query) => {
  const { sizeList, colorID, categoryID } = payload;
  let data = [];
  let products;
  let totalPages = 0
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
  if (query.offset && query.limit) {
    const offset = +query.offset;
    const limit = +query.limit;
    data = products.slice(offset, offset + limit);
  }
  else data = products

  totalPages = Math.ceil((products.length) / +query.limit) || products.length
  if (sizeList && sizeList.length !== 0) {
    data = products.filter((product) => {
      const exists = product.Variant.find((item) =>
        sizeList.includes(item.sizeID),
      );
      return exists;
    });
    totalPages = Math.ceil((data.length) / +query.limit) || data.length
  }
  return {
    code: 0,
    msg: 'Successfully',
    totalPages,
    data,
  };
};

const handleSearchProduct = async (query) => {
  try {
    const data = []
    const queryArr = query.split(' ')
    if (query === '') {
      return {
        code: 0,
        msg: 'Successfully',
        data,
      };
    }
    const products = await db.Product.findAll();
    products.map((product) => {
      queryArr.map(query => {
      if (toLowerCaseNonAccentVietnamese(product.productName).includes(toLowerCaseNonAccentVietnamese(query))) {
        data.push(product);
      }
      })
    })
    return {
      code: 0,
      msg: 'Successfully',
      data,
    };
  } catch (err) {
    return err;
  }
}

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
  handleSearchProduct
};
