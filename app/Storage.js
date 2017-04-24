import { AsyncStorage } from 'react-native'

const Storage = {
    getItem: (key) => {
      console.tron.log('get item ' + key);
        return new Promise( resolve => {
            AsyncStorage.getItem(key)
                .then(serializedItem => {
                  console.tron.log('item ? ' + serializedItem);
                    if (serializedItem) {
                        try {
                            const item = JSON.parse(serializedItem)

                            resolve({ data: item, ok: true })
                        } catch (ex) {
                            // console.tron.log(ex)
                            resolve({ ok: false })
                        }
                    } else {
                      console.tron.log('no item');
                      resolve({ ok: false })
                    }
                }).catch(ex => {
                    // console.tron.log(ex)
                    resolve({ ok: false })
                })
        })
    },
    setItem:(key, value) => {
      console.tron.log('set item ' + key)
        return new Promise( resolve => {
            try {
                const serializedItem = JSON.stringify(value)

                AsyncStorage.setItem(key, serializedItem)
                    .then(() => {
                        resolve({ ok: true })
                    }).catch(ex => {
                        // console.tron.log(ex)
                        resolve({ ok: false })
                    })

            } catch (ex) {
                // console.tron.log(ex)
                resolve({ ok: false })
            }
        })
    }
}

export default Storage
