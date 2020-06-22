// membuat database dan object store
var dbPromised = idb.open("news-reader", 1, function (upgradeDb) {
  var articlesObjectStore = upgradeDb.createObjectStore("articles", {
    keyPath: "ID"
  });
  articlesObjectStore.createIndex("post_title", "post_title", {
    unique: false
  });
});

// function save for later
function saveForLater(article) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("articles", "readwrite");
      var store = tx.objectStore("articles");
      console.log(article);
      store.add(article.result);
      return tx.complete;
    })
    .then(function () {
      console.log("Artikel berhasil di simpan.");
    });
}

// mengambil semua saved article
function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("articles", "readonly");
        let store = tx.objectStore("articles");
        return store.getAll();
      })
      .then(function (articles) {
        resolve(articles);
      });
  });
}

// mengambil detail saved article
function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("articles", "readonly");
        var store = tx.objectStore("articles");
        return store.get(id);
      })
      .then(function (article) {
        resolve(article);
      });
  });
}