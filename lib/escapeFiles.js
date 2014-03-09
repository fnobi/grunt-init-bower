var grunt = require('grunt');

var escapeFiles = function (pattern, files) {
    for (var i in files) {
        var mtch = grunt.file.isMatch({ matchBase: true }, pattern, i);
        if (mtch) { delete files[i]; }
    }
};

module.exports = escapeFiles;
