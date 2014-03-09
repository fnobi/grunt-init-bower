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
    
            config.ejs = config.ejs || {};
            config.ejs[name] = {
                templateRoot: 'ejs',
                template: ['*.ejs'],
                dest: env.sitePath,
                include: [
                    'bower_components/ejs-head-modules/*.ejs',
                    'bower_components/ejs-sns-modules/*.ejs',
                    'ejs/layout/*.ejs'
                ],
                silentInclude: true,
                options: {}
            };
            env.tasks.push('ejs:' + name);
            
            if (env.watch) {
                config.watch.ejs = {
                    files: [
                        'ejs/*.ejs',
                        'ejs/**/*.ejs',
                        'options.yaml'
                    ],
                    tasks: ['ejs:' + name]
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
