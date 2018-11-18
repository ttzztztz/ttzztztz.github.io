const initFileIndex = [
    {
        address: 0,
        name: "home",
        path: "/",
        type: "dir",
        time: 0,
        other: "",
        contains: [
            {
                address: 1,
                name: "hello",
                path: "/home",
                type: "file",
                time: 0,
                other: "",
                contains: [],
            },
        ],
    }
];
const nameReg = /^[a-zA-Z0-9_][a-zA-Z0-9._]+$/g;

let fileObject = {
    address: 0,
    name: "",
    path: "",
    type: "file",
    time: 0,
    other: "",
    contains: [],
};
let hardLinkObject = {
    address: 0,
    count: 0,
};
let fileIndex = [];
let hardLinkIndex = [];
let fileAutoIncrement = 0;

function Time() {

}

Time.prototype.time = function () {
    return new Date().getTime();
};

/**
 * @param m
 * @returns {string}
 * @constructor
 */
Time.prototype.add0 = function (m) {
    return m < 10 ? '0' + m : m
};

/**
 * @param timestamp
 * @returns {string}
 * @constructor
 */
Time.prototype.strtotime = function (timestamp) {
    let time = new Date(parseInt(timestamp));
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return y + "-" + this.add0(m) + "-" + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
};

//<-- Storage CURD
function Storage() {

}

Storage.prototype.create = function (k, v) {
    let _now = localStorage.getItem(k);
    if (_now === null || _now === undefined) {
        localStorage.setItem(k, v);
    }
};

Storage.prototype.update = function (k, v) {
    localStorage.setItem(k, v);
};

Storage.prototype.delete = function (k) {
    localStorage.removeItem(k);
};

Storage.prototype.read = function (k) {
    return localStorage.getItem(k);
};

//<-- Init Operation
function Init() {

}

Init.prototype.filesystem = function (force = 0) {
    let storage = new Storage();
    let index = storage.read("RBFS_index");
    let hard_link = storage.read("RBFS_hardlink");
    if (force || index === undefined || index === null) {
        storage.create("RBFS_index", JSON.stringify(initFileIndex));
        storage.create("RBFS_hardlink", JSON.stringify(hardLinkIndex));
        fileIndex = initFileIndex;
        fileAutoIncrement = 2;
        storage.create("RBFS_auto_increment", fileAutoIncrement);
        storage.create("RBFS_file_1", "Hello World!");
    }
};

Init.prototype.program = function () {
    let storage = new Storage();
    let index = storage.read("RBFS_index");
    let auto_increment = storage.read("RBFS_auto_increment");
    let hard_link = storage.read("RBFS_hardlink");
    if (index === undefined || index === null || auto_increment === undefined || auto_increment === null || hard_link === null || hard_link === undefined) {
        this.filesystem(0);
    } else {
        try {
            fileIndex = JSON.parse(index);
            hardLinkIndex = JSON.parse(hard_link);
            fileAutoIncrement = auto_increment;
        } catch (e) {
            console.log(e);
            this.filesystem(1);
        }
    }
};

//<-- File OPT
function File() {

}

File.prototype.create = function (path, name, content = "RBFS_File", fix_address = -1, is_hardlink = 0) {
    if (this.getType(path + "/" + name) !== "null") return -1;
    if (this.getType(path) !== "dir") return -2;
    if (name.match(nameReg) === null) return -7;
    let _file_index = Object.create(fileObject);
    if (fix_address === -1) _file_index.address = fileAutoIncrement++;
    else _file_index.address = fix_address;
    _file_index.name = name;
    _file_index.path = path;
    _file_index.time = Date.parse(new Date());
    if (is_hardlink) {
        _file_index.type = "hardlink";
    } else if (is_hardlink === 0 && fix_address !== -1) {
        _file_index.type = "softlink";
    } else {
        _file_index.type = "file";
    }
    if (fix_address === -1) {
        let storage = new Storage();
        storage.create("RBFS_file_" + _file_index.address, content);
    }
    let _dir = this.getDirObject(path, 0);
    _dir.contains.push(_file_index);
    let save = new Save();
    save.fileIndex();
    return 1;
};

File.prototype.getPathArray = function (path) {
    let arr = path.split("/");
    arr.splice(0, 1);
    return arr;
};

