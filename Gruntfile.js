// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function (grunt) {

  var filesConfig = require('./config/files.config'),
    watchedFiles = filesConfig.watchedFiles,
    jshintrc = grunt.file.readJSON('.jshintrc');

  grunt.initConfig ({
    pkg: grunt.file.readJSON('package.json'),

    assets: 'client/assets',
    components: '<%= assets %>/js',
    clientdist: 'client/dist',

    // The clean task ensures all files are removed from the dist/ directory so
    // that no files linger from previous builds.
    clean: {
      dist: {
        src: ['dist']
      },
      clientDist: {
        src: ['<%= clientdist %>']
      },
      docs: {
        src: ['client/docs']
      },
      reports: {
        src: ['client/test-reports']
      }
    },

    // The jshint option for scripturl is set to lax, because the anchor
    // override inside main.js needs to test for them so as to not accidentally
    // route.
    jshint:{
      options: jshintrc,
      code: {
        src: ['<%= clientdist %>/assets/js/app.js']
      },
      specs: {
        src: ['client/test/**/*.js'],
        options: {
          expr: true
        }
      }
    },

    // Compiles the Less files into the style.css file.
    less:{
      app:{
        options: {
          paths: ['<%= assets %>/less']
        },
        files: {
          '<%= clientdist %>/assets/css/style.css': '<%= assets %>/less/style.less'
        }
      }
    },

    browserify: {
      options: {
        transform:[
          require('browserify-shim'),
          require('grunt-react').browserify
        ]
      },
      app: {
        src: ['client/src/main.js'],
        dest: '<%= clientdist %>/assets/js/app.js'
      }
    },

    // The concatenate task is used here to merge the almond require/define
    // shim and the templates into the application code.
    concat:{
      css: {
        src: [
          'node_modules/select2/select2.css',
          'node_modules/nprogress/nprogress.css',
          '<%= components %>/messenger/build/css/messenger.css',
          '<%= clientdist %>/assets/css/style.css'
        ],
        dest: '<%= clientdist %>/assets/css/style.css'
      }
    },

    // This task uses the MinCSS Node.js project to take all your CSS files in
    // order and concatenate them into a single CSS file named style.css.  It
    // also minifies all the CSS as well.  This is named style.css, because we
    // only want to load one stylesheet in index.html.
    cssmin: {
      all: {
        files: {
          '<%= clientdist %>/assets/css/style.min.css': ['<%= clientdist %>/assets/css/style.css']
        }
      }
    },

    // Takes the built app.js file and minifies it for filesize benefits.
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true
      },
      dist: {
        files: {
          '<%= clientdist %>/assets/js/app.min.js': ['<%= clientdist %>/assets/js/app.js']
        }
      }
    },

    // Stages all the files for running the application.  Each of these
    // tasks are cumulative where production builds off of debug, debug
    // off of development, and development off of vendor.
    // vendor: All of the 3rd party library files
    // development: All of the files required for development mode
    // debug: All of the files required for debug mode
    // production:  All of the files required for production mode
    copy: {
      vendor: {
        files: [
          {
            expand: true,
            cwd: '<%= components %>/font-awesome/fonts',
            src:['**'],
            dest:'<%= clientdist %>/assets/font/font-awesome'
          },
          {
            expand: true,
            cwd: '<%= components %>/lato/font',
            src:['**'],
            dest:'<%= clientdist %>/assets/font/lato'
          }
        ]
      },
      development: {
        files: [
          {
            expand: true,
            cwd: '<%= assets %>',
            src: ['img/**', 'font/**'],
            dest: '<%= clientdist %>/assets'
          },
          {
            src: '<%= assets %>/html/index.html',
            dest:'<%= clientdist %>/<%= pkg.name %>/index.html'
          }
        ]
      },
      production: {
        files: [
          {
            expand: true,
            cwd: '<%= clientdist %>/assets',
            src: ['css/style.min.css', 'font/**', 'img/**', 'js/app.min.js', 'js/app.min.js.map'],
            dest: '<%= clientdist %>/<%= pkg.name %>/assets'
          },
          {
            src: '<%= assets %>/html/index.html',
            dest:'<%= clientdist %>/<%= pkg.name %>/index.html'
          }
        ]
      }
    },

    // Compile the **jade** templates into html for deployment
    jade: {
      development: {
        options: {
          pretty: true,
          data: {
            env: 'development',
            applicationScripts : filesConfig.getScripts('client/src', 'src'),
            templateScripts: [
              'assets/templates/main.templates.js',
              'assets/templates/lib.templates.js'
            ],
            componentScripts: filesConfig.getComponents('assets/js')
          }
        },
        files: {
          '<%= assets %>/html/index.html': ['api/src/views/index.jade']
        }
      },
      production: {
        options: {
          data: {
            debug: false,
            env: 'production'
          }
        },
        files: {
          '<%= assets %>/html/index.html': ['api/src/views/index.jade']
        }
      }
    },

    // The **docco** task iterates through the `src` files and creates annotated source reports for them.
    docco: {
      options: {
        layout: 'parallel'
      },
      client: {
        options: {
          output: 'dist/docs/client/'
        },
        src: 'client/src/**/*.js'
      },
      app: {
        options: {
          output: 'dist/docs/app/'
        },
        src: 'app/**/*.js'
      },
      grunt: {
        options: {
          output: 'dist/docs/docs/grunt/'
        },
        src: 'Gruntfile.js'
      },
      config: {
        options: {
          output: 'dist/docs/config/'
        },
        src: 'config/**/*.js'
      }
    },

    env: {
      development: {
        NODE_ENV: 'development'
      },
      production: {
        NODE_ENV: 'production'
      }
    },

    shell: {
      server: {
        options: {
          stdout: true,
          stderror: true
        },
        command: 'nodemon api/server.js'
      },
      debug: {
        options: {
          stdout: true,
          stderror: true
        },
        command: 'node-debug api/server.js'
      }
    },

    // A task that runs in the background 'watching' for changes to code.
    watch: {
      options: {
        livereload: true,
        atBegin: true
      },
      development: {
        files: watchedFiles,
        tasks: ['dev', 'jest:unit']
      },
      production: {
        files: watchedFiles,
        tasks: ['prod', 'jest:unit']
      }
    },

    concurrent: {
      clean: ['clean:dist', 'clean:clientDist', 'clean:docs', 'clean:reports'],
      dev1: ['browserify:app', 'less', 'jade:development'],
      dev2: ['concat:css', 'copy:vendor'],
      prod1:['cssmin', 'uglify', 'jade:production'],
      development: {
        tasks: ['watch:development', 'serve:development'],
        options: {
          logConcurrentOutput: true
        }
      },
      production: {
        tasks: ['watch:production', 'serve:production'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

  // *********************************************************************************************
  // New Tasks go below here !!!

    // Starts the Jest runner for unit tests.
    // Tests are run when the task is re-invoked from the watch task
    jest: {
      unit: {

      },
      coverage: {
        options: {
          coverage: true
        }
      }
    },

    // Starts the protractor e2e tests.
    protractor: {
      options: {
        configFile: './config/protractor.config.js',
        keepAlive: true,
        noColor: false
      },
      e2e: {
      },
      debug: {
        options: {
          debug: true
        }
      }
    }

  });

  // *********************************************************************************************
  // Load NPM Grunt Tasks
  require('load-grunt-tasks')(grunt);

  // **********************************************************************************************
  // The default task is the development task
  grunt.registerTask('default', [
    'concurrent:clean',
    'concurrent:dev1',
    'concurrent:dev2',
    'copy:development'
  ]);

  grunt.registerTask('dev', ['default']);

  // Task to minify the codez for production and prepare for deployment
  grunt.registerTask('prod', ['dev',  'concurrent:prod1', 'copy:production']);

  // Tasks to run the node server and rest api
  grunt.registerTask('serve:development', ['env:development', 'shell:server']);
  grunt.registerTask('serve:production', ['env:production', 'shell:server']);
  grunt.registerTask('debugger', ['env:development', 'shell:debug']);

  grunt.registerTask('development', ['concurrent:development']);
  grunt.registerTask('production', ['concurrent:production'])
};
