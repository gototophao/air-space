/* Minimal offline XLSX reader: ZIP + Open XML. No external libraries or network. */
const statusBox=document.querySelector('#status'),downloadButton=document.querySelector('#download');
let generated='';
const decode=new TextDecoder('utf-8');
function xml(s){const doc=new DOMParser().parseFromString(s,'application/xml');if(doc.querySelector('parsererror'))throw new Error('无法读取 Excel XML，请重新保存为 .xlsx。');return doc;}
const all=(el,tag)=>Array.from(el.getElementsByTagNameNS('*',tag));
async function unzip(buffer){
 const view=new DataView(buffer),bytes=new Uint8Array(buffer),files=new Map();let end=-1;
 for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(view.getUint32(i,true)===0x06054b50){end=i;break;}
 if(end<0)throw new Error('这不是有效的 .xlsx 文件。');
 let pos=view.getUint32(end+16,true),count=view.getUint16(end+10,true);let total=0;
 if(count>2000)throw new Error('文件内容过多，请使用提供的内容表。');
 for(let i=0;i<count;i++){
  if(view.getUint32(pos,true)!==0x02014b50)throw new Error('Excel 压缩目录损坏。');
  const flags=view.getUint16(pos+8,true),method=view.getUint16(pos+10,true),size=view.getUint32(pos+20,true),rawSize=view.getUint32(pos+24,true),nameLen=view.getUint16(pos+28,true),extra=view.getUint16(pos+30,true),comment=view.getUint16(pos+32,true),offset=view.getUint32(pos+42,true);
  const name=decode.decode(bytes.subarray(pos+46,pos+46+nameLen));pos+=46+nameLen+extra+comment;
  if(flags&1)throw new Error('请先取消 Excel 文件密码。');
  total+=rawSize;if(total>40*1024*1024)throw new Error('表格内容过大。请删除嵌入图片，只保留图片路径。');
  if(!name.endsWith('.xml')&&!name.endsWith('.rels'))continue;
  const start=offset+30+view.getUint16(offset+26,true)+view.getUint16(offset+28,true);
  let data=bytes.slice(start,start+size);
  if(method===8){try{const stream=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));data=new Uint8Array(await new Response(stream).arrayBuffer());}catch{throw new Error('当前浏览器无法解压此 Excel。请使用新版 Chrome、Edge 或 Safari，或使用 GitHub 自动发布方式。');}}
  else if(method!==0)throw new Error('不支持的 Excel 压缩方式。请用 Excel 重新保存。');
  files.set(name,decode.decode(data));
 }
 return files;
}
async function readWorkbook(file){
 const files=await unzip(await file.arrayBuffer());
 const required=name=>{if(!files.has(name))throw new Error('缺少 Excel 结构文件：'+name);return xml(files.get(name));};
 const shared=files.has('xl/sharedStrings.xml')?all(xml(files.get('xl/sharedStrings.xml')),'si').map(si=>all(si,'t').map(t=>t.textContent).join('')):[];
 const rels=new Map(all(required('xl/_rels/workbook.xml.rels'),'Relationship').map(r=>[r.getAttribute('Id'),r.getAttribute('Target')]));
 const result={};
 for(const sheet of all(required('xl/workbook.xml'),'sheet')){
  const id=sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');const target=rels.get(id);
  if(!target)throw new Error('工作表关系缺失。');
  const path=target.startsWith('/')?target.slice(1):'xl/'+target;
  const normalized=path.split('/').reduce((parts,p)=>{if(p==='..')parts.pop();else if(p!=='.')parts.push(p);return parts;},[]).join('/');
  const rows=[];
  for(const row of all(required(normalized),'row')){
   const ri=Number(row.getAttribute('r'))-1;if(ri<0||ri>10000)throw new Error('工作表行数超出范围。');
   while(rows.length<=ri)rows.push([]);
   for(const cell of all(row,'c')){
    if(all(cell,'f').length)throw new Error('请直接填写文字，不要在内容表中使用公式。');
    const column=(cell.getAttribute('r').match(/^[A-Z]+/i)||['A'])[0].toUpperCase();let ci=0;for(const ch of column)ci=ci*26+ch.charCodeAt(0)-64;
    let value=all(cell,'v')[0]?.textContent||'';
    if(cell.getAttribute('t')==='s')value=shared[Number(value)]||'';
    if(cell.getAttribute('t')==='inlineStr')value=all(cell,'t').map(t=>t.textContent).join('');
    rows[ri][ci-1]=value;
   }
  }
  result[sheet.getAttribute('name')]=rows;
 }
 return result;
}
document.querySelector('#workbook').addEventListener('change',async e=>{
 generated='';downloadButton.disabled=true;document.querySelector('#summary').textContent='';statusBox.classList.remove('error');
 const file=e.target.files[0];if(!file)return;
 try{
  if(!file.name.toLowerCase().endsWith('.xlsx')||file.size>15*1024*1024)throw new Error('请选择 15 MB 以内的 .xlsx 内容表。');
  statusBox.textContent='正在读取…';const sheets=await readWorkbook(file),content=AirContent.build(sheets);
  generated=AirContent.serialize(content);downloadButton.disabled=false;
  statusBox.textContent='已读取，可以下载。网站名称：'+content.name;
  document.querySelector('#summary').textContent=`将显示 ${content.people.length} 位成员、${content.news.length} 条新闻、${content.partners.length} 个合作单位。未发布的行已忽略。请确认照片已放入对应文件夹。`;
 }catch(error){statusBox.textContent=error.message;statusBox.classList.add('error');}
});
downloadButton.addEventListener('click',()=>{
 if(!generated)return;const url=URL.createObjectURL(new Blob([generated],{type:'text/javascript;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='content.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
