module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Shell commands to send to jekyll
    shell: {
      build: {
        command: 'jekyll build'
      },
      serve: {
        command: 'jekyll serve --baseurl ""'
      },
      publish: {
        command: 'bundle exec rake blog:publish'
      }
    },
    // Compass compilation task.
    compass: {
      dist: {
        options: {
          config: 'config.rb',
          bundleExec: true, // Execute our compass command with bundle exec.
        }
      }
    },
    // Compile YAML data into JSON (HTML templates use YAML, JS scripts use JSON)
    yaml: {
      locationdata: {
        options: {
          ignored: /^_/,
          space: 4,
          customTypes: {
            '!include scalar': function(value, yamlLoader) {
              return yamlLoader(value);
            },
            '!max sequence': function(values) {
              return Math.max.apply(null, values);
            },
            '!extend mapping': function(value, yamlLoader) {
              return _.extend(yamlLoader(value.basePath), value.partial);
            }
          }
        },
        files: [
          // Use YAML file from _data directory to make a JSON file in locations directory   
          {expand: true, cwd: '_data/', src: ['locations.yml'], dest: 'locations/'}
        ]
      },
    },
    // Compile and compress source javascript files
    uglify: {
      javascripts: {
        options: {
          sourceMap: true,
          sourceMapName: 'js/sourcemap.map'
        },
        files: {
          // Compile scripts used across the site 
          'js/main.min.js': ['_javascripts/bootstrap.min.js', '_javascripts/hovernav.js', '_javascripts/responsive-tabs.js'],
          // Special script just for the embedded Google map
          'js/locationsmap.min.js': ['_javascripts/locationsmap.js']
        }
      }
    },
    // The default task we leave running to watch for file changes.
    watch: {
      css: {
        files: '_sass/*.scss',
        tasks: ['compass']
      },
      js: {
        files: '_javascripts/**/*.js',
        tasks: ['uglify:javascripts']
      },
      data: {
        files: '_data/**/*.yml',
        tasks: ['yaml:locationdata']
      },
      jekyll: {
        files: [
          '_includes/*.html',
          '_layouts/*.html',
          '_data/*.yml',
          '_config.yml',
          'js/*.js',
          'css/*.css',
          'images/**/*.png',
          'images/**/*.svg',
          'images/**/*.jpg',
          'index.html',
          'about/*.html',
          'locations/*.html',
          'locations/*.json',
          'news/*.html',
          'news/_posts/*.md',
          'programs/*.html',
          'spotlight/*.html',
          'spotlight/_posts/*.md'
        ],
        tasks: ['shell:build', 'shell:serve'],
        options: {
          interrupt: true,
          atBegin: true,
          livereload: true
        }
      }
    }
  });
  // Load extension for running shell commands
  grunt.loadNpmTasks('grunt-shell');
  // Load the 'watch' task extension.
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Load extension for jekyll
  grunt.loadNpmTasks('grunt-jekyll');
  // Load extension to compile sass/compass.
  grunt.loadNpmTasks('grunt-contrib-compass');
  // Load extension to compile and minify javascript 
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load extension to convert YAML into JSON (used for location data)
  grunt.loadNpmTasks('grunt-yaml');
  // Register default task to watch for file changes.
  grunt.registerTask('default',['shell:serve', 'watch']);
  grunt.registerTask('serve',['shell:serve', 'watch']);
  grunt.registerTask('build',['shell:build']);
  grunt.registerTask('publish',['shell:publish']);
};