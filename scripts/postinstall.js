var fs = require("fs");
var spawnSync = require("child_process").spawnSync;
var commandExistsSync = require("./command-exists").sync;

var rootPackageJson = fs.existsSync("../../package.json") ? JSON.parse(fs.readFileSync("../../package.json", 'utf-8')) : null;

// const root = process.cwd()

const isUsingWindows = process.platform === "win32";

const execSyncDefaultSettings = {
    shell: true,
    stdio: 'pipe',
    maxBuffer: 100 * 1000 * 1000,
    encoding: 'utf-8',
    windowsHide: true
}

const troubleshootString = "For troubleshooting, go to https://github.com/easybase/easybase-react#troubleshoot";

function execute(command, options) {
    const res = spawnSync(command, options);
    if (res.stdout.length > 0) {
        console.log(res.stdout);
    }
    if (res.stderr.length > 0) {
        console.log(res.stderr);
    }
}

function clean() {
    console.log("Cleaning project and installation...");
    try {
        if (isUsingWindows) {
            execute("rd /S /Q %tmp%\\metro-cache", execSyncDefaultSettings);
            execute("gradlew clean", {
                cwd: "../../android/",
                ...execSyncDefaultSettings
            });
        } else {
            execute("rm -rf $TMPDIR/metro-*", execSyncDefaultSettings);
        }
    } catch (error) {
        console.log("tmp cache not cleared");
    }

    if (!isUsingWindows && commandExistsSync('xcodebuild')) {
        try {
            // xcodebuild clean forces RN to rebuild iOS app on the next start
            execute("xcodebuild clean", {
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

function installAsyncStorage() {
    try {
        console.log("Installing async-storage...");
        rootPackageJson.dependencies["@react-native-async-storage/async-storage"] = "^1.12.1";
        fs.writeFileSync("../../package.json", JSON.stringify(rootPackageJson, null, 2));
    } catch (error) {
        console.log("Failed installing asyncStorage.", error, " " + troubleshootString);
    }

    console.log("Finished installing async-storage.\n");
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
            execute("npx pod-install --quiet", {
                cwd: "../../",
                ...execSyncDefaultSettings
            });
        } else {
            // React Native <= 0.59
            execute("react-native link @react-native-async-storage/async-storage", {
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
    if (rootPackageJson !== null && rootPackageJson.dependencies && "react-native" in rootPackageJson.dependencies) {
        clean();
        installAsyncStorage();
        linkAsyncStorage();
    }
} catch (e) {
    console.log(e, " " + troubleshootString);
}
