module.exports = function (grunt) {
    var path = require('path');
    var config = {};

    var alias = {
        $: 'jquery',
        _: 'underscore'
    };

    // basic
    {
        config.pkg =  grunt.file.readJSON('package.json');

        grunt.loadNpmTasks('grunt-contrib-watch');
        config.watch = {};
    }

    // release
    {
        grunt.loadNpmTasks('grunt-release');

        config.release = {
            options: {
                file: '../bower.json',
                npm: false
            }
        };
    }

    var configureEnv = function (name, env) {
        // ejs
        if (env.ejs) {
            grunt.loadNpmTasks('grunt-simple-ejs');

            var options = {
                name: '{%= name %}'
            };
    
            config.ejs = config.ejs || {};
            config.ejs['README'] = {
                templateRoot: 'ejs',
                template: 'README.md.ejs',
                dest: env.sitePath,
                options: options
            };
            config.ejs['demo'] = {
                templateRoot: 'ejs',
                template: 'index.html.ejs',
                dest: env.sitePath + 'demo',
                options: options
            };
            env.tasks.push('ejs');
            
            if (env.watch) {
                config.watch.ejs = {
                    files: [
                        'ejs/*.ejs'
                    ],
                    tasks: ['ejs']
                };
            }
        }

    
        // test
        if (env.test) {
            grunt.loadNpmTasks('grunt-mocha-html');
            grunt.loadNpmTasks('grunt-mocha-phantomjs');
    
            config.mocha_html = config.mocha_html || {};
            config.mocha_html[name] = {
                src   : [ path.resolve(env.sitePath, 'js', '{%= name %}.js') ],
                test  : [ 'test/*-test.js' ],
                assert : 'chai'
            };
            env.tasks.push('mocha_html');
    
            
            if (env.watch) {
                config.watch.test = {
                    files: ['test/*-test.js'],
                    tasks: ['mocha_phantomjs']
                };
            }
    
            config.mocha_phantomjs =  {
                all: [ 'test/*.html' ]
            };
    
            grunt.registerTask('test', ['mocha_phantomjs']);
    
        }
    
        // set as task
        grunt.registerTask(name, env.tasks);
    };

    configureEnv('dev', {
        tasks: [],
        sitePath: '../',
        httpPath: '/',
        watch: true,
        ejs: true,
        test: true
    });

    // init
    grunt.initConfig(config);
    grunt.registerTask('default', ['dev']);
};
