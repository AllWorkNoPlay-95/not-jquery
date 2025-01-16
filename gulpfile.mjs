import { src, dest, series, parallel, watch as watcher } from "gulp";
import ts from "gulp-typescript";
import terser from "gulp-terser";
import prettier from "gulp-prettier";
import sourcemaps from "gulp-sourcemaps";

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
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.scripts.dest));
}

function reformat() {
  return src(paths.pretty)
    .pipe(prettier())
    .pipe(dest("./"));
}

function watch() {
  // watch(paths.pretty, reformat); //It's better to use the IDE's format on save (for me at least)
  watcher(paths.scripts.src, compileTs);
}

export default series(reformat, compileTs);

export { compileTs, reformat, watch };