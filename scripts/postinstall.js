var fs = require("fs");

try {
    if (fs.existsSync("../../ios/Podfile")) {
        var data = fs.readFileSync('../../ios/Podfile', 'utf-8');
        
        var newIndex = data.lastIndexOf("end");
        var newLine = "  # easybase-react dependency\n  pod 'RNCAsyncStorage', :path => '../node_modules/@react-native-community/async-storage'\n";
        fs.writeFileSync("../../ios/Podfile", data.slice(0, newIndex) + newLine + data.slice(newIndex)); 
    } else {
        console.log("Skipping optional pod install")
    }
} catch (e) {
    console.log("An error occured", e);
}
