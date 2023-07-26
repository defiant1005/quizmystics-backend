const {trimStr} = require("./helpers/utils");

let users = [];

const findUser = (user) => {
    const userName = trimStr(user.name)
    const userRoom = trimStr(user.room)

    return users.find((u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom)
}


const addUser = (user, isRoomAdmin = false) => {
    const isExist = findUser(user);
    if (isRoomAdmin) {
        user.isRoomAdmin = true
    }

    if (!isExist) {
        users.push(user)
    }

    const currentUser = isExist || user;

    return {
        isExist: !!isExist,
        user: currentUser
    }
}

const getRoomUsers = (room) => users.filter(u => u.room === room)

module.exports = { addUser, findUser, getRoomUsers }