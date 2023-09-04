const fireBaseApp = require('firebase/app');
const config = require('../config/firebase.config');
const fireBaseStorage = require('firebase/storage');

// Init fire base app
fireBaseApp.initializeApp(config.firebaseConfig);

const storage = fireBaseStorage.getStorage();

const uploadFileFB = async (file, directory) => {
  const base64Data = file.thumbUrl.split(';base64,').pop(); // Lấy phần nội dung base64 từ chuỗi base64
  const storageRef = fireBaseStorage.ref(
    storage,
    `${directory}/${file.name}`,
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
