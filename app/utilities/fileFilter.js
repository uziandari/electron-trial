const fileFilter = function (fileName) {

    if (fileName.match(/\.(csv)$/)) {
        return ','
    } else if (fileName.match(/\.(txt)$/)) {
        return '\t'
    }

};

module.exports = fileFilter;