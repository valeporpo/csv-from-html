
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default {
    input: 'src/js/index.js',
    plugins: [
        terser({
            "keep_classnames" : true,
        }),
    ],
    output: [
        {
            name: 'CsvFromHtml',
            file: pkg.browser,
            format: 'umd',
        },
        { 
            file: pkg.module,
            format: 'es' 
        },         
    ],
};