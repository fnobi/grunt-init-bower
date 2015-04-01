var escapeFiles = require('./lib/escapeFiles'),
    shellLines = require('./lib/shellLines');

exports.description = 'web page template (compass + auto deps + mocha + koko)';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = '';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {

    // override template delimiter
    grunt.template.addDelimiters('init', '//[', ']//');

    init.process( {}, [
        init.prompt('name'),
        init.prompt('description'),
        init.prompt('version'),
        init.prompt('repository'),
        init.prompt('homepage'),
        // init.prompt('bugs'),
        // init.prompt('licenses'),
        init.prompt('author_name'),
        init.prompt('author_email'),
        // init.prompt('author_url'),
        // init.prompt('jquery_version'),
        {
            name: 'is_class',
            message: 'Is this class? [Y|n]',
            default: 'n',
            validator: /^(Y|n)$/
        },
        {
            name: 'with_test',
            message: 'use mocha test. [Y|n]',
            default: 'Y',
            validator: /^(Y|n)$/
        }
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
                'grunt-este-watch': '~0.1.15',
                'grunt-contrib-copy': '0.5.0',
                'grunt-contrib-compass': '0.3.0',
                'grunt-auto-deps': '0.4.2',
                'grunt-koko': '0.1.1',
                'grunt-simple-ejs': '0.3.0',
                'grunt-mocha-html': '0.1.0',
                'grunt-mocha-phantomjs': '~0.2.8',
                "grunt-html-validation": "~0.1.18",
                'grunt-release': '~0.5.1',
                'mocha': '~1.9.0',
                'chai': '~1.6.1'
            }
        };

        // add template info to props.
        props.template_name = 'bower';

        props.project_path = process.cwd();

        props.is_class = props.is_class == 'Y';

        props.camelCasedName = (function (name) {
            var parts = name.split(/-|_/);
            var camelCased = parts.shift();
            parts.forEach(function (part) {
                camelCased += [
                    part.substr(0, 1).toUpperCase(),
                    part.substr(1)
                ].join('');
            });
            return camelCased;
        })((props.is_class ? '-' : '') + props.name);

        props.with_test = props.with_test == 'Y';

        // bower setting
        var bower = {
            name: props.name,
            description: props.description,
            version: props.version,
            main: 'src/js/' + props.camelCasedName + '.js',
            dependencies: {
                'jquery': '1.*'
            },
            ignore: [
                'Gruntfile.js',
                'package.json',
                'node_modules',
                'test',
                'src/ejs',
                'src/options.yaml'
            ]
        };

        props.pkg = pkg;
        props.bower = bower;


        // Files to copy (and process).
        var files = init.filesToCopy(props);

        if (!props.with_test) {
            escapeFiles('src/test/*.*', files);
            delete pkg.devDependencies['grunt-mocha-html'];
            delete pkg.devDependencies['grunt-mocha-phantomjs'];
            delete pkg.devDependencies['chai'];
            delete pkg.devDependencies['mocha'];
        }


        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {});

        // write package.json
        init.writePackageJSON('package.json', pkg);

        // write bower.json
        init.writePackageJSON('bower.json', bower);

        // npm install & bower install
        shellLines([{
            command: 'cd src; npm install',
            message: 'Installing npm dependencies'
        },{
            command: 'bower install',
            message: 'Installing bower dependencies'
        },{
            command: 'git init; git add .; git commit -m "scaffold."',
            message: 'Initialize git'
        }], done);
    });
};
