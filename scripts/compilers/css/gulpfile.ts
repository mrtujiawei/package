/**
 * 转换css
 */
import { dest, src } from 'gulp';
import path from 'path';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import cleanCss from 'gulp-clean-css';

const entrys = path.resolve(__dirname, 'src/*.css');

const output = path.resolve(__dirname, 'dist');

async function buildCss() {
  return src(entrys)
    .pipe(postcss([autoprefixer({ grid: 'autoplace' })]))
    .pipe(cleanCss({}))
    .pipe(dest(output));
}

export default buildCss;
