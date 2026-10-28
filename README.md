# Air Space 网站：填写 Excel，更新网页

现在网站包含 Home、People、News、Collaborate with us 四个栏目。首页简介参考本地项目 PDF 第 1–2 页。PDF 中项目正式名称为 **Air Spaces: getting the measure of air**；网站暂沿用 Air Space，可在表中修改。

## 从这里开始

1. **看网站**：双击 `index.html`。
2. **填资料**：打开 `data/Air-Space-Content.xlsx`，在浅黄色单元格填写内容。
3. **放照片**：按表中的“图片清单”命名，将照片放到 assets 对应子文件夹。
4. **更新本地网站**：双击 `update.html`，选择已填写的 Excel，下载 `content.js`，覆盖根目录的同名文件，然后刷新网站。

本地导入工具离线运行，不会上传表格。建议使用最新版 Chrome、Edge 或 Safari。浏览器若把下载文件命名为 `content (1).js`，请手动改成 `content.js` 后再覆盖。

## Excel 怎么填

- **Home**：修改 B 列的文字和图片路径。A 列字段名、第 5 行表头不要改。首页文字已填写，可继续修改。
- **People**：每行一位成员。填写姓名、职位、简介、照片路径、个人主页链接，以及 G 列单位。H 列选择 **Leadership Team** 或 **Researchers**，成员会进入对应分组。发布列选 **Yes** 才显示。旧表未填写分组时默认归入 Researchers。
- **News**：每行一条新闻。填写标题、日期、分类、摘要、图片路径和完整新闻链接。日期用 YYYY-MM-DD，或使用正常 Excel 日期。发布列选 **Yes** 才显示。新闻按日期从新到旧排列。
- **Collaborate**：填写合作说明和正式项目联系邮箱。邮箱留空时显示待公布。
- **Partners**：每行一个合作单位，填写名称、图片路径和网址。发布列选 **Yes** 才显示。
- **图片清单**：图片在网页上的位置、对应路径和推荐尺寸。

表中已有的 People、News、Partners 行是待填写的空记录，发布默认 No，不会出现在网站。可复制行继续添加，不限于现有行数。不要使用 Excel 公式；直接填文字。不要改工作表名称和第 5 行表头。

简介和图片路径在 Excel 中统一维护，直接改 `content.js` 也能临时预览，但 GitHub 自动发布会重新以 Excel 为准。请将永久修改写入 Excel。

## 图片位置与名称

| 网页位置 | 放在哪里 | 推荐尺寸 |
|---|---|---|
| 左上角标志 | `assets/logo.png` | 正方形透明底；已经设计并放好 |
| 首页顶部大图 | `assets/project/shared-air-interior.png` | 宽幅，建议 2000×1125 |
| 首页介绍旁配图 | `assets/project/about.jpg` | 1400×1000 |
| People 页右侧团队照片 | `assets/people/team.jpg` | 1600×1067 |
| 第 1 位成员 | `assets/people/person-01.jpg` | 1200×800，横向头像 |
| 第 2 位成员 | `assets/people/person-02.jpg` | 1200×800，横向头像 |
| 第 1 条新闻 | `assets/news/news-01.jpg` | 1200×800 |
| 第 2 条新闻 | `assets/news/news-02.jpg` | 1200×800 |
| 第 1 个合作单位 | `assets/partners/partner-01.png` | 透明底，宽 600 以上 |

后续依次使用 person-03.jpg、news-03.jpg、partner-02.png 等。也可以用其他英文文件名，但 Excel 的路径必须与真实文件完全一致，包括大小写、扩展名和文件夹。

照片无需嵌入 Excel。首页大图未提供时显示原创空气流线与建筑示意图，项目介绍配图未提供时显示占位区域。不是项目现场照片。照片补齐后放入对应路径即可替换，不用改排版。

People 页上方为左侧团队介绍、右侧照片，下方依次是 Leadership Team 和 Researchers，不含招聘邀请横幅。每组在电脑上每行显示 3 人，小屏幕会自动减少列数。没有发布成员时，每组显示 3 个明确标注的预留头像位置；有成员后会自动替换成实际资料。Home 表底部的 peopleTitle、peopleDescription、peopleImage 和两个分组标题用于修改团队页介绍与标题。

### 点击头像进入个人页

头像、姓名和 View biography 都会打开对应个人介绍页，顶部 People 导航保持选中。每页包括姓名、职位、单位、简介、照片和选填的研究方向与联系链接，不使用采访问答。页面上有返回团队列表的链接，也支持浏览器返回。

People 表新增的列：

- **I 详细简介 biography**：完整个人介绍。用单元格内换行分段（Mac Excel 通常是 Control + Option + Return）；两个换行之间会分成两段。D 列仍用于列表短简介和个人页开头。
- **J 研究方向 interests**：选填，用英文分号隔开多个方向，例如 `Air quality; Community research`。未填写时不显示这一板块。
- **K 邮箱 email**：选填，填写正式工作邮箱。
- **L LinkedIn linkedin**：选填，填写完整 https:// 链接。
- **M 个人链接 ID id**：每人独一无二，例如 `person-01`；个人页链接是 `#people/person-01`。填好后尽量不改，保证已分享的链接继续有效。重复 ID 会阻止转换并提示修改。

F 列原有的个人主页网址在个人页中显示为 Institutional profile，不会代替网站自己的个人简介页。没有填写的联系方式不显示按钮。旧表不填 I–M 仍能使用；默认根据照片文件名生成个人 ID。

## GitHub 上线：推荐自动读取 Excel

你提供的示例也是用 GitHub 保存网页并通过 GitHub Pages 发布。本项目已准备好 Excel 自动发布流程，但**尚未连接 GitHub、创建仓库或公开发布**。

### 首次设置（只做一次）

1. 注册或登录 GitHub，创建你的公开仓库，例如 `air-space`。
2. 上传这些网站文件和文件夹到仓库根目录：
   - `index.html`、`style.css`、`site.js`、`content.js`、`content-tools.js`
   - `assets/`、`data/`、`scripts/`
   - `.github/workflows/pages.yml`
   - `README.md`、`.gitignore` 可一并上传。
3. 保持文件夹层级。网页上传时应将内容拖入；不要把整个项目套在额外一层文件夹下。若文件管理器不显示 `.github`，Mac 可按 Command + Shift + . 显示隐藏文件。也可在 GitHub 的 Add file → Create new file 中创建 `.github/workflows/pages.yml`，复制本地同名文件的内容。
4. 点击 Commit changes，默认分支保持 **main**。
5. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。本版本使用此方式，不是之前的 Deploy from a branch。
6. 在仓库 **Actions** 中打开 `Publish Air Space from Excel`。首次若失败是因为尚未启用 Pages，设置完成后点击 Re-run all jobs；也可以点击 Run workflow。
7. 发布成功后，Settings → Pages 中显示公开网址，通常是 `https://你的用户名.github.io/air-space/`。

如果你希望网址直接是 `https://你的用户名.github.io/`，仓库必须命名为 `你的用户名.github.io`。使用组织账户时，同理是 `组织名.github.io`。不需要购买域名。

### 后续更新

1. 在电脑上修改 Excel 并保存。
2. 在 GitHub 打开仓库的 `data` 文件夹，点击 Add file → Upload files，上传同名的 `Air-Space-Content.xlsx` 覆盖原表，Commit changes。
3. 新照片上传到 `assets` 对应的子文件夹。图片名与表中路径一致。
4. GitHub 自动读取 Excel 并重新发布。Actions 页面会显示成功或具体错误；表头、日期或邮箱格式错误会阻止新版本发布，旧网站继续保留。

自动发布只将网页和 assets 打包为公开网站，不会将 Excel、编辑工具和研究 PDF 放到网站目录。公开 GitHub 仓库本身仍然可被查看，因此只上传打算公开的内容，不要把原始研究 PDF 或其他内部文件上传到仓库。

## 文件说明

- `data/Air-Space-Content.xlsx`：主要维护的内容表。
- `update.html`、`update.js`：本地 Excel 转换工具；没有账号和后台。
- `content.js`：网页实际读取的内容；本地工具和发布流程会生成它。
- `content-tools.js`：本地工具与自动发布共用的内容规则。
- `index.html`、`style.css`、`site.js`：页面、排版和显示逻辑。
- `scripts/`、`.github/workflows/pages.yml`：GitHub 自动发布。
- `assets/`：图片。

## 资料依据与标志

项目简介根据本地 `SAE-030898_Research_Associate_Air_Spaces_getting_the_measure_of_air_FP.pdf` 第 1–2 页改写，聚焦大曼彻斯特室内外空气、跨学科测量和社区暴露差异。未把招聘薪资、招聘联系方式当作项目信息，也未把文中提到的人或单位自动变成已确认网站名录。

标志由内置图片生成工具创作，提示词见 `assets/logo-design.txt`。图形结合空气流线、家居门廊和城市轮廓。网页旁的 Air Space 文字是清晰可编辑的网页文字，不是图片文字。

参考：
- https://biodetectionhub.herts.ac.uk/
- https://github.com/environmental-ai-systems/environmental-ai-systems.github.io
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 已加入的成员（2026-10-28）

