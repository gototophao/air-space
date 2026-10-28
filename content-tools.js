/* Shared workbook mapping for the local editor and GitHub publishing. */
(function(root) {
  const headers = {
    Home: ['字段 field','内容 value','填写说明'],
    People: ['发布 publish','姓名 name','职位 role','简介 bio','照片 image','主页 url'],
    News: ['发布 publish','标题 title','日期 date','分类 category','摘要 summary','图片 image','链接 url'],
    Collaborate: ['字段 field','内容 value','填写说明'],
    Partners: ['发布 publish','名称 name','标志 logo','网址 url']
  };
  const text = x => String(x ?? '').trim();
  const yes = x => ['yes','y','是','发布','true','1'].includes(text(x).toLowerCase());
  function build(sheets) {
    for (const [name, expected] of Object.entries(headers)) {
      if (!sheets[name] || expected.some((h,i) => sheets[name][4]?.[i] !== h))
        throw new Error('工作表 '+name+' 的第 5 行表头不匹配。请使用原始模板，保留工作表名称和表头。');
    }
    const obj = {};
    for (const name of ['Home','Collaborate']) {
      for (const row of sheets[name].slice(5)) { const key=text(row[0]); if (key) obj[key]=text(row[1]); }
    }
    for (const key of ['name','tagline','introduction','aboutTitle','about'])
      if (!obj[key]) throw new Error('Home 缺少必填内容：'+key);
    if (obj.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email)) throw new Error('联系邮箱格式不正确。');
    const rows = name => sheets[name].slice(5).filter(r=>yes(r[0]));
    obj.people=rows('People').map((r,i)=>{
      if(!text(r[1])) throw new Error('People 第 '+(i+1)+' 条发布记录缺少姓名。');
      const group=text(r[7]) || 'Researchers';
      if(!['Leadership Team','Researchers'].includes(group)) throw new Error('People 分组请填写 Leadership Team 或 Researchers。');
      const derived=text(r[4]).split('/').pop().replace(/\.[^.]+$/,'') || text(r[1]);
      const id=text(r[12]) || derived.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff-]+/g,'-').replace(/^-|-$/g,'') || 'member-'+(i+1);
      if(!/^[a-z0-9\u4e00-\u9fff-]{1,100}$/.test(id)) throw new Error('People 个人链接 ID 请使用小写英文、数字、中文或连字符。');
      const email=text(r[10]);
      if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('People 个人邮箱格式不正确：'+email);
      return {name:text(r[1]),role:text(r[2]),bio:text(r[3]),image:text(r[4]),url:text(r[5]),affiliation:text(r[6]),group,id,biography:text(r[8]),interests:text(r[9]),email,linkedin:text(r[11])};
    });
    if(new Set(obj.people.map(p=>p.id)).size!==obj.people.length)throw new Error('People 中有重复的个人链接 ID，请在 M 列为每人填写不同的 ID。');
    obj.news=rows('News').map((r,i)=>{
      if(!text(r[1])) throw new Error('News 第 '+(i+1)+' 条发布记录缺少标题。');
      let date=text(r[2]);
      if (/^\d{4}-\d{2}-\d{2}T00:00:00(?:\.000)?Z?$/.test(date)) date=date.slice(0,10);
      if (/^\d+(\.\d+)?$/.test(date)) date=new Date((Number(date)-25569)*86400000).toISOString().slice(0,10);
      if(date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date)) throw new Error('News 日期应填写为 YYYY-MM-DD：'+date);
      return {title:text(r[1]),date,category:text(r[3]),summary:text(r[4]),image:text(r[5]),url:text(r[6]),placeholder:false};
    }).sort((a,b)=>b.date.localeCompare(a.date));
    obj.partners=rows('Partners').map(r=>{if(!text(r[1])) throw new Error('Partners 已发布的记录缺少名称。');return {name:text(r[1]),logo:text(r[2]),url:text(r[3])};});
    const imageKeys=['logo','heroImage','aboutImage','peopleImage','equipmentSensorImage','equipmentLabImage','sceneWorkplaceImage','sceneHomesImage','sceneTransportImage','sceneCommuteImage'];
    for(const k of imageKeys) if(obj[k] && !/^assets\/[a-zA-Z0-9_./-]+$/.test(obj[k])) throw new Error(k+' 请填写 assets/ 开头的英文图片路径。');
    for(const group of ['people','news','partners']) for(const item of obj[group]) {
      const img=item.image || item.logo;
      if(img && !/^assets\/[a-zA-Z0-9_./-]+$/.test(img)) throw new Error('图片路径请用 assets/ 开头，文件名使用英文、数字和连字符：'+img);
      if(item.url && !/^https?:\/\/[^\s]+$/i.test(item.url)) throw new Error('链接请以 https:// 或 http:// 开头：'+item.url);
      if(item.linkedin && !/^https?:\/\/[^\s]+$/i.test(item.linkedin)) throw new Error('LinkedIn 链接请以 https:// 或 http:// 开头。');
    }
    return obj;
  }
  const api={headers,build,serialize: obj=>'// Generated from Air-Space-Content.xlsx.\nwindow.AIR_SPACE = '+JSON.stringify(obj,null,2)+';\n'};
  if(typeof module==='object') module.exports=api; else root.AirContent=api;
})(typeof window==='object'?window:globalThis);
