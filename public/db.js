let db;

// create a new db request for budget database
const request = indexedDB.open("budget-tracker", 1);

request.onupgradeneeded = function(event) {
    // create object store called "pending" and set autoIncrement to true
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
}

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function (event) {
    console.log("IndexedDB error: " + event.target.errorCode);
};

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    // access pending object store
    const store = transaction.objectStore("pending");

    // add record to store with add method
    store.add(record);
}

function checkDatabase() {
    // open a transaction on pending db
    const transaction = db.transaction(["pending"], "readwrite");

    // access pending object store
    const store = transaction.objectStore("pending");

    // get all records from store and set to a variable
    const getAll = store.getAll();
    
    getAll.onsuccess = function () {
        // console.log("getAll Data: ", getAll);
        // console.log("getAll.result Data: ", getAll.result);
        // console.log("JSON Stringify getAll.result Data: ", JSON.stringify(getAll.result));

        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Conetent-Type": "application/json"
                }
            })
            .then(response => {response.json()})
            .then(() => {
                // if successful, open a transaction on pending db
                const transaction = db.transaction(["pending"], "readwrite");

                // access pending object store
                const store = transaction.objectStore("pending");

                // clear all items in store
                store.clear();
            });
        }
    };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);