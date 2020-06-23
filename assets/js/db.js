// membuat database dan object store
let dbPromised = idb.open("footbal-playerz", 1, function (upgradeDb) {
  let teamsObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id"
  });
  teamsObjectStore.createIndex("shortName", "shortName", {
    unique: false
  });
});

// function save for later
function saveForLater(team) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      console.log(team);
      store.add(team);
      return tx.complete;
    })
    .then(function () {
      console.log("Team berhasil disimpan.");
      M.toast({
        html: `Added to favorite.`
      });
    })
    .catch(error => console.log(error));
}

// mengambil semua saved team
function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
}

// mengambil detail saved team
function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.get(id);
      })
      .then(function (team) {
        resolve(team);
      })
      .catch(error => {
        reject(error);
      })
  });
}

// function delete team
function deleteFavTeam(team) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      store.delete(team);
      return tx.complete;
    })
    .then(function () {
      console.log("Team berhasil dihapus.");
      M.toast({
        html: `Removed from favorite.`
      });
    })
    .catch(error => console.log(error));
}