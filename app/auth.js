function originIsAllowed(origin) {
    // TODO: put logic here to detect whether the specified origin is allowed.
    return true;
}

function authenticate() {
    // TODO: put auth logic here.
    return true;
}

module.exports = {
    originIsAllowed: originIsAllowed,
    authenticate: authenticate,
}