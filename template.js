var escapeFiles = require('./lib/escapeFiles'),
    shellLines = require('./lib/shellLines');

exports.description = 'bower component template';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = '';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {

    init.process( {}, [
        init.prompt('name'),
        init.prompt('description'),
        init.prompt('version'),
        init.prompt('repository'),
        init.prompt('homepage'),
        // init.prompt('bugs')
        // init.prompt('licenses')
        init.prompt('author_name'),
        init.prompt('author_email')
        // init.prompt('author_url')
        // init.prompt('jquery_version')
    ], function(err, props) {
        // package setting
        var pkg = {
            name: props.name,
            description: props.description,
            version: props.version,
            scripts: { },
            engines: {
                node: '>=0.8.0 <0.9.1'
            },
            devDependencies: {
                'grunt': '~0.4.0',
                'grunt-contrib-watch': '~0.1.1',
                'grunt-koko': '0.1.1',
                'grunt-simple-ejs': '0.3.0',
                'grunt-mocha-html': '0.1.0',
                'grunt-mocha-phantomjs': '~0.2.8',
                'grunt-release': '~0.5.1',
                'mocha': '~1.9.0',
                'chai': '~1.6.1'
            }
        };

        // bower setting
        var bower = {
            name: props.name,
            version: props.version,
            main: props.name + '.js',
            dependencies: {
            }
        };


        // add template info to props.
        props.template_name = 'bower';

        props.project_path = process.cwd();

        props.pkg = pkg;
        props.bower = bower;


        // Files to copy (and process).
        var files = init.filesToCopy(props);

        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {});

        // write package.json
        init.writePackageJSON('src/package.json', pkg);

        // write bower.json
        init.writePackageJSON('bower.json', bower);

        // npm install & git init
        shellLines([{
            command: 'cd src; npm install',
            message: 'Installing npm dependencies'
        }, {
            command: 'git init',
            message: 'Initializing git'
        }]);
    });
};

