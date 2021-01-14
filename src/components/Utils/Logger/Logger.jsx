// import { DEBUG } from '../../../components/App/config'
import { rainbow } from './rainbow'
const DEBUG = false 

const spacing = '5px';
const styles = 
    `padding: ${spacing}; background-color: darkblue; color: white; font-style: 
    italic; border: ${spacing} solid crimson; font-size: 2em;`;
const fancyOutput = {
    info: `padding: ${spacing}; background-color: hsl(0deg 100% 8%); border-bottom-color: #0a0606; color: white;`,
    warn: `padding: ${spacing}; background-color: darkblue; color: white; font-style: 
        italic; border: ${spacing} solid crimson; font-size: 2em;`,
    big: `padding: ${spacing}; font-size: 3em;`,
}
// console.log('%cVariety is the spice of life', styles);
// let log
// if (DEBUG) log = console.log.bind(window.console)
// else log = function(){}


export const unboundLogger = {
    info: (!DEBUG) ? (msg) => {
        // console.log(`%c${msg}`, fancyOutput.info)
        console.log(`%c${msg}`, rainbow)
    } : () => {},
    default: (!DEBUG) ? (msg) => {
        // console.log(`%c${msg}`, fancyOutput.info)
        console.log(msg)
    } : () => {},
    warn: (!DEBUG) ? (msg) => {
        console.log(`%c${msg}`, fancyOutput.warn)
    } : () => {},
    finger: () => {
        console.log(`
        　  　 fﾆヽ
        　　　 |_||
        　　　 |= |
        　　　 |_ |
        　　 ⌒|~ |⌒i-、
        　 /|　|　|　| ｜
        　｜(　(　(　(　｜
        　｜　　　　　  ｜
        　 ＼　　　 　　/
        　　 ＼　　 　 ｜
        `)
    },
    hey: () => {
        console.log(`%c
( ͡ ͡° ͜ ʖ ͡ ͡°)
\╭☞ \╭☞
        `, fancyOutput.big)
    },
    taco: () => {
        console.log(`%c
{\__/}
(●_●)
( >🌮 Want a taco?
        `, fancyOutput.big)
    },


}


export const logger = {
    // bind: console.log.bind(window.console, '%c', null,  styles),
    // bind2: this.info.bind(window.console)
}