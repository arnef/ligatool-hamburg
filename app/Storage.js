import { AsyncStorage } from 'react-native';

const Storage = {
    getItem: (key) => {
        return new Promise( resolve => {
            AsyncStorage.getItem(key)
                .then(serializedItem => {
                  if (serializedItem) {
                        try {
                            const item = JSON.parse(serializedItem);
                            resolve({ ok: true, data: item });
                        } catch (ex) {
                            console.tron.log(ex);
                            resolve({ ok: false });
                        }
                    } else {
                        resolve({ ok: false });
                    }
                    }).catch(ex => {
                        console.tron.log(ex);
                        resolve({ ok: false });
                    });
                
        });
    },
    setItem:(key, value) => {
        return new Promise( resolve => {
            try {
                const serializedItem = JSON.stringify(value);
                AsyncStorage.setItem(key, serializedItem)
                    .then(() => {
                        resolve({ ok: true });
                    }).catch(ex => {
                        console.tron.log(ex);
                        resolve({ ok: false });
                    })

            } catch (ex) {
                console.tron.log(ex);
                resolve({ ok: false });
            }
        });
    }
}

export default Storage;