exports = module.exports = function () {
    return {
        times: require('./times')(),
        equals: require('./equals')(),
        json: require('./json')(),
        tagify: require('./tagify')(),
        capitalize: require('./capitalize')(),
        urlencode: require('./urlencode')(),
        urldecode: require('./urldecode')(),
        parsesource: require('./parsesource')()
    };
};
