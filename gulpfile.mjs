import { src, dest, series, parallel, watch } from "gulp";
import ts from "gulp-typescript";
import terser from "gulp-terser";
import prettier from "gulp-prettier";

// Load TypeScript configuration
const tsProject = ts.createProject("tsconfig.json");

// File paths
const paths = {
  scripts: {
    src: "src/**/*.ts",
    dest: "dist/"
  },
  pretty: [
    "!./node_modules/**/*",
    "**/*.{ts,json,php}"
  ]
};

// Task: Compile TypeScript
function compileTs() {
  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(dest(paths.scripts.dest));
}

function minifyJs() {
  return src(`${paths.scripts.dest}/**/*.js`)
    .pipe(terser())
    .pipe(dest(paths.scripts.dest));
}

function reformat() {
  return src(paths.pretty)
    .pipe(prettier())
    .pipe(dest("./"));
}

function watchAll() {
  // watch(paths.pretty, reformat); //It's better to use the IDE's format on save (for me at least)
  watch(paths.scripts.src, series(compileTs, minifyJs));
}

export default series(reformat, compileTs, minifyJs);

export { compileTs, minifyJs, reformat, watchAll };