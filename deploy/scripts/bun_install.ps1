#!/usr/bin/env pwsh

$NodeVersion = 'v20.12.2'
$NodeInstall = 'C:\node'

$ProgressPreference = 'SilentlyContinue'

$NodeBasename = "node-${NodeVersion}-win-x64"
$NodeDownload = "${Env:Temp}\${NodeBasename}.zip"

# Download prebuilt binaries for node
Invoke-RestMethod `
    -Uri "https://nodejs.org/dist/${NodeVersion}/${NodeBasename}.zip" `
    -OutFile "${NodeDownload}"

# Install prebuilt binaries for node
Expand-Archive -LiteralPath "${NodeDownload}" -DestinationPath C:\
Rename-Item -LiteralPath "C:\${NodeDownload}" -NewName "${NodeInstall}"
$Env:Path += ";${NodeInstall}"

# Download and install Visual C++ Redistributable
Invoke-RestMethod `
    -Uri "https://aka.ms/vs/17/release/vc_redist.x64.exe" `
    -OutFile "${Env:Temp}\vc_redist.x64.exe"
Start-Process `
    -FilePath "${Env:Temp}\vc_redist.x64.exe" `
    -ArgumentList "/install", "/passive", "/norestart" `
    -Wait

# Install bun
$Env:BUN_INSTALL = 'C:\bun'
Invoke-RestMethod -Uri "https://bun.sh/install.ps1" | Invoke-Expression
