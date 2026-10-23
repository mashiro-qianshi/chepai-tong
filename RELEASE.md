# 发版流程备忘（Release Guide）

> 本文件说明「车牌通」项目从**改代码 → 打包 APK → 发布到 GitHub**的完整流程。
> 项目地址：https://github.com/mashiro-qianshi/chepai-tong

---

## 0. 项目速览

```
chepai-app/
├── index.html            Web 入口
├── style.css             样式
├── js/
│   ├── app.js            核心逻辑
│   ├── data.js           348 城车牌 + 特色数据
│   ├── echarts.min.js    图表库
│   └── china_city.js     地级市 GeoJSON（地图）
├── icon-192.png / icon-512.png / avatar.png   图标与头像
├── manifest.json / sw.js                       PWA
└── android/              安卓壳 + 打包脚本
    ├── build.ps1         一键打包 + 签名
    ├── download_sdk.py   下载 Android SDK
    ├── src/ res/ AndroidManifest.xml
    ├── assets/           Web 文件副本（打包用，必须同步）
    └── chepai.keystore   签名密钥（不入库！）
```

---

## 1. 环境准备（首次）

- **Windows + PowerShell**
- **Python 3**（下载 SDK / 生成地图 / 合并内容）
- **JDK**（javac、keytool、apksigner 依赖）
- **Android SDK**：用脚本自动下载

```powershell
cd chepai-app\android
python download_sdk.py
```

> 下载后会得到 `android/sdk/`（build-tools + platform）。该目录体积大，**不提交**（`.gitignore` 已排除）。

---

## 2. 日常开发

1. 修改 `index.html` / `style.css` / `js/app.js` 等
2. 用浏览器直接打开 `index.html` 预览（或本地起静态服务器）
3. 如需更新数据，按需运行 `android/` 下的内容脚本（见第 6 节）

---

## 3. 发版步骤（重点）

### 步骤 1：同步 Web 文件到 android/assets ⚠️ 必做

打包用的是 `android/assets/`，**不是**项目根目录的文件。忘了这一步，APK 里还是旧界面。

```powershell
cd chepai-app
Copy-Item index.html,style.css,manifest.json,sw.js android\assets\ -Force
Copy-Item js\*.js android\assets\js\ -Force
Copy-Item icon-192.png,icon-512.png,avatar.png android\assets\ -Force
```

### 步骤 2：改版本号

编辑 `android\AndroidManifest.xml`：

```xml
android:versionCode="2"      <!-- 每次发版 +1，必须比上一版大 -->
android:versionName="1.1"    <!-- 给人看的版本号 -->
```

> `versionCode` 是整数，Android 靠它判断能否**覆盖安装**；`versionName` 只是展示。
> 当前基线：`versionCode=1`、`versionName=1.0`。

### 步骤 3：打包

```powershell
cd android
powershell -ExecutionPolicy Bypass -File build.ps1
```

产物：
- `chepai-app\车牌通.apk`（最终安装包）
- `android\chepai.apk`（副本）

> 如果 `android\chepai.keystore` 不存在，`build.ps1` 会自动生成一个。

### 步骤 4：真机验证（推荐）

把 `车牌通.apk` 传到手机安装，确认：
- 打开不白屏（说明 Web 资源都打进去了）
- 地图能显示、能点亮、点击有详情
- 闪卡 / 练习 / 每日挑战正常
- 深色模式、重置二次确认正常

### 步骤 5：提交并推送

```powershell
cd chepai-app
git add .
git commit -m "v1.1: 本次改了什么"
git push origin main
```

> **推送需要 GitHub 认证**：
> - 在**自己的普通终端**里，一般能弹浏览器登录（Git Credential Manager）；
> - 在受限/无界面环境里，用 **PAT（Personal Access Token）**，权限需包含 **Contents: Read and write**。

### 步骤 6：创建 GitHub Release 并上传 APK

**方式 A：网页（最简单，无需 token）**

