const regedit = require('regedit')
const Registry = require('winreg')
const STEAM_REGEDIT_KEY_PATH = '\\SOFTWARE\\Valve\\Steam\\Apps'
let APP_KEYS = []
regedit.list(`HKCU${STEAM_REGEDIT_KEY_PATH}`, function (err, result) {
  if (err) {
    throw Error('read reagdit is error')
  }
  APP_KEYS = result[`HKCU${STEAM_REGEDIT_KEY_PATH}`].keys
  console.log('APP_KEYS', APP_KEYS)

  APP_KEYS.forEach(appid => {
    const regKey = new Registry({
      hive: Registry.HKCU,
      key: `${STEAM_REGEDIT_KEY_PATH}\\${appid}`
    }).values(function (err, items /* array of RegistryItem */) {
      if (err)
        console.log('ERROR: ' + err);
      else
        for (var i = 0; i < items.length; i++)
          console.log('ITEM: ' + items[i].name + '\t' + items[i].type + '\t' + items[i].value);
    });

  });
})
