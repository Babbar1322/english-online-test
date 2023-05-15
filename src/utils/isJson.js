const isJson = (obj) => {
    try {
        if (obj === null || obj === undefined) return false;
        JSON.parse(obj);
    } catch (e) {
        return false;
    }
    return true;
};

export default isJson;
