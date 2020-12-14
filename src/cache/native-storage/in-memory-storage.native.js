/**
 * in-memory-storage.native.js - simple in memory sync localStorage for react-native
 * react-native-web-storage
 *
 * Created by Peter Kowalczyk on 07/01/17.
 * Copyright © 2017 Aurity. All rights reserved.
 *
 */
const storage = {
    set,
    get,
    getAll,
    remove,
    clearAll
}

let dbStore = {}

export default storage

function set(key, value) {
    dbStore[key] = value
}

function get(key) {
    return dbStore[key]
}

function getAll() {
    return dbStore
}

function remove(key) {
    delete dbStore[key]
}

function clearAll() {
    dbStore = {}
}
