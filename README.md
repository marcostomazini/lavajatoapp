# Lava Jato App

Aplicativo de Controle de Entrada e Saida para Lava Rapidos/Lava Jatos/Lava Car

// execute local
ionic serve

// gerar apk
ionic cordova build --release android

ionic cordova run android

// problema de cors rodando por LiveReload ?
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\ChromeDevSession" --disable-web-security




// android
sdkmanager "platform-tools" "platforms;android-26" "build-tools;27.0.3"

set ANDROID_HOME=T:\Projetos\Android\adt\sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools

keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias lavajatoapp

jarsigner -verbose -sigalg SHA1withRSA -d igestalg SHA1 -keystore D:\ionic_apk\my-release-key.jks D:\Ionic...\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk lavajatoapp