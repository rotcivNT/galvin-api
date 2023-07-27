const fireBaseApp = require('firebase/app');
const config = require('../config/firebase.config');
const fireBaseStorage = require('firebase/storage');

// Init fire base app
fireBaseApp.initializeApp(config.firebaseConfig);

const storage = fireBaseStorage.getStorage();

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
};
const uploadFileFB = async (file, directory) => {
  const base64Data = file.thumbUrl.split(';base64,').pop(); // Lấy phần nội dung base64 từ chuỗi base64
  const dateTime = giveCurrentDateTime();

  const storageRef = fireBaseStorage.ref(
    storage,
    `${directory}/${file.name + '_' + dateTime}`,
  );

  const metadata = {
    contentType: file.type,
  };

  const snapshot = await fireBaseStorage.uploadString(
    storageRef,
    base64Data,
    'base64',
    metadata,
  );
  const url = await fireBaseStorage.getDownloadURL(snapshot.ref);
  return url;
};

module.exports = {
  uploadFileFB,
};
