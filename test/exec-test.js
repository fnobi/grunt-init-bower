var fs     = require('fs'),
    path   = require('path'),
    spawn   = require('child_process').spawn,
    async  = require('async'),
    mkdirp = require('mkdirp'),
    remove = require('remove'),
    chai   = require('chai'),
    should = chai.should;


describe('grunt-init', function () {
    var templatePath = path.resolve(__dirname, '../');

    before(function (done) {
        var projectPath = '/tmp/test';

        async.series([function (next) {
            if (!fs.existsSync(projectPath)) {
                return next();
            }
            remove(projectPath, next);
        }, function (next) {
            mkdirp(projectPath, next);
        }, function (next) {
            process.chdir(projectPath);
            next();
        }], done);
    });

    it('exec', function (done) {
        var init = spawn('grunt-init', [templatePath]);

        init.stdout.on('data', function (data) {
            // pass dialogue by enter
            init.stdin.write('\n');
        });

        init.on('close', function (code) {
            done();
        });

    });
});