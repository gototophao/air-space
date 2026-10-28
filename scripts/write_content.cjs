const api=require('../content-tools.js');
let input='';
process.stdin.setEncoding('utf8');
process.stdin.on('data',chunk=>input+=chunk);
process.stdin.on('end',()=>{try{process.stdout.write(api.serialize(api.build(JSON.parse(input))));}catch(e){console.error(e.message);process.exitCode=1;}});
