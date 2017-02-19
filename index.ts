
//core
import * as cp from 'child_process';
import * as path from 'path';

//project
const run = path.resolve(__dirname +'/run.sh');


export default function($commands: Array<string>, args: Array<string>){

    const commands = $commands.map(function(c){
          return String(c).trim();
    });

    return cp.spawn(run, (args || []), {
        env: Object.assign({}, process.env, {
            GENERIC_SUBSHELL_COMMANDS: commands.join('\n')
        })
    });


};