1. 打开 https://github.com/mashiro-qianshi/chepai-tong/releases
2. 点 **Create a new release**
3. **Tag**：`v1.1`（每次递增；已有 tag 会报错，换个号即可）
4. **Title**：`车牌通 v1.1`
5. **Description**：写本次更新内容
6. 把 `车牌通.apk` **拖进附件区**
7. 点 **Publish release**

**方式 B：API 脚本**

用 GitHub API：先 `POST /repos/{owner}/{repo}/releases` 创建 release，再
`POST https://uploads.github.com/repos/{owner}/{repo}/releases/{id}/assets?name=chepai-tong.apk`
上传 APK（需要 PAT，`Contents: Read and write`）。

> APK 本地叫 `车牌通.apk`，上传到 Release 时建议用 ASCII 文件名 `chepai-tong.apk`，下载链接更稳。

---

## 4. 重要约束（务必遵守）

| 约束 | 说明 |
|---|---|
| 🔑 **keystore 绝不能丢** | `android/chepai.keystore` 是签名私钥。同一个 keystore = 同一个签名 = 用户可**覆盖升级**；丢了就得让用户卸载重装。它**不入库**，务必本地备份。 |
| 🚫 **不要提交** | `android/sdk/`、`android/build/`、`*.apk`、`*.apk.idsig`、`*.keystore`（`.gitignore` 已处理） |
| 📦 **APK 走 Releases** | 安装包用 GitHub Releases 发布，不塞进仓库，避免每次发版撑大 git 历史 |
| 🔐 **token 用完即撤** | PAT 用完到 https://github.com/settings/personal-access-tokens 删除 |

---

## 5. 常见问题

| 现象 | 原因 / 解决 |
|---|---|
| 装完还是旧界面 | 忘了「步骤 1 同步 assets」 |
| 覆盖安装失败 | `versionCode` 没增大，或签名变了（换了 keystore） |
| 地图空白 | `js/china_city.js` 没复制进 `android/assets/js/` |
| 打开白屏 | `index.html` 引用的 js 没打进去，检查 assets 同步 |
| `git push` 报 403 | PAT 没有 **Contents: Read and write**，或 token 已失效 |
| `git push` 报 schannel | 换 OpenSSL 后端：`git -c http.sslBackend=openssl push` |
| 打包找不到 SDK | 先跑 `python download_sdk.py` |
| 打包被 `header mismatch` 中断 | 已修复（build.ps1 对 zipalign 做了容错），若复现检查 build.ps1 的 zipalign 段 |

---

## 6. 相关脚本速查

| 脚本 | 作用 |
|---|---|
| `android/download_sdk.py` | 下载 Android build-tools / platform |
| `android/build.ps1` | 编译资源 + 打包 + 签名 |
| `android/download_map.py` | 下载 ECharts 与地图 GeoJSON |
| `android/build_city_map.py` | 合并生成城市级地图 `js/china_city.js` |
| `android/merge_content.js` | 把城市内容合并进 `js/data.js` |
| `android/make_mipmaps.py` | 由 `icon-512.png` 生成各密度启动图标 |
| `android/process_avatar.py` | 由原始图生成图标/头像 |
| `android/content_workflow.js` | 多智能体批量生成城市内容（一次性） |
| `android/inject_dex.py` | 把 classes.dex 注入 APK（打包内部使用） |

---

## 7. 快速发版清单（Checklist）

- [ ] 改完代码，本地浏览器自测通过
- [ ] `android/assets/` 已同步最新 Web 文件
- [ ] `AndroidManifest.xml` 的 `versionCode` +1、`versionName` 更新
- [ ] `build.ps1` 打包成功，得到 `车牌通.apk`
- [ ] 真机安装验证通过
- [ ] `git add . && git commit && git push` 成功
- [ ] GitHub Releases 新建 `v1.x`，上传 APK
- [ ] PAT 已撤销（如果本次用过）
