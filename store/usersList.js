let allUsersFromDB = null;

const setAllUsersFromDB = (usersArray) => {
    allUsersFromDB = usersArray;
}

const getAllUsersFromDB = () => allUsersFromDB;

module.exports = { setAllUsersFromDB, getAllUsersFromDB }