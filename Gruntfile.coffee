

module.exports = ( grunt ) ->
  srcs = [
    'src/tails.coffee'
    'src/utils/hash.coffee'
    'src/mixins/interceptable.coffee'
    'src/mixins/debug.coffee'
    'src/mixable.coffee'

    'src/mixins/dynamic_attributes.coffee'
    'src/collection.coffee'
    'src/mixins/collectable.coffee'
    'src/associations/relation.coffee'
    'src/associations/belongs_to_relation.coffee'
    'src/associations/has_one_relation.coffee'
    'src/associations/has_many_relation.coffee'
    'src/associations/association.coffee'
    'src/mixins/associable.coffee'
    'src/mixins/storage.coffee'
    'src/mixins/history.coffee'

    'src/model.coffee'
    'src/template.coffee'
    'src/view.coffee'

    'src/export.coffee'
  ]

  deps = [
    'bower_components/underscore/underscore.js'
    'bower_components/inflection/lib/inflection.js'
    'bower_components/q/q.js'
    'bower_components/jquery/jquery.js'
    'bower_components/backbone/backbone.js'
    'bower_components/backbone-deferred/backbone-deferred-q.js'
    'bower_components/rivets/dist/rivets.js'
  ]

  bundle = deps.concat('build/tails.js')

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-requirejs'
  grunt.loadNpmTasks 'grunt-plato'

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    meta:
      banner:
        '// Tails\n' +
        '// version: <%= pkg.version %>\n' +
        '// contributors: <%= pkg.contributors %>\n' +
        '// license: <%= pkg.licenses[0].type %>\n'

    coffee:

      dist:
        options:
          join: true
        files:
          'dist/tails.js': srcs

      build:
        options:
          join: true
          sourceMap: true
        files:
          'build/tails.js': srcs

      modules:
        options:
          join: false
          sourceMap: true
        files: [
          expand: true
          cwd: 'src'
          src: ['**/*.coffee']
          dest: '.grunt/tails/src_compiled'
          ext: '.js'
        ]

      spec:
        files: [
          expand: true
          cwd: 'spec'
          src: ['**/*.coffee']
          dest: '.grunt/tails/spec_compiled'
          ext: '.js'
        ]


    concat:
      bundle:
        options:
          banner: '<%= meta.banner %>'
        files:
          'dist/tails.bundle.js': bundle

    uglify:
      dist:
        options:
          banner: '<%= meta.banner %>'
          report: 'gzip'
        files:
          'dist/tails.min.js': 'dist/tails.js'
      bundle:
        options:
          banner: '<%= meta.banner %>'
          report: 'gzip'
        files:
          'dist/tails.bundle.min.js': 'dist/tails.bundle.js'

    jasmine:
      build:
        src: ['build/tails.js']
        options:
          specs: '.grunt/tails/spec_compiled/**/*.js'
          vendor: bundle.concat('bower_components/jasmine-ajax/lib/mock-ajax.js')
          template: require('grunt-template-jasmine-istanbul')
          templateOptions:
            coverage: 'statistics/coverage/coverage.json'
            report:
              type: 'lcovonly'
              options:
                dir: '.grunt/tails/coverage/lcov'
            thresholds:
              lines: 60
              statements: 60
              branches: 60
              functions: 60
      html:
        src: ['build/tails.js']
        options:
          specs: '.grunt/tails/spec_compiled/**/*.js'
          vendor: deps
          template: require('grunt-template-jasmine-istanbul')
          templateOptions:
            coverage: 'statistics/coverage/coverage.json'
            report:
              type: 'html'
              options:
                dir: 'statistics/coverage/html'
            thresholds:
              lines: 60
              statements: 60
              branches: 60
              functions: 60

    plato:
      all:
        options:
          jshint: false
        files:
          'statistics/complexity' : ['.grunt/tails/src_compiled/**/*.js']


    clean:
      build: ['build']
      spec:  ['.grunt/tails/spec_compiled']
      grunt: ['.grunt']

    watch:
      all:
        files: 'src/**/*.coffee'
        tasks: ['build', 'spec']

  grunt.registerTask 'watch',   ['coffee:build', 'watch']
  grunt.registerTask 'spec',    ['clean:spec', 'coffee:build', 'coffee:spec', 'jasmine:build', 'clean:spec']
  grunt.registerTask 'build',   ['coffee:build']
  grunt.registerTask 'dist',    ['coffee:dist', 'uglify:dist']
  grunt.registerTask 'bundle',  ['coffee:dist', 'concat:bundle', 'uglify:bundle']
  grunt.registerTask 'analyze', ['coffee','jasmine:html', 'plato']
