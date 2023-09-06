
const fs = require("fs").promises
const USER_JSON_FILE = './public/userdata/user.json';


async function fetchAllUsers() {
    const data = await fs.readFile(USER_JSON_FILE);
    const userdata = JSON.parse(data.toString());
    return userdata;
}

async function fetchUser(ID) {
    const userdata = await fetchAllUsers();
    const user = userdata.find((userdata) => userdata.ID == ID);
    return user;
}

async function createUser(newUser){
    const userdata = await fetchAllUsers();
    userdata.push(newUser);
    await fs.writeFile(USER_JSON_FILE, JSON.stringify(userdata));
}

module.exports.fetchAllUsers = fetchAllUsers;
module.exports.fetchUser = fetchUser;
module.exports.createUser = createUser;