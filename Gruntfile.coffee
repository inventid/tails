module.exports = ( grunt ) ->
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
          'dist/tails.js': [
            'src/tails.coffee'
            'src/mixins/collectable.coffee'
            'src/mixins/dynamic_properties.coffee'
            'src/mixins/interceptable.coffee'
            'src/mixins/relations.coffee'
            'src/mixable.coffee'
            'src/model.coffee'
            'src/collection.coffee'
            'src/view.coffee'
            'src/template.coffee'
          ]

      spec:
        files: [
          expand: true
          cwd: './spec'
          src: ['**/*.coffee']
          dest: 'spec_dist'
          ext: '.js'
        ]

    concat:
      all:
        options:
          banner: '<%= meta.banner %>'
        files:
          'dist/tails.js': 'dist/tails.js'

    uglify:
      all:
        options:
          banner: '<%= meta.banner %>'
          report: 'gzip'
        files:
          'dist/tails.min.js': 'dist/tails.js'

    # 'mocha-chai-sinon':
    #     build:
    #         src: [ 'spec_dist/**/*.js']
    #         options:
    #             ui: 'bdd'
    #             reporter: 'spec'

    #     coverage:
    #         src: ['dist/tails.js', 'spec_dist/**/*.js']
    #         options:
    #             ui: 'bdd'
    #             reporter: 'html-cov'
    #             quiet: true
    #             captureFile: 'coverage.html'

    clean:
      spec: ['spec_dist']


    watch:
      all:
        files: 'src/**/*.coffee'
        tasks: ['build', 'spec']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  # grunt.loadNpmTasks 'grunt-mocha-chai-sinon'
  grunt.loadNpmTasks 'grunt-contrib-watch'


  grunt.registerTask 'default', ['watch']
  # grunt.registerTask 'spec',  ['coffee:dist', 'coffee:spec', 'mocha-chai-sinon', 'clean:spec']
  grunt.registerTask 'build',   ['coffee', 'concat', 'uglify']
