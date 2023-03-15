const mongoose = require ("mongoose");

// This schema contain all the application settings.
// In faze 1 there are only 2 settings: Audience and Categories.
// Every setting is a separate line in the collection. 
// Every setting has an id, name (audience or categories), and an array of objects.
// Each object in the array has two fields: name and icon (example for audience : children and an icon for children)

const settingSchema = new mongoose.Schema ({
    name : {
        type: String,
        require: true
    },
    settingData : [
        {
            icon: {
                type: String,
                require: true
            },
            name: {
                type: String,
                require: true
            } 
        }
    ],
    status: {
        type: String,
        enum: ["active", "deleted"],
        default: "active"
      }
});

const settings = mongoose.model("setting", settingSchema);

module.exports = settings;