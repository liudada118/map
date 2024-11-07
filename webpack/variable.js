const path = require('path')

const SRC_PATH = path.join(__dirname, '../src')
const DIST_PATH = path.join(__dirname, '../dist')
const PROJECT_PATH = path.join(__dirname, '../../')
const ISDEV = process.env.NODE_ENV === 'development' ? true : false;

module.exports = {
    SRC_PATH,
    DIST_PATH,
    PROJECT_PATH,
    ISDEV
}