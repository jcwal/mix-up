module.exports = function (grunt) {
    'use strict';


    var
        defaultTasks = [
            // run grunt watch
            'watch'
        ],

        watchTasks = [
            // compiles less to docs
            'less:buildCSS',

            // auto prefix doc files
            'autoprefixer:prefixFile',

            // copies assets and js over to docs
            'copy:copyFile',

            // create concatenated css release
            'concat:createCSSPackage',

            // create concatenated js release
            'concat:createJSPackage'
        ];

    var preserveFileExtensions = function (folder, filename) {
            return folder + filename.substring(0, filename.lastIndexOf('.')) + '.css';
        },
        preserveMinFileExtensions = function (folder, filename) {
            return folder + filename.substring(0, filename.lastIndexOf('.')) + '.min.css';
        };

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author %> and Contributes.\n' +
            ' * Licensed under <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
            ' */\n',
        jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n',


        clean: {
            options: {
                force: true
            },
            dist: ['dist']
        },

        copy: {
            copyFile: {
                files: [
                    // exact copy for less
                    {
                        expand: true,
                        cwd: 'src/**/*.less',
                        src: [
                            '**/*'
                        ],
                        dest: 'dist/build/less'
                    },
                    // copy everything but less files for uncompressed release
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '**/*.js',
                            'images/*',
                            'fonts/*'
                        ],
                        dest: 'dist/build/uncompressed'
                    },
                    // copy assets only for minified version
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            'images/*',
                            'fonts/*'
                        ],
                        dest: 'dist/build/minified'
                    },

                    // copy assets only for packaged version
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            'images/*',
                            'fonts/*'
                        ],
                        dest: 'dist/build/packaged'
                    }
                ]
            }
        },

        less: {
            options: {
                paths: ['src'],
                compress: false,
                optimization: 2
            },
            buildCSS: {
                expand: true,
                cwd: 'src',
                src: [
                    '**/*.less'
                ],
                dest: 'dist/build/uncompressed/',
                rename: preserveFileExtensions
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                    'last 2 version',
                    '> 1%',
                    'opera 12.1',
                    'safari 6',
                    'ie 9',
                    'bb 10',
                    'android 4'
                ]
            },
            prefixFile: {
                src: 'dist/build/**/*.css'
            }
        },

        concat: {
            createCSSPackage: {
                src: ['dist/build/uncompressed/**/*.css'],
                dest: 'dist/build/packaged/css/<%= pkg.name %>.css'
            },
            createJSPackage: {
                src: ['dist/build/uncompressed/**/*.js'],
                dest: 'dist/build/packaged/js/<%= pkg.name %>.js'
            }
        },


        cssmin: {
            options: {
                keepSpecialComments: 0,
                report: 'min',
                banner: '<%= banner %>'
            },

            // copy minified css to minified release
            minifyCSS: {
                expand: true,
                cwd: 'dist/build/uncompressed',
                src: [
                    '**/*.css'
                ],
                dest: 'dist/build/minified/',
                rename: preserveMinFileExtensions
            },

            // add comment banner to css release
            createMinCSSPackage: {
                files: {
                    'dist/build/packaged/css/<%= pkg.name %>.min.css': [
                        'dist/build/uncompressed/**/*.css'
                    ]
                }
            }
        },

        uglify: {

            minifyJS: {
                expand: true,
                cwd: 'dist/build/uncompressed',
                src: [
                    '**/*.js'
                ],
                dest: 'dist/build/minified',
                ext: '.min.js',
                banner: '<%= banner %>\n<%= jqueryCheck %>'
            },

            createMinJSPackage: {
                options: {
                    mangle: true,
                    compress: true,
                    banner: '<%= banner %>\n<%= jqueryCheck %>'
                },
                files: {
                    'dist/build/packaged/javascript/<%= pkg.name %>.min.js': [
                        'dist/build/uncompressed/**/*.js'
                    ]
                }
            }
        },

        watch: {
            options: {
                spawn: false
            },
            src: {
                files: [
                    'build/examples/**/*',
                    'src/**/*.less',
                    'src/**/*.js'
                ],
                tasks: watchTasks
            }
        }
    });


    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.registerTask('default', defaultTasks);
}