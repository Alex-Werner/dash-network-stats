const fs = require('fs');
var fse = require('fs-extra');

const FileHelper = {
  isFileExistSync: function (path) {
    try {
      return fse.statSync(path).isFile();
    }
    catch (e) {
      if (e.code === 'ENOENT') { // no such file or directory. File really does not exist
        return false;
      }
      console.log("Exception fs.statSync (" + path + "): " + e);
      throw e; // something else went wrong, we don't have rights, ...
    }
  },
  writeJSON:fse.writeJson,
  writeJSONSync:fse.writeJsonSync,
  readJSON:fse.readJson,
  readJSONSync:fse.readJsonSync,
  ensureFileSync: function (_path){
    return fse.ensureFileSync(_path);
  },
  ensureDirSync: function (_path) {
    const splitted = _path.split('/');
    let path = '';
    let i = 0;
    let regIsFile = new RegExp('^(.+[.].+)+$');
    while (i<=splitted.length-1){
      if(regIsFile.test(splitted[i])){
        break;
      }
      path +=  splitted[i]+'/';
      i++;
    }

    //Step 1 : Verify that the directories exists and create it if not.
    return fse.ensureDirSync(path);

  },
  cleanFile: function (filepath) {
    if (FileHelper.isFileExistSync(filepath)) {
      return fse.unlinkSync(filepath);
    } else {
      return false;
    }
  },
  cleanTmpSync: function (fileToTest) {
    if (FileHelper.isFileExistSync(fileToTest)) {
      fse.unlinkSync(fileToTest);
      return true;
    } else {
      return false;
    }
  },
  getFilesizeInBytes: function (filename) {
    let stats = fs.statSync(filename);
    return stats["size"];
  },
};
module.exports = FileHelper;