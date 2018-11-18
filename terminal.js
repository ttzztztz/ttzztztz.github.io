const terminalReg = /\s*(".+?")+(((".+?"|[^\s])+)|)|(".+?"|[^"\s])+/g;
const argsReg = /^"|"$/g;
const errMessage = ["", "Already exists", "Directory doesn't exist", "Access denied", "File doesn't exist", "Type error", "Arguments Wrong number", "Illegal name"];
const colLimit = 10;

let currentDir = "/home";

function Method(bindTerminal) {
    this.bindTerminal = bindTerminal;
}

Method.prototype.echo = function () {
    let terminal = this.bindTerminal;
    let buffer = "";
    for (let i = 0, len = arguments.length; i < len; i++) {
        buffer += arguments[i];
    }
    terminal.print(buffer);
};

Method.prototype.cp = function () {
    let mode = "", src = "", dest = "";
    let terminal = this.bindTerminal;
    if (arguments.length === 3) {
        mode = arguments[0];
        src = terminal.formatPath(arguments[1]);
        dest = terminal.formatPath(arguments[2]);
    } else if (arguments.length === 2) {
        mode = "";
        src = terminal.formatPath(arguments[0]);
        dest = terminal.formatPath(arguments[1]);
    } else return -6;
    let file = new File();
    let type_src = file.getType(src);
    if (mode === "" && type_src === "dir") {
        return -4;
    }
    let parentPath = file.getParentPath(dest);
    let type_dest = file.getType(parentPath);
    if (type_dest !== "dir") return -5;
    if (type_src === "dir") {
        let directory = new Directory();
        return directory.copy(src, dest);
    } else {
        return file.copy(src, dest, 0);
    }
};

Method.prototype.mv = function () {
    let mode = "", src = "", dest = "";
    let terminal = this.bindTerminal;
    if (arguments.length === 3) {
        mode = arguments[0];
        src = terminal.formatPath(arguments[1]);
        dest = terminal.formatPath(arguments[2]);
    } else if (arguments.length === 2) {
        mode = "";
        src = terminal.formatPath(arguments[0]);
        dest = terminal.formatPath(arguments[1]);
    } else return -6;
    let file = new File();
    let type_src = file.getType(src);
    if (mode !== "-r" && type_src === "dir") {
        return -4;
    }
    let parentPath = file.getParentPath(dest);
    let type_dest = file.getType(parentPath);
    if (type_dest !== "dir") return -5;
    if (type_src === "dir") {
        let directory = new Directory();
        return directory.move(src, dest);
    } else {
        return file.move(src, dest, 0);
    }
};

Method.prototype.rm = function () {
    let mode = "", path = "";
    let terminal = this.bindTerminal;
    if (arguments.length === 2) {
        mode = arguments[0];
        path = terminal.formatPath(arguments[1]);
    } else if (arguments.length === 1) {
        mode = "";
        path = terminal.formatPath(arguments[0]);
    } else return -6;
    let file = new File();
    let type = file.getType(path);
    if (mode !== "-r" && type === "dir") {
        return -4;
    }
    if (type === "dir") {
        let directory = new Directory();
        return directory.delete(path);
    } else {
        return file.delete(path, 0);
    }
};

Method.prototype.ln = function () {
    let mode = "", src = "", dest = "";
    let terminal = this.bindTerminal;
    if (arguments.length === 3) {
        mode = arguments[0];
        src = terminal.formatPath(arguments[1]);
        dest = terminal.formatPath(arguments[2]);
    } else if (arguments.length === 2) {
        mode = "";
        src = terminal.formatPath(arguments[0]);
        dest = terminal.formatPath(arguments[1]);
    } else return -6;
    let file = new File();
    let type_src = file.getType(src);
    let parentPath = file.getParentPath(dest);
    let type_dest = file.getType(parentPath);
    let link = new Link();
    if (type_src !== "file" || type_dest !== "dir") return -5;
    let address = file.getAddress(src);
    let filename = file.getFileName(dest);
    if (mode === "") {//hard link
        return link.createHard(parentPath, filename, address);
    } else if (mode === "-s") {//soft link
        return link.createSoft(parentPath, filename, address);
    }
};

Method.prototype.ls = function (mode) {
    if (mode === undefined || mode == null) mode = "";
    let buffer = "";
    let terminal = this.bindTerminal;
    let directory = new Directory();
    let time = new Time();
    let lst = directory.list(currentDir);
    if (mode === "-a") {
        buffer = "..\t";
    } else if (mode === "-l") {
        buffer = "total " + lst.contains.length + "\n";
    }
    lst.contains.forEach(function (item, index, array) {
        if (mode === "" || mode === "-a") {
            buffer += item.name + "\t";
        } else if (mode === "-l") {
            buffer += "6rabbit " +
                terminal.formatType(item.type)
                + time.strtotime(item.time) + " "
                + item.name + "\t\n";
        }
    });
    terminal.print(buffer);
    return 1;
};

Method.prototype.cd = function (route) {
    let terminal = this.bindTerminal;
    let path = terminal.formatPath(route);
    if (path === "/") return -3;
    let lastChar = route.substr(route.length - 1, 1);
    if (lastChar === "/") {
        route = route.substr(0, route.length - 1);
    }
    let file = new File();
    let type = file.getType(path);
    if (type !== "dir") return -5;
    currentDir = path;
    return 1;
};

Method.prototype.cat = function (route) {
    let file = new File();
    let terminal = this.bindTerminal;
    route = terminal.formatPath(route);
    terminal.print(file.read(route));
    return 1;
};

Method.prototype.mkdir = function (route) {
    let terminal = this.bindTerminal;
    route = terminal.formatPath(route);
    let directory = new Directory();
    let file = new File();
    let checkType = file.getType(route);
    if (checkType !== "null") return -1;
    let arr = file.getPathArray(route);
    let dirname = arr[arr.length - 1];
    arr.pop();
    let path = "/" + arr.join("/");
    return directory.create(path, dirname);
};

Method.prototype.touch = function (route) {
    let terminal = this.bindTerminal;
    route = terminal.formatPath(route);
    let file = new File();
    let result = file.getType(route);
    if (result === "null") {
        let filename = file.getFileName(route);
        let parentPath = file.getParentPath(route);
        return file.create(parentPath, filename, "");
    } else {
        let time = new Time();
        return file.changeDate(route, time.time());
    }
};

function _Terminal() {
    this.ostream = ["", ""];
    this.istream = ["", ""];
}

_Terminal.prototype.formatPath = function (path) {
    let first = path.substr(0, 1);
    let second = path.substr(0, 2);
    let buffer = "";
    if (first === "/") {
        buffer = path;
    } else if (second === "./") {
        buffer = currentDir + path.substr(1, path.length - 1);
    } else if (second === "..") {
        let file = new File();
        let currentParent = file.getParentPath(currentDir);
        let parentLastChar = currentParent.substr(currentParent.length - 1, 1);
        let nextFirstChar = (path.substr(2, path.length - 2)).substr(0, 1);
        if (parentLastChar === "/" && nextFirstChar === "/") {
            buffer = currentParent.substr(0, currentParent.length - 1) + path.substr(2, path.length - 2);
        } else if (parentLastChar === "/" || nextFirstChar === "/") {
            buffer = currentParent + path.substr(2, path.length - 2);
        } else if (parentLastChar !== "/" && nextFirstChar !== "/") {
            buffer = currentParent + "/" + path.substr(2, path.length - 2);
        }
    } else {
        buffer = currentDir + (currentDir === "/" ? "" : "/") + path;
    }
    let lastChar = buffer.substr(buffer.length - 1, 1);
    if (lastChar === "/") {
        buffer = buffer.substr(0, buffer.length - 1);
    }
    return buffer;
};

_Terminal.prototype.formatType = function (typename) {
    let len = typename.length;
    let need = colLimit - len;
    let buffer = typename;
    for (let i = 0; i < need; i++) {
        buffer += " ";
    }
    return buffer;
};

_Terminal.prototype.forcePrint = function (data){
    let dom = document.getElementById("stdout");
    dom.innerHTML += data+"\n";
    dom.scrollTo(0,dom.scrollHeight);
};

_Terminal.prototype.print = function (data) {
    if (this.ostream[0] === "") {
        this.forcePrint(data);
    } else if (this.ostream[0] === ">") {
        let file = new File();
        let path = this.formatPath(this.ostream[1]);
        let filetype = file.getType(path);
        if (filetype === "file" || filetype==="hardlink") {
            file.updateContent(path, data);
        } else if (filetype === "null") {
            let filename = file.getFileName(path);
            let parentPath = file.getParentPath(path);
            file.create(parentPath, filename, data);
        } else if (filetype==="softlink"){
            let link = new Link();
            let checkExist = link.softExist(path);
            if(checkExist >0 ){
                file.writeAddress(checkExist,data);
            } else {
                this.forcePrint("Illegal file address.");
            }
        } else {
            this.forcePrint("Doesn't support this type of output.");
        }
    } else if (this.ostream[0] === ">>") {
        let file = new File();
        let path = this.formatPath(this.ostream[1]);
        let filetype = file.getType(path);
        if (filetype === "file" || filetype==="hardlink") {
            let content = file.read(path);
            content += data;
            file.updateContent(this.formatPath(this.ostream[1]), content);
        } else if (filetype === "null") {
            let content = data;
            let filename = file.getFileName(path);
            let parentPath = file.getParentPath(path);
            file.create(parentPath, filename, content);
        } else if (filetype==="softlink"){
            let link = new Link();
            let checkExist = link.softExist(path);
            if(checkExist >0 ){
                file.appendAddress(checkExist,data);
            } else {
                this.forcePrint("Illegal file address.");
            }
        } else {
            this.forcePrint("Doesn't support this type of output.");
        }
    }
    return 1;
};

_Terminal.prototype.scan = function (data) {
    this.forcePrint("> "+data);
    let arr = data.match(terminalReg);
    this.ostream = ["", ""];
    this.istream = ["", ""];
    let istreamFlag = 0, ostreamFlag = 0;
    let that = this;
    arr = arr.filter(function (item, index, array) {
        if (istreamFlag === 1) {
            istreamFlag = 0;
            that.istream[1] = item.trim();
            return false;
        }
        if (ostreamFlag === 1) {
            ostreamFlag = 0;
            that.ostream[1] = item.trim();
            return false;
        }
        let temp = item.trim();
        if (temp === "<" || temp === "<<") {
            that.istream[0] = temp;
            istreamFlag = 1;
            return false;
        }
        if (temp === ">" || temp === ">>") {
            that.ostream[0] = temp;
            ostreamFlag = 1;
            return false;
        }
        return true;
    });
    arr = arr.map(function (item, index, array) {
        return item.trim();
    });
    if (this.istream[0] !== "" && this.istream[1] !== "") {
        let file = new File();
        let content = file.read(this.formatPath(this.istream[1]));
        let append = content.match(terminalReg);
        //don't support more level redirect for effective consideration
        append = append.map(function (item, index, array) {
            return item.trim();
        });
        if (this.istream[0] === "<<") {
            append.forEach(function (item, index, array) {
                arr[arr.length] = item;
            });
        } else if (this.ostream[0] === "<") {
            arr = append;
        }
    }
    let command = arr[0];
    arr.shift();
    let args = "";
    arr.forEach(function (item, index, array) {
        item = item.replace(argsReg, "");
        if (index !== 0) args += ",";
        args += '"' + item + '"';
    });
    let method = new Method(this);
    let result = eval("method." + command + "(" + args + ")");
    if (result < 0) {
        let _index = result * -1;
        this.print(errMessage[_index]);
    }
    return 1;
};