File.prototype.getParentPathArray = function (path) {
    let arr = this.getPathArray(path);
    arr.pop();
    return arr;
};

File.prototype.getParentPath = function (path) {
    let arr = this.getParentPathArray(path);
    return "/" + arr.join("/");
};

File.prototype.getFileName = function (path) {
    let arr = this.getPathArray(path);
    return arr[arr.length - 1];
};

File.prototype.getType = function (path) {
    let arr = this.getPathArray(path);
    let result = 0;
    let last_obj = fileIndex[0];
    for (let i = 1, len = arr.length; i < len; i++) {
        if (!last_obj.hasOwnProperty("contains")) {
            last_obj = null;
            break;
        }
        let find_flag = 0;
        for (let m = 0, dir_len = last_obj.contains.length; m < dir_len; m++) {
            if (last_obj.contains[m].name === arr[i]) {
                last_obj = last_obj.contains[m];
                find_flag = 1;
                break;
            }
        }
        if (!find_flag) {
            last_obj = null;
            break;
        }
    }
    if (last_obj === null) {
        result = "null";
    } else {
        switch (last_obj.type) {
            default :
                result = "default";
                break;
            case "dir":
                result = "dir";
                break;
            case "file":
                result = "file";
                break;
            case "softlink":
                result = "softlink";
                break;
            case "hardlink":
                result = "hardlink";
                break;
        }
    }
    return result;
};

File.prototype.delete = function (path, is_dir = 0) {
    if (this.getType(path) === "null") return -4;
    let _structure = this.getPathArray(path);
    if (_structure[0] !== "home") return -3;
    let directory = new Directory();
    let _dir = is_dir ? directory.getDirObject(_structure, 1) : this.getDirObject(_structure, 1);
    let result = 0;
    let filename = _structure[_structure.length - 1];
    _dir.contains = _dir.contains.filter(function (item, index, array) {
        if (item.name === filename) {
            let link = new Link();
            if (item.type === "file") {
                //find if hardlink exists
                let checkHard = link.findHard(item.address);
                if (checkHard === null || checkHard === undefined) {
                    let storage = new Storage();
                    storage.delete("RBFS_file_" + item.address);
                } else {
                    link.deleteHard(item.address);
                }
            } else if (item.type === "softlink") {
                //do nothing about address
            } else if (item.type === "hardlink") {
                link.deleteHard(item.address);
            } else if (item.type === "dir") {
                let storage = new Storage();
                storage.delete("RBFS_file_" + item.address);
            }
            let save = new Save();
            save.fileIndex();
            result = 1;
            return false;
        } else {
            return true;
        }
    });
    let save = new Save();
    save.fileIndex();
    return result;
};

File.prototype.updateContent = function (path, content) {
    let _structure = this.getPathArray(path);
    if (_structure[0] !== "home") return -3;
    let _dir = this.getDirObject(_structure, 1);
    let result = 0;
    let filename = _structure[_structure.length - 1];
    for (let i = 0, len = _dir.contains.length; i < len; i++) {
        if ((_dir.contains[i].type === "file" || _dir.contains[i].type === "softlink" || _dir.contains[i].type === "hardlink") && _dir.contains[i].name === filename) {
            let storage = new Storage();
            storage.update("RBFS_file_" + _dir.contains[i].address, content);
            result = 1;
            break;
        }
    }
    return result;
};

File.prototype.read = function (path) {
    let _structure = this.getPathArray(path);
    if (_structure[0] !== "home") return -3;
    let _dir = this.getDirObject(_structure, 1);
    let filename = _structure[_structure.length - 1];
    for (let i = 0, len = _dir.contains.length; i < len; i++) {
        if ((_dir.contains[i].type === "file" || _dir.contains[i].type === "softlink" || _dir.contains[i].type === "hardlink") && _dir.contains[i].name === filename) {
            let storage = new Storage();
            return storage.read("RBFS_file_" + _dir.contains[i].address);
        }
    }
    return null;
};

File.prototype.writeAddress = function (address, content) {
    let storage = new Storage();
    return storage.update("RBFS_file_" + address, content);
};

