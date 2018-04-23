/**
 * Require dependencies.
 */
var gulp = require("gulp");
var gulpSequence = require("gulp-sequence");
var del = require("del");
var argv = require("yargs");
var rename = require("gulp-rename");
var slash = require("gulp-slash");
var rev = require("gulp-rev");
var revDel = require("gulp-rev-delete-original");
var revReplace = require("gulp-rev-replace");
var sass = require("gulp-sass");
var cssmin = require("gulp-cssmin");
var minifyHtml = require("gulp-minify-html");
var ngTemplates = require("gulp-ng-templates");
var wrap = require("gulp-wrap");
var concat = require("gulp-concat");
var ngAnnotate = require("gulp-ng-annotate");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var connect = require("gulp-connect");
var connectHistoryMiddleware = require("connect-history-api-fallback");

/**
 * Build directory.
 */
var BUILD_DIRECTORY = (argv.argv.d || ".") + "/build";

/**
 * Config.
 */
var CONFIG = {
  sass: {
    src: "src/assets/scss/app.scss",
    watch: "src/assets/scss/**/*.scss",
    compiled: "app.css",
    dest: BUILD_DIRECTORY + "/assets/css"
  },
  js: {
    frameworks: {
      src: [
        "bower_components/jquery/dist/jquery.js",
        "bower_components/angular/angular.js",
        "bower_components/angular-sanitize/angular-sanitize.js",
        "bower_components/angular-animate/angular-animate.js",
        "bower_components/angular-messages/angular-messages.js",
        "bower_components/angular-restmod/dist/angular-restmod-bundle.js",
        "bower_components/angular-restmod/dist/plugins/dirty.js",
        "bower_components/angular-ui-router/release/angular-ui-router.js",
        "bower_components/angular-ui-bootstrap/src/position/position.js",
        "bower_components/angular-ui-bootstrap/src/transition/transition.js",
        "bower_components/angular-ui-bootstrap/src/collapse/collapse.js",
        "bower_components/angular-ui-bootstrap/src/dateparser/dateparser.js",
        "bower_components/checklist-model/checklist-model.js",
        "bower_components/lodash/lodash.js",
        "bower_components/humps/humps.js",
        "bower_components/underscore.string/dist/underscore.string.js"
      ],
      compiled: "frameworks.js"
    },
    app: {
      src: [
        "src/app/app.js",
        "src/app/app-controller.js",
        "src/app/workshop/workshop.js",
        "src/app/workshop/**/*.js",
        "src/app/layout/layout.js",
        "src/app/layout/**/*.js",
      ],
      compiled: "app.js"
    },
    templates: {
      src: "src/app/**/*.html",
      options: {
        base: "src"
      },
      replacePaths: {
      },
      compiled: "templates.js"
    },
    dest: BUILD_DIRECTORY + "/assets/js"
  },
  assets: {
    src: [
      "src/assets/img/**/*",
      "src/assets/fonts/**/*"
    ],
    options: {
      base: "src/assets"
    },
    dest: BUILD_DIRECTORY + "/assets"
  },
  indexHtml: {
    src: "src/index.html",
    compiled: "index.html",
    dest: BUILD_DIRECTORY
  },
  webConfig: {
    src: "src/Web.config",
    compiled: "Web.config",
    dest: BUILD_DIRECTORY
  },
  lint: {
    src: [
      "gulpfile.js",
      "src/app/**/*.js"
    ]
  },
  revision: {
    manifest: {
      compiled: "revision-manifest.json",
      base: BUILD_DIRECTORY,
      dest: BUILD_DIRECTORY
    }
  }
};

/**
 * Create a revision of a file.
 *
 * @param src
 * @param dest
 * @param type
 * @returns {*}
 */
function createRevision(src, dest, type) {
  var stream = gulp.src(src);

  switch (type) {
    case "css":
      stream = stream
          .pipe(cssmin())
          .pipe(gulp.dest(dest));
      break;

    case "js":
      stream = stream
          .pipe(ngAnnotate())
          .pipe(uglify())
          .pipe(gulp.dest(dest));
      break;
  }

  return stream
      .pipe(rev())
      .pipe(revDel())
      .pipe(gulp.dest(dest))
      .pipe(rev.manifest(CONFIG.revision.manifest.dest + "/" + CONFIG.revision.manifest.compiled, {
        base: CONFIG.revision.manifest.base,
        merge: true
      }))
      .pipe(gulp.dest(CONFIG.revision.manifest.dest))
      .pipe(connect.reload());
}

/**
 * Build app.css.
 */
gulp.task("buildAppCss", function () {
  return gulp.src(CONFIG.sass.src)
    .pipe(sass())
    .pipe(gulp.dest(CONFIG.sass.dest))
    .pipe(connect.reload());
});

/**
 * Build app.css revision.
 */
gulp.task("buildAppCssRevision", function () {
  return createRevision(CONFIG.sass.dest + "/" + CONFIG.sass.compiled, CONFIG.sass.dest, "css");
});

/**
 * Build frameworks.js.
 */
