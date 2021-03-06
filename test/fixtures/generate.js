const fs = require('fs');
const path = require('path');
const Common = require('../common/common');

function clearDir(dir) {
    const _dir = __dirname +"\\" +dir+'\\';
    fs.readdirSync(_dir).forEach(file => {
        fs.unlinkSync(path.join(_dir, file));
    });
}

// width and height of canvas
const w = 100, h = 100;
function generate () {
    const snippets = fs.readdirSync(path.join(__dirname, 'snippets'));
    const promises = snippets.map((filename, idx) => {
        const canvas = Common.createHeadlessCanvas(w, h);
        const gl = canvas.getContext('webgl');
        const filepath = path.join(__dirname, 'expected', 'fixture' + idx + '.png');
        const fn = require('./snippets/' + filename);
        fn(gl,canvas);
        return new Promise(function (resolve, reject) {
            Common.writeGlImage(canvas, filepath, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });

    Promise.all(promises).then(function (data) {
        console.log(`All ${promises.length} fixtures are generated.`);
    });
}

clearDir('expected');
generate();