File.prototype.appendAddress = function (address, content) {
    let storage = new Storage();
    let to_write = storage.read("RBFS_file_" + address);
    if (to_write === null || to_write === undefined) {
        return storage.create("RBFS_file_" + address, content);
    } else {
        return storage.update("RBFS_file_" + address, to_write + content);
    }
};

File.prototype.getAddress = function (path) {
    let _structure = this.getPathArray(path);
    if (_structure[0] !== "home") return -3;
    let _dir = this.getDirObject(_structure, 1);
    let filename = _structure[_structure.length - 1];
    for (let i = 0, len = _dir.contains.length; i < len; i++) {
        if ((_dir.contains[i].type === "file" || _dir.contains[i].type === "softlink" || _dir.contains[i].type === "hardlink") && _dir.contains[i].name === filename) {
            return _dir.contains[i].address;
        }
    }
    return null;
};

File.prototype.readAddress = function (address) {
    let storage = new Storage();
    return storage.read("RBFS_file_" + address);
};

File.prototype.insertAddress = function (content) {
    let rtn = fileAutoIncrement++;
    let storage = new Storage();
    storage.create("RBFS_file_" + rtn, content);
    return rtn;
};

File.prototype.deleteAddress = function (address) {
    let link = new Link();
    let result = link.findHard(address);
    if (result === null) {
        let storage = new Storage();
        return storage.delete("RBFS_file_" + address);
    } else {
        return link.deleteHard(address);
    }
};

File.prototype.changeDate = function (path, time) {
    if (this.getType(path) === "null") return -4;
    let _structure = this.getPathArray(path);
    if (_structure[0] !== "home") return -3;
    let _dir = this.getDirObject(_structure, 1);
    let result = 0;
    let filename = _structure[_structure.length - 1];
    for (let i = 0, len = _dir.contains.length; i < len; i++) {
        if (_dir.contains[i].name === filename) {
            _dir.contains[i].time = time;
            let save = new Save();
            save.fileIndex();
            result = 1;
            break;
        }
    }
    return result;
};

File.prototype.copy = function (path_from, path_to, is_dir = 0) {
    if (this.getType(path_from) === "null") return -4;
    let _structure = this.getPathArray(path_from);
    if (_structure[0] !== "home") return -3;
    let directory = new Directory();
    let _dir = is_dir ? directory.getDirObject(_structure, 1) : this.getDirObject(_structure, 1);
    let filename = _structure[_structure.length - 1];
    let copy = null;
    let result = 0;
    _dir.contains.forEach(function (item, index, array) {
        if (item.name === filename) {
            copy = JSON.parse(JSON.stringify(item));
        }
    });
    if (copy !== null) {
        let _structure2 = this.getPathArray(path_to);
        if (_structure2[0] !== "home") return -3;
        filename = _structure2[_structure2.length - 1];
        if (filename.match(nameReg) === null) return -7;
        _dir = is_dir ? directory.getDirObject(_structure2, 1) : this.getDirObject(_structure2, 1);
        if (this.getType(_dir.path + "/" + _dir.name) !== "null") return -1;
        if (this.getType(_dir.path) === "null") return -2;
        copy.name = filename;
        let time = new Time();
        copy.time = time.time();
        if (copy.type === "file" || copy.type === "dir") {
            let content = this.readAddress(copy.address);
            copy.address = this.insertAddress(content);
        } else if (copy.type === "softlink") {
            //do noting about address
        } else if (copy.type === "hardlink") {
            let link = new Link();
            link.addHard(copy.address);
        }
        _structure2.pop();
        copy.path = "/" + _structure2.join("/");
        _dir.contains.push(copy);
        result = 1;
    }
    let save = new Save();
    save.fileIndex();
    return result;
};

File.prototype.move = function (path_from, path_to, is_dir = 0) {
    if (this.getType(path_from) === "null") return -4;
    let _structure = this.getPathArray(path_from);
    if (_structure[0] !== "home") return -3;
    let directory = new Directory();
    let _dir = is_dir ? directory.getDirObject(_structure, 1) : this.getDirObject(_structure, 1);
    let filename = _structure[_structure.length - 1];
    let copy = null;
    let result = 0;
    _dir.contains = _dir.contains.filter(function (item, index, array) {
        if (item.name === filename) {
            copy = Object.assign({}, item);
        }
        return item.name !== filename;
    });
    if (copy !== null) {
        let _structure2 = this.getPathArray(path_to);
        if (_structure2[0] !== "home") return -3;
        filename = _structure2[_structure2.length - 1];
        if (filename.match(nameReg) === null) return -7;
        _dir = is_dir ? directory.getDirObject(_structure2, 1) : this.getDirObject(_structure2, 1);
        if (this.getType(_dir.path === "/" ? "/" : "/" + _dir.name) === "null") return -2;
        copy.name = filename;
        _structure2.pop();
        copy.path = "/" + _structure2.join("/");
        let time = new Time();
        copy.time = time.time();
        _dir.contains.push(copy);
        result = 1;
    }
    let save = new Save();
    save.fileIndex();
    return result;
};

