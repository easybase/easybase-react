import { AsyncStorage } from 'react-native'
import storage from './in-memory-storage.native';

getAllFromLocalStorage();

const storageService = {
  setItem,
  removeItem,
  getItem
}

function getAllItemsForKeys(keys) {
  const promiseAll = keys
    .map(key => AsyncStorage
      .getItem(key)
      .then(data => JSON.parse(data))
      .then(data => {
        storage.set(key, data)
        return { [key]: data }
      })
    )

  return Promise
    .all(promiseAll)
    .then(flatMap)
    .catch(error => console.log('Storage ERROR - getAllItemsForKeys!', error))
}

function flatMap(allData) {
  let flatData = {}
  allData.forEach((data) => {
    flatData = { ...flatData, ...data }
  })
  return flatData
}

function setItem(key, value) {
  storage.set(key, value)
  AsyncStorage
    .setItem(key, JSON.stringify(value))
    .then(handleSuccess)
    .catch(handleError)
}

function removeItem(key) {
  storage.remove(key)
  AsyncStorage
    .removeItem(key)
    .then(handleSuccess)
    .catch(handleError)
}

function getItem(key) { return storage.get(key) }

function clear() {
  storage.clearAll()
  AsyncStorage
    .clear()
    .then(handleSuccess)
    .catch(handleError)
}

function getAllFromLocalStorage() {
  return AsyncStorage
    .getAllKeys()
    .then(getAllItemsForKeys)
}

function handleSuccess() {
  return 'Success'
}

function handleError(data) {
  console.warn('AsyncStorage Error', data)
}

export default storageService