gulp.task("buildFrameworksJs", function () {
  return gulp.src(CONFIG.js.frameworks.src)
    .pipe(concat(CONFIG.js.frameworks.compiled))
    .pipe(gulp.dest(CONFIG.js.dest))
    .pipe(connect.reload());
});

/**
 * Build frameworks.js revision.
 */
gulp.task("buildFrameworksJsRevision", function () {
  return createRevision(CONFIG.js.dest + "/" + CONFIG.js.frameworks.compiled, CONFIG.js.dest, "js");
});

/**
 * Build templates.js.
 */
gulp.task("buildTemplatesJs", function () {
  function renamePath(path, base) {
    path = slash(path);
    base = slash(base);

    var dirName = slash(__dirname);
    var relativePath = path.replace(dirName + "/" + base + "/", "");
    var replacePaths = CONFIG.js.templates.replacePaths;

    for (var replacePath in replacePaths) {
      if (path.indexOf(replacePath) > -1) {
        return relativePath.replace(replacePath, replacePaths[replacePath]);
      }
    }

    return relativePath;
  }

  return gulp.src(CONFIG.js.templates.src, CONFIG.js.templates.options)
    .pipe(minifyHtml({
      empty: true,
      quotes: true
    }))
    .pipe(ngTemplates({
      standalone: true,
      module: "templates",
      path: renamePath
    }))
    .pipe(wrap("(function(window, angular, undefined) {\n\n\"use strict\";\n\n<%= contents %>\n})(window, angular);"))
    .pipe(concat(CONFIG.js.templates.compiled))
    .pipe(gulp.dest(CONFIG.js.dest))
    .pipe(connect.reload());
});

/**
 * Build templates.js revision.
 */
gulp.task("buildTemplatesJsRevision", function () {
  return createRevision(CONFIG.js.dest + "/" + CONFIG.js.templates.compiled, CONFIG.js.dest, "js");
});

/**
 * Build app.js.
 */
gulp.task("buildAppJs", function () {
  return gulp.src(CONFIG.js.app.src)
    .pipe(wrap("(function(window, angular, undefined) {\n\n\"use strict\";\n\n<%= contents %>\n})(window, angular);"))
    .pipe(concat(CONFIG.js.app.compiled))
    .pipe(ngAnnotate())
    .pipe(gulp.dest(CONFIG.js.dest))
    .pipe(connect.reload());
});

/**
 * Build app.js revision.
 */
gulp.task("buildAppJsRevision", function () {
  return createRevision(CONFIG.js.dest + "/" + CONFIG.js.app.compiled, CONFIG.js.dest, "js");
});

/**
 * Lint.
 */
gulp.task("lint", function () {
  return gulp.src(CONFIG.lint.src)
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

/**
 * Copy index.html.
 */
gulp.task("copyIndexHtml", function () {
  gulp.src(CONFIG.indexHtml.src)
    .pipe(gulp.dest(CONFIG.indexHtml.dest))
    .pipe(connect.reload());
});

/**
 * Copy Web.config.
 */
gulp.task("copyWebConfig", function () {
  gulp.src(CONFIG.webConfig.src)
    .pipe(gulp.dest(CONFIG.webConfig.dest));
});

/**
 * Copy assets.
 */
gulp.task("copyAssets", function () {
  gulp.src(CONFIG.assets.src, CONFIG.assets.options)
    .pipe(gulp.dest(CONFIG.assets.dest))
    .pipe(connect.reload());
});

/**
 * Replace revisions.
 */
gulp.task("replaceRevisions", function () {
  return gulp.src(CONFIG.indexHtml.dest + "/" + CONFIG.indexHtml.compiled)
    .pipe(revReplace({manifest: gulp.src(CONFIG.revision.manifest.dest + "/" + CONFIG.revision.manifest.compiled)}))
    .pipe(gulp.dest(CONFIG.indexHtml.dest));
});

/**
 * Create server.
 */
gulp.task("createServer", function () {
  connect.server({
    root: [BUILD_DIRECTORY],
    livereload: true,
    port: 8080,
    middleware: function () {
      return [
        connectHistoryMiddleware({})
      ]
    }
  });
});

/**
 * Watch.
 */
gulp.task("watch", function () {
  gulp.watch("src/index.html", ["copyIndexHtml"]);
  gulp.watch(CONFIG.assets.src, ["copyAssets"]);
  gulp.watch(CONFIG.sass.watch, ["buildAppCss"]);
  gulp.watch(CONFIG.js.templates.src, ["buildTemplatesJs"]);
  gulp.watch(CONFIG.js.app.src, ["buildAppJs"]);
});

/**
 * Clean the build folder.
 */
gulp.task("clean", function () {
  del(BUILD_DIRECTORY + "/**/*");
});

/**
 * Default.
 */
gulp.task("default", ["buildAppCss", "buildFrameworksJs", "buildTemplatesJs", "buildAppJs", "copyIndexHtml", "copyWebConfig", "copyAssets"]);

/**
 * Build.
 */
gulp.task("build", gulpSequence("default", "buildAppCssRevision", "buildFrameworksJsRevision", "buildTemplatesJsRevision", "buildAppJsRevision", "replaceRevisions"));

/**
 * Serve.
 */
gulp.task("serve", ["createServer", "watch"]);