File.prototype.getDirObject = function (path, is_arr = 0) {
    let arr = is_arr ? path : this.getPathArray(path);
    let last_obj = fileIndex[0];
    for (let i = 1, len = arr.length; i < len; i++) {
        if (!last_obj.hasOwnProperty("contains")) {
            last_obj = null;
            break;
        }
        let find_flag = 0;
        for (let m = 0, dir_len = last_obj.contains.length; m < dir_len; m++) {
            if (last_obj.contains[m].type === "dir" && last_obj.contains[m].name === arr[i]) {
                last_obj = last_obj.contains[m];
                find_flag = 1;
                break;
            }
        }
        if (!find_flag && i !== len - 1) {
            last_obj = null;
            break;
        }
    }
    return last_obj;
};

//<-- DIR OPT
function Directory() {

}

Directory.prototype.getDirObject = function (path, is_arr = 0) {
    let file = new File();
    let arr = is_arr ? path : file.getPathArray(path);
    let arr_rtn = Object.assign([], arr);
    arr_rtn.pop();
    return file.getDirObject(arr_rtn, 1);
};

Directory.prototype.create = function (path, name) {
    let file = new File();
    if (file.getType(path + "/" + name) !== "null") return -1;
    if (file.getType(path) !== "dir") return -2;
    if (name.match(nameReg) === null) return -7;
    let _file_index = Object.create(fileObject);
    _file_index.address = fileAutoIncrement++;
    _file_index.name = name;
    _file_index.path = path;
    _file_index.time = Date.parse(new Date());
    _file_index.type = "dir";
    _file_index.contains = [];
    let storage = new Storage();
    storage.create("RBFS_file_" + _file_index.address, "RBFS_RESERVED");
    let _dir = file.getDirObject(path, 0);
    _dir.contains.push(_file_index);
    let save = new Save();
    save.fileIndex();
    return 1;
};

Directory.prototype.updatePath = function (root) {
    let file = new File();
    let tree = file.getDirObject(root, 0);
    let that = this;
    tree.contains.forEach(function (item, index, array) {
        item.path = root;
        if (item.type === "dir") {
            that.updatePath(root + "/" + item.name);
        }
    });
};

Directory.prototype.updateAddress = function (root) {
    let file = new File();
    let tree = file.getDirObject(root, 0);
    let that = this;
    tree.contains.forEach(function (item, index, array) {
        item.path = root;
        if (item.type === "file" || item.type === "dir") {
            let content = file.readAddress(item.address);
            item.address = file.insertAddress(content);
        } else if (item.type === "softlink") {
            //do nothing about address
        } else if (item.type === "hardlink") {
            let link = new Link();
            link.addHard(item.address);
        } else if (item.type === "dir") {
            that.updatePath(root + "/" + item.name);
        }
    });
};

Directory.prototype.deleteAddress = function (root) {
    let file = new File();
    let tree = file.getDirObject(root, 0);
    let that = this;
    tree.contains.forEach(function (item, index, array) {
        if (item.type === "dir") {
            that.deleteAddress(root + "/" + item.name);
        } else if (item.type === "hardlink" || item.type === "file") {
            file.deleteAddress(item.address);
        } else if (item.type === "softlink") {
            //do nothing about softlink address
        }
    });
};

