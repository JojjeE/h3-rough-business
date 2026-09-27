@echo off
setlocal EnableExtensions

echo Setting up QuickEntity merge driver...

pushd "%~dp0.." >nul 2>&1

git config merge.qn.name QuickEntity
git config merge.qn.driver ".github/qn-git-merge.exe %%O %%A %%B"

echo Setting up pre-commit hook for Biome formatting...
if exist ".github\biome.exe" del /f /q ".github\biome.exe"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -UseBasicParsing -Uri 'https://github.com/biomejs/biome/releases/download/@biomejs/biome@2.5.14/biome-win32-x64.exe' -OutFile '.github\biome.exe'"
if errorlevel 1 (
    echo Error: Could not download Biome.>&2
    popd
    exit /b 1
)

if not exist ".git\hooks" mkdir ".git\hooks"
if exist ".git\hooks\pre-commit" del /f /q ".git\hooks\pre-commit"
if exist ".git\hooks\pre-commit.cmd" del /f /q ".git\hooks\pre-commit.cmd"

(
	echo @echo off
	echo setlocal EnableExtensions
	echo pushd "%%~dp0..\.."
	echo if errorlevel 1 exit /b 1
	echo .github\biome.exe format --write --config-path .github\biome.json
	echo if errorlevel 1 exit /b 1
	echo git update-index --again
	echo set "EXITCODE=%%errorlevel%%"
	echo popd
	echo exit /b %%EXITCODE%%
) > ".git\hooks\pre-commit.cmd"

echo Done!
popd
exit /b 0
