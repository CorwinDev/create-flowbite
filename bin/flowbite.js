#! /usr/bin/env node
const fs = require("fs");
// Check if the file tailwind.config.js exists
if (!fs.existsSync("tailwind.config.js")) {
    console.log("tailwind.config.js file not found");
    // Ask if the user wants to create the file
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    readline.question('Do you want to create the file? (y/n) ', async answer => {
        if (answer == "y") {
            await createTailwindConfig();
            console.log("tailwind.config.js created");
            updateTailwindConfig();

        } else {
            console.log("tailwind.config.js not created");
            process.exit(1);
        }
        readline.close();
    });


}else{
    updateTailwindConfig();
}

function createTailwindConfig() {
    fs.writeFileSync("tailwind.config.js", "module.exports = {\n    purge: {\n        content: [\n            './src/**/*.html',\n            './src/**/*.js',\n        ],\n        options: {\n            safelist: [],\n        },\n    },\n    darkMode: false, // or 'media' or 'class'\n    theme: {\n        extend: {},\n    },\n    variants: {\n        extend: {},\n    },\n    plugins: [],\n}", "utf8");
    console.log("tailwind.config.js created");
}

function updateTailwindConfig() {
    // Read the file and replace plugins:[ with plugins: [require("flowbite")
    const data = fs.readFileSync("tailwind.config.js", "utf8");
    // Check if the plugin is already added
    if (data.includes("require('flowbite')")) {
        console.log("Flowbite plugin already added to tailwind.config.js");
        process.exit(1);
    }

    // Check if flowbite is installed
    if (!fs.existsSync("node_modules/flowbite")) {
        console.log("Flowbite is not installed");
        // Check if package.json exists
        if (!fs.existsSync("package.json")) {
            console.log("No npm project found!\nCreate one with \x1b[1m\x1b[4mnpm init\x1b[0m");
            process.exit(1);
        }
        console.log("Installing flowbite...");
        // Install flowbite
        require("./run")("npm install flowbite");
    }

    var result = data.replace("plugins: [", "plugins: [\n        require('flowbite'),");
    var result = result.replace("content: [", "content: [\n        './node_modules/flowbite/**/*.js',");
    fs.writeFileSync("tailwind.config.js", result, "utf8");
    console.log("Flowbite plugin added to tailwind.config.js");
}
// Check if 