Directory.prototype.move = function (path_from, path_to) {
    let file = new File();
    let _structure = file.getPathArray(path_from);
    if (_structure[0] !== "home") return -3;
    if (file.getType(path_from) !== "dir") return -2;
    let to_arr = file.getPathArray(path_to);
    if (to_arr[0] !== "home") return -3;
    let to_dirname = to_arr[to_arr.length - 1];
    if (to_dirname.match(nameReg) === null) return -7;
    to_arr.pop();
    if (file.getType("/" + to_arr.join("/")) !== "dir") return -1;
    let _path_to = "/" + to_arr.join("/") + "/" + to_dirname;
    file.move(path_from, _path_to, 1);
    this.updatePath(_path_to);
    let save = new Save();
    save.fileIndex();
    return 1;
};

Directory.prototype.copy = function (path_from, path_to) {
    let file = new File();
    let _structure = file.getPathArray(path_from);
    if (_structure[0] !== "home") return -3;
    if (file.getType(path_from) !== "dir") return -1;
    let to_arr = file.getPathArray(path_to);
    if (to_arr[0] !== "home") return -3;
    let to_dirname = to_arr[to_arr.length - 1];
    if (to_dirname.match(nameReg) === null) return -7;
    to_arr.pop();
    if (file.getType("/" + to_arr.join("/")) !== "dir") return -2;
    let _path_to = "/" + to_arr.join("/") + "/" + to_dirname;
    file.copy(path_from, _path_to, 1);
    this.updateAddress(_path_to);
    let save = new Save();
    save.fileIndex();
    return 1;
};

Directory.prototype.delete = function (path) {
    let file = new File();
    if (file.getType(path) !== "dir") return -1;
    let to_arr = file.getPathArray(path);
    this.deleteAddress(path);
    file.delete(path, 1);
    let save = new Save();
    save.fileIndex();
    return 1;
};

Directory.prototype.list = function (path) {
    let file = new File();
    if (file.getType(path) !== "dir") return -1;
    let _structure = file.getPathArray(path);
    return file.getDirObject(_structure, 1);
};

//<-- Save OPT
function Save() {

}

Save.prototype.autoIncrement = function () {
    let storage = new Storage();
    storage.update("RBFS_auto_increment", fileAutoIncrement);
};

Save.prototype.fileIndex = function () {
    let storage = new Storage();
    this.autoIncrement();
    storage.update("RBFS_index", JSON.stringify(fileIndex));
};

Save.prototype.hardLinkIndex = function () {
    let storage = new Storage();
    storage.update("RBFS_hardlink", JSON.stringify(hardLinkIndex));
};

//<-- Link OPT
function Link() {

}

Link.prototype.softExist = function (path) {
    let file = new File();
    let address = file.getAddress(path);
    let content = file.readAddress(address);
    if (!(content === undefined || content === null)) {
        return address;
    } else {
        return -1;
    }
};

Link.prototype.createSoft = function (path, name, address) {
    let file = new File();
    return file.create(path, name, "", address, 0);
};

Link.prototype.findHard = function (address) {
    let result = null;
    hardLinkIndex.some(function (item, index, array) {
        if (item.address === address) {
            result = item;
            return true;
        } else return false;
    });
    return result;
};

Link.prototype.createHard = function (path, name, address) {
    let file = new File();
    let r = file.create(path, name, "", address, 1);
    if (r !== 1) return r;
    let result = this.findHard(address);
    if (result === null) {
        let index = Object.create(hardLinkObject);
        index.address = address;
        index.count = 2;
        hardLinkIndex.push(index);
    } else {
        result.count++;
    }
    let save = new Save();
    save.hardLinkIndex();
    return 1;
};

Link.prototype.deleteHard = function (address) {
    let result = this.findHard(address);
    if (result === null || result === undefined) return 0;
    result.count--;
    if (result.count === 0) {
        let storage = new Storage();
        storage.delete("RBFS_file_" + result.address);
        hardLinkIndex = hardLinkIndex.filter(function (item, index, array) {
            return item.address !== address;
        });
    }
    let save = new Save();
    save.hardLinkIndex();
    return 1;
};

Link.prototype.addHard = function (address) {
    let result = this.findHard(address);
    if (result === null || result === undefined) return 0;
    result.count++;
    let save = new Save();
    save.hardLinkIndex();
    return 1;
};

//<-- All packet
function _RBFS() {
    this.Storage = new Storage();
    this.File = new File();
    this.Directory = new Directory();
    this.Link = new Link();
    this.Save = new Save();
    this.Time = new Time();
    this.Init = new Init();
}