- Leadership Team：Prof. Sophie Woodward，Air Spaces 项目 Principal Investigator (PI)，照片 `assets/people/sophie-woodward.png`，个人页 `#people/sophie-woodward`。
- Researchers：Hao Zhang，已获得曼彻斯特大学博士学位，照片 `assets/people/hao-zhang.jpg`，个人页 `#people/hao-zhang`。

两人的简介、邮箱、研究方向和照片路径均同步维护在 Excel People 表，`content.js` 从该表生成。Sophie 的机构个人主页为 https://research.manchester.ac.uk/en/persons/sophie.woodward/ 。简介依据本次提供的资料缩写；Hao 的博士毕业状态依据本人确认。

### Dr. Thomas Bannan

已加入 Leadership Team，职务为 Co-Investigator (Co-I) · Senior Lecturer in Atmospheric Sciences。简介依据其曼彻斯特大学机构主页缩写，聚焦室内外空气质量、质谱测量、个人暴露及传感器网络。

- 机构主页：https://research.manchester.ac.uk/en/persons/thomas-bannan/
- 邮箱：thomas.bannan@manchester.ac.uk
- 个人页：`#people/thomas-bannan`
- 网页照片：`assets/people/thomas-bannan.png`
- 原始上传照片：`assets/people/thomas-bannan-original.png`

照片清晰度优化使用内置图片编辑工具，原始照片单独保留。编辑说明见 `assets/people/thomas-bannan-image-notes.txt`。

## 设备照片与 Sophie 头像优化

Home 的项目介绍下方新增 Air quality measurements 板块，两张设备照片并排展示：现场监测设备与实验室仪器。完整保留照片比例，手机上纵向排列。Home 表中的 equipment 开头字段用于修改标题、说明和图片路径；图片清单也已同步更新。未添加未经确认的仪器型号参数或性能数据。

Sophie 的网页头像仍使用 `assets/people/sophie-woodward.png`，优化后无需修改成员记录。原始版本保存在 `assets/people/sophie-woodward-original.png`。

设备优化图位于 `assets/project/air-quality-sensor.png` 和 `assets/project/laboratory-instrument.png`；带 `-original` 的同名文件保留上传原图。优化图是 AI 辅助修复的展示版本，不能用于判断原照片未能记录的细节。处理提示词见 `assets/image-processing-notes.md`。

## 首页布局与统一视觉（当前版本）

首页采用白色导航与页脚、全宽动态图片首屏。白色大标题和介绍叠放在背景图的左侧暗部，浅绿色按钮用于引导阅读。其他板块沿用暖白、浅鼠尾草绿和墨绿。

内容顺序是：大幅动态背景与叠加标题 → 四张生活场景照片 → 项目介绍 → 研究方向 → 测量设备 → 新闻 → 合作邀请。当前 aboutImage 留空，日后填入真实项目图时可增加项目配图。

生活场景图片放在 `assets/places/`：workplace.png、homes.png、public-transport.png、commuting.png。四张上传照片原样保留，网页仅调整显示裁切；图注明确为生活情境，不作为已确认的项目采样现场。Home 表的 places 开头字段控制场景区说明，scene 开头字段控制每张图片的标题、路径与图片说明。

后续如有更高分辨率的原图，可直接替换这些同名文件。网站没有放大合成这四张照片的细节。

## 全宽动态背景

首屏背景为 `assets/project/shared-air-interior.png`。它是使用内置 Imagegen 生成的概念场景：阳光穿过窗户与薄纱，连接室内生活空间和窗外城市。页面底部注明 Conceptual image，不表示真实项目现场。完整生成提示词记录在 `assets/project/shared-air-interior-notes.md`。

画面缓慢推进，光影轻微变化，Canvas 绘制的细小空气微粒随时间漂动。这是网页动态背景，未使用 GIF 或视频文件；比多帧 GIF 更清晰，也便于换图。右下角 Pause animation / Play animation 同时控制画面、光影和粒子。系统启用减少动态效果时，保持静态并隐藏控制；离开首页、滚离画面或切换浏览器标签后停止绘制。

Excel 的 Home 表第 11 行 heroImage 记录背景图路径，B11 可直接换图；第 12 行保留图片说明。图片清单第 7 行已同步。替换时尽量选择左侧较暗且有留白、右侧有视觉重点的横幅照片。

桌面版以全宽图片承载标题；手机上保留背景图并调整裁切与遮罩。正文主要使用 17–20px。顶部导航与底部页脚保持白色。团队合照未提供或路径失效时，People 页自动收起照片占位框，Excel 图片位置仍保留。

首屏构图参考 https://biodetectionhub.herts.ac.uk/ 的大幅动态背景与文字叠放方式；场景与动态实现为 Air Space 专门设计。旧的矢量流线文件保留在 assets/brand/，不再出现在首页。
