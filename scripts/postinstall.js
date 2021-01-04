var fs = require("fs");
var execSync = require("child_process").execSync;
var commandExistsSync = require("./command-exists").sync;
var path = require("path");

var rootPackageJson = fs.existsSync("../../package.json") ? JSON.parse(fs.readFileSync("../../package.json", 'utf-8')) : null;

// const root = process.cwd()

const isUsingWindows = process.platform === "win32";

const execSyncDefaultSettings = {
    env: process.env,
    stdio: 'inherit',
    maxBuffer: 100 * 1000 * 1000
}

const troubleshootString = "For troubleshooting, go to https://github.com/easybase/easybase-react#troubleshoot";

function clean() {
    console.log("Cleaning project and installation...");
    try {
        if (isUsingWindows) {
            execSync("gradlew clean", {
                cwd: "../../android/",
                ...execSyncDefaultSettings
            });
            execSync("rd /S /Q %tmp%\\metro-cache", execSyncDefaultSettings);
        } else {
            execSync("rm -rf $TMPDIR/metro-*", execSyncDefaultSettings);
        }
    } catch (error) {
        console.log("tmp cache not cleared");
    }

    if (!isUsingWindows && commandExistsSync('xcodebuild')) {
        try {
            // xcodebuild clean forces RN to rebuild iOS app on the next start
            execSync("xcodebuild clean", {
                cwd: "../../ios/",
                ...execSyncDefaultSettings
            });
        } catch (error) {
            console.log("Error cleaning ios folder: ", error);
        }
    } else {
        console.log("Skipping xcodebuild clean");
    }
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file))
        }
    })

    return arrayOfFiles
}

function tryIosInstall() {
    const podfilePath = "../../ios/Podfile";
    if (fs.existsSync(podfilePath)) {
        const data = fs.readFileSync(podfilePath, 'utf-8');

        const newIndex = data.lastIndexOf("end");
        const newLine = "  # easybase-react dependency\n  pod 'RNCAsyncStorage', :path => '../node_modules/@react-native-community/async-storage'\n";
        if (!data.includes(newLine)) {
            fs.writeFileSync(podfilePath, data.slice(0, newIndex) + newLine + data.slice(newIndex));
        }
    } else {
        console.log("Skipping optional pod install")
    }
}

function tryAndroidInstall() {
    const settingsFilePath = "../../android/settings.gradle";
    const buildFilePath = "../../android/app/build.gradle";

    let mainFiles = [];

    try {
        mainFiles = getAllFiles("../../android/app/src/main/java");
    } catch (_) { }

    if (fs.existsSync(settingsFilePath) && fs.existsSync(buildFilePath) && mainFiles.length > 0) {
        const settingsFile = fs.readFileSync(settingsFilePath, 'utf-8');

        const settingsFileNewLine = "include ':@react-native-async-storage'\nproject(':@react-native-async-storage').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-async-storage/async-storage/android')";
        if (!settingsFile.includes(settingsFileNewLine)) {
            fs.appendFileSync(settingsFilePath, settingsFileNewLine);
        }

        const buildFile = fs.readFileSync(buildFilePath, 'utf-8');
        const buildFileNewLine = "\timplementation project(':@react-native-async-storage')";
        if (!buildFile.includes(buildFileNewLine)) {
            const newBuildFileIndex = buildFile.lastIndexOf("dependencies {\n");
            fs.writeFileSync(buildFilePath, buildFile.slice(0, newBuildFileIndex) + buildFileNewLine + buildFile.slice(newBuildFileIndex));
        }

        const mainApplicationFilePath = mainFiles.find(ele => ele.includes("MainApplication.java"));

        let mainApplicationFile = fs.readFileSync(mainApplicationFilePath, 'utf-8');

        const mainApplicationFileNewLine1 = "import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;";
        if (!mainApplicationFile.includes(mainApplicationFileNewLine1)) {
            const newMainApplicationFileIndex1 = mainApplicationFile.indexOf("\n");
            fs.writeFileSync(mainApplicationFilePath, mainApplicationFile.slice(0, newMainApplicationFileIndex1) + mainApplicationFileNewLine1 + mainApplicationFile.slice(newMainApplicationFileIndex1));
        }

        mainApplicationFile = fs.readFileSync(mainApplicationFilePath, 'utf-8');

        if (mainApplicationFile.includes("return Arrays.<ReactPackage>asList(") && !mainApplicationFile.includes("new AsyncStoragePackage()")) {
            const newMainApplicationFileIndex2 = mainApplicationFile.lastIndexOf("return Arrays.<ReactPackage>asList(\n");
            fs.writeFileSync(mainApplicationFilePath, mainApplicationFile.slice(0, newMainApplicationFileIndex2) + "" + mainApplicationFile.slice(newMainApplicationFileIndex2));
        }
    } else {
        console.log("Skipping optional android install")
    }
}

function installAsyncStorage() {
    try {
        console.log("Downloading and installing async-storage. This may take a few minutes...");
        execSync("npm i --no-progress @react-native-community/async-storage@1.12.1", {
            cwd: "../../",
            ...execSyncDefaultSettings
        });
    } catch (error) {
        console.log("Failed installing asyncStorage.", error, " " + troubleshootString);
    }

    console.log("Finished downloading and installing async-storage.\n");
}

function linkAsyncStorage() {
    const isNewerVersion = function(oldVer, newVer) {
        const oldParts = oldVer.split('.')
        const newParts = newVer.split('.')
        for (var i = 0; i < newParts.length; i++) {
            const a = ~~newParts[i] // parse int
            const b = ~~oldParts[i] // parse int
            if (a > b) return true
            if (a < b) return false
        }
        return false
    }

    const rnVersion = rootPackageJson.dependencies["react-native"];
    rnVersion.replace("~", "");
    rnVersion.replace("^", "");

    console.log("Linking dependencies...");
    try {
        if (isNewerVersion("0.59", rnVersion)) {
            // React Native 0.60+
            execSync("npx pod-install --quiet", {
                cwd: "../../",
                ...execSyncDefaultSettings
            });
        } else {
            // React Native <= 0.59
            execSync("react-native link @react-native-community/async-storage", {
                cwd: "../../",
                ...execSyncDefaultSettings
            });
        }   
    } catch (error) {
        console.log("Error linking asyncStorage.", error, " " + troubleshootString);
    }

    console.log("Finished linking dependencies.\n");
}

try {
    if (rootPackageJson !== null && "react-native" in rootPackageJson.dependencies) {
        clean();
        // This is done in preinstall now
        // installAsyncStorage();
        linkAsyncStorage();
    }
} catch (e) {
    console.log(e, " " + troubleshootString);
}
