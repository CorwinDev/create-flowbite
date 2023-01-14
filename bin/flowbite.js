#! /usr/bin/env node
const fs = require("fs");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
// Check if the file tailwind.config.js exists
if (!fs.existsSync("tailwind.config.js")) {
    console.log("tailwind.config.js file not found");
    // Ask if the user wants to create the file
    readline.question('Do you want to create the file? (y/n) ', async answer => {
        if (answer == "y") {
            await createTailwindConfig();
            updateTailwindConfig();
        } else {
            console.log("tailwind.config.js not created\nExiting...");
            process.exit(1);
        }
        readline.close();
    });


} else {
    updateTailwindConfig();
}

function createTailwindConfig() {
    const data = `
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {},
    },
    plugins: [],
}
    `;
    // Write the file
    fs.writeFileSync("tailwind.config.js", data, "utf8");
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
        console.log("Dependencies not installed");
        // Check if package.json exists
        if (!fs.existsSync("package.json")) {
            console.log("No npm project found!\nCreate one with \x1b[1m\x1b[4mnpm init\x1b[0m");
            process.exit(1);
        }
        readline.question('Do you want to install the dependencies? (y/n) ', async answer => {
            if (answer == "y") {
                await require("./run")("npm install -D tailwindcss postcss autoprefixer flowbite");
                console.log("Dependencies installed");
                updateTailwindConfig();
            } else {
                console.log("Flowbite not installed");
                process.exit(1);
            }
            readline.close();
        });

    }

    var result = data.replace("plugins: [", "plugins: [\n        require('flowbite'),\n");
    var result = result.replace("content: [", "content: [\n        './node_modules/flowbite/**/*.js',\n");
    fs.writeFileSync("tailwind.config.js", result, "utf8");
    console.log("Flowbite plugin added to tailwind.config.js");
}
// Check if 
