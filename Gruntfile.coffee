module.exports = ( grunt ) ->
  srcs = [
    'tails'
    'utils/hash'
    'mixable'
    'mixins/interceptable'
    'mixins/debug'
    'mixins/dynamic_attributes'

    'collection'
    'mixins/collectable'
    'associations/relation'
    'associations/belongs_to_relation'
    'associations/has_one_relation'
    'associations/has_many_relation'
    'associations/association'
    'mixins/associable'
    'mixins/storage'
    'mixins/history'

    'model'
    'template'
    'view'

    'config'
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

  # Coverage thresholds
  thresholds =
    lines: 60
    statements: 50
    branches: 40
    functions: 50

  # This functions makes the config shorter and clearer later on.
  # It just returns the type specific coverage config
  coverage = ( type, optionsRef ) ->
    optionsRef.template = require('grunt-template-jasmine-istanbul')
    optionsRef.templateOptions =
      coverage: 'stat/coverage/coverage.json'
      thresholds: thresholds
      report:
        type: type
        options:
          dir: "stat/coverage/#{type}"

    return optionsRef

  # Configure all the tasks!
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    coffee:
      src:
        options:
          sourceMap: true
        files: [
          expand: true
          cwd: 'src'
          src: srcs.map ( src ) -> src + '.coffee'
          dest: 'dist'
          ext: '.js'
        ]

      spec:
        options:
          sourceMap: true
        files: [
          expand: true
          cwd: 'spec'
          src: ['**/*.coffee']
          dest: 'build/spec'
          ext: '.js'
        ]

      perf:
        files: [
          expand: true
          cwd: 'perf'
          src: ['**/*.coffee']
          dest: 'build/perf'
          ext: '.js'
        ]

    browserify:
      default:
        files: 'dist/tails.browser.js': 'dist/tails.js'
        options:
          sourceMap: false
          # alias: [
          #   './bower_components/underscore/underscore.js:underscore'
          #   './bower_components/inflection/lib/inflection.js:inflection'
          #   './bower_components/q/q.js:q'
          #   './bower_components/jquery/jquery.js:jquery'
          #   './bower_components/backbone/backbone.js:backbone'
          #   './bower_components/backbone-deferred/backbone-deferred-q.js:backbone-deferred-q'
          #   './bower_components/rivets/dist/rivets.js:rivets'
          # ]
          browserifyOptions:
            standalone: 'Tails'
      istanbul:
        files: 'build/spec/tails.browser.js': 'dist/tails.js'
        options:
          sourceMap: true
          # alias: [
          #   './bower_components/underscore/underscore.js:underscore'
          #   './bower_components/inflection/lib/inflection.js:inflection'
          #   './bower_components/q/q.js:q'
          #   './bower_components/jquery/jquery.js:jquery'
          #   './bower_components/backbone/backbone.js:backbone'
          #   './bower_components/backbone-deferred/backbone-deferred-q.js:backbone-deferred-q'
          #   './bower_components/rivets/dist/rivets.js:rivets'
          # ]
          transform: [require('browserify-istanbul')]
          browserifyOptions:
            standalone: 'Tails'

    uglify:
      default:
        files: 'dist/tails.browser.min.js': 'dist/tails.browser.js'

    jasmine:
      default:
        src:  ['dist/tails.browser.js']
        options:
          keepRunner: true
          vendor: deps.concat('bower_components/jasmine-ajax/lib/mock-ajax.js')
          specs: 'build/spec/**/*.js'
      lcovonly:
        src:  ['build/spec/tails.browser.js']
        options: (coverage 'lcovonly',
          keepRunner: true
          vendor: deps.concat('bower_components/jasmine-ajax/lib/mock-ajax.js')
          specs: 'build/spec/**/*.js'
        )
      html:
        src: ['build/spec/tails.browser.js']
        options: (coverage 'html',
          vendor: deps.concat('bower_components/jasmine-ajax/lib/mock-ajax.js')
          specs: 'build/spec/**/*.js'
        )

    benchmark:
      default:
        src: ['build/perf/**/*.js']
        dest: 'stat/perf/result.csv'

    clean:
      build: ['build']

    watch:
      default:
        files: ['src/**/*.coffee', 'spec/**/*.coffee']
        tasks: ['spec']

    codo:
      files: ['src/**/*.coffee']

  # grunt.loadNpmTasks 'grunt-babel'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-benchmark'
  grunt.loadNpmTasks 'grunt-codo'

  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'dist',    ['coffee:src', 'browserify:default']
  grunt.registerTask 'spec',    ['clean', 'dist', 'coffee:spec' ,'jasmine:default']
  grunt.registerTask 'perf',    ['clean', 'dist', 'coffee:perf' ,'benchmark:default']
  grunt.registerTask 'test',    ['spec', 'browserify:istanbul', 'jasmine:lcovonly']
  grunt.registerTask 'coverage',    ['spec', 'browserify:istanbul', 'jasmine:html']
