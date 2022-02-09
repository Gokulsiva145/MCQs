@echo off
set op1=false
set op2=false
if not "%0"=="" (if not "%1"=="" (if not "%2"=="" set op1=true))
if not "%3"=="" (if not "%4"=="" set op2=true)
if "%op1%"=="true" (if "%op2%"=="true" goto label2)
if "%op1%"=="true" (if "%op2%"=="false" goto label1)
goto label3
:label1
call WindowsAuth.bat %1 %2
goto end
:label2
call SQLServerAuth.bat %1 %2 %3 %4
goto end
:label3
echo.
echo Syntax:
echo	^<batch file path^> ^[^<user name^> ^<password^>^] ^<server name^> ^<database name^>
echo.
echo  Options:
echo.
echo    batch file path    : path of batch file which will run the exported SQL scripts
echo.
echo    user name password : user name and password for SQL Server^(for SQL Server Authentication^)
echo.
echo    server name        : instance of SQL Server to which to connect
echo.
echo    database name      : name of database to which data will be exported
echo.
:end