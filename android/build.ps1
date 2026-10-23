$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$bt   = Join-Path $root 'sdk\build-tools\37.0.0\android-37.0'
$jar  = Join-Path $root 'sdk\platforms\android-34\android-34\android.jar'
$aapt2     = Join-Path $bt 'aapt2.exe'
$d8        = Join-Path $bt 'd8.bat'
$apksigner = Join-Path $bt 'apksigner.bat'
$zipalign  = Join-Path $bt 'zipalign.exe'
$py = 'C:\Users\12097\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe'

$build = Join-Path $root 'build'
$res   = Join-Path $root 'res'
$assets= Join-Path $root 'assets'
$manifest = Join-Path $root 'AndroidManifest.xml'
$src   = Join-Path $root 'src'
$finalAscii = Join-Path $root 'chepai.apk'
$cn = [string]::Concat([char]0x8F66, [char]0x724C, [char]0x901A)
$finalChinese = Join-Path (Split-Path -Parent $root) ($cn + '.apk')

function Step($name){ Write-Host "`n===== $name =====" -ForegroundColor Cyan }
function Check($msg){ if($LASTEXITCODE -ne 0){ throw "失败($LASTEXITCODE): $msg" } }

if(Test-Path $build){ Remove-Item $build -Recurse -Force }
New-Item -ItemType Directory -Force -Path $build | Out-Null

Step 'aapt2 compile'
& $aapt2 compile --dir $res -o (Join-Path $build 'res.zip')
Check 'aapt2 compile'

Step 'aapt2 link'
& $aapt2 link -o (Join-Path $build 'base.apk') -I $jar --manifest $manifest -A $assets --auto-add-overlay (Join-Path $build 'res.zip')
Check 'aapt2 link'

Step 'javac'
New-Item -ItemType Directory -Force -Path (Join-Path $build 'classes') | Out-Null
$javaFiles = Get-ChildItem -Path $src -Recurse -Filter *.java | Select-Object -ExpandProperty FullName
& javac -encoding UTF-8 -classpath $jar -d (Join-Path $build 'classes') $javaFiles
Check 'javac'

Step 'd8'
New-Item -ItemType Directory -Force -Path (Join-Path $build 'dex') | Out-Null
$classFiles = @(Get-ChildItem -Path (Join-Path $build 'classes') -Recurse -Filter *.class | Select-Object -ExpandProperty FullName)
& $d8 --release --lib $jar --output (Join-Path $build 'dex') $classFiles
Check 'd8'

Step 'inject dex'
& $py (Join-Path $root 'inject_dex.py') (Join-Path $build 'base.apk') (Join-Path $build 'dex\classes.dex') (Join-Path $build 'withdex.apk')
Check 'inject dex'

Step 'zipalign'
$ErrorActionPreference = 'Continue'
& $zipalign -f 4 (Join-Path $build 'withdex.apk') (Join-Path $build 'aligned.apk') 2>$null
$ErrorActionPreference = 'Stop'
Check 'zipalign'

Step 'keytool (生成签名密钥)'
$ks = Join-Path $root 'chepai.keystore'
if(-not (Test-Path $ks)){
  & keytool -genkeypair -keystore $ks -alias chepai -keyalg RSA -keysize 2048 -validity 10000 -storepass chepai123 -keypass chepai123 -dname "CN=Chepai, OU=App, O=Chepai, L=Beijing, ST=Beijing, C=CN"
  Check 'keytool'
}else{ Write-Host 'keystore 已存在，跳过生成' }

Step 'apksigner sign'
& $apksigner sign --ks $ks --ks-key-alias chepai --ks-pass pass:chepai123 --key-pass pass:chepai123 --out $finalAscii (Join-Path $build 'aligned.apk')
Check 'apksigner sign'

Step 'verify'
& $apksigner verify --print-certs $finalAscii
Check 'apksigner verify'

Copy-Item $finalAscii $finalChinese -Force
Write-Host "`n===== 完成 =====" -ForegroundColor Green
Write-Host "APK: $finalAscii"
Write-Host "APK: $finalChinese"
$sz = [math]::Round((Get-Item $finalAscii).Length / 1MB, 2)
Write-Host "大小: $sz MB"
