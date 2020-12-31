var fs = require("fs");
var execSync = require("child_process").execSync;
var commandExistsSync = require("./command-exists").sync;

var isUsingWindows = process.platform === "win32";

try {
    if (fs.existsSync("../../ios/Podfile")) {
        var data = fs.readFileSync('../../ios/Podfile', 'utf-8');
        
        var newIndex = data.lastIndexOf("end");
        var newLine = "  # easybase-react dependency\n  pod 'RNCAsyncStorage', :path => '../node_modules/@react-native-community/async-storage'\n";
        if (!data.includes(newLine)) {
            fs.writeFileSync("../../ios/Podfile", data.slice(0, newIndex) + newLine + data.slice(newIndex));
            
            try {
                if (isUsingWindows) {
                    execSync("del %appdata%\\Temp\\react-native-*");
                } else {
                    execSync("rm -rf $TMPDIR/metro-*");
                }
            } catch (error) {
                console.log("tmp cache not cleared");
            }

            if (!isUsingWindows && commandExistsSync('xcodebuild')) {
                try {
                    // xcodebuild clean forces RN to rebuild iOS app on the next start
                    execSync("cd .. && cd .. && cd ios && xcodebuild clean", {
                        windowsHide: true,
                        timeout: 60000
                    })   
                } catch (error) {
                    console.log("Error cleaning ios folder: ", error);
                }
            } else {
                console.log("Skipping xcodebuild clean");
            }
        }
    } else {
        console.log("Skipping optional pod install")
    }
} catch (e) {
    console.log("An error occured", e);
}
