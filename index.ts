
//core
import * as cp from 'child_process';
import * as path from 'path';
import {ChildProcess} from "child_process";


//project
const exec = path.resolve(__dirname +'/lib/run.sh');


////////////////////////////////////////////////////////////

export const run = function($commands: Array<string>, args?: Array<string>) : ChildProcess {

    const commands = $commands.map(function(c){
          return String(c).trim();
    });

    return cp.spawn(exec, (args || []), {
        env: Object.assign({}, process.env, {
            GENERIC_SUBSHELL_COMMANDS: commands.join('\n')
        })
    });

};

