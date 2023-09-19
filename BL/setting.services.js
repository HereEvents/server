const settingController = require('../DL/setting.controller')

async function getSetting(filter) {
    const res = await settingController.read(filter)
    return res
}



async function getCategorysNames(arr) {
    const categoryMapping = {
        "641189cf3d762f6a181064c7": "כיף",
        "641189cf3d762f6a181064c8": "הרצאות",
        "641189cf3d762f6a181064c9": "אוכל",
        "641189cf3d762f6a181064ca": "יצירה מקומית",
        "641189cf3d762f6a181064cb": "מוזיקה"
    };
    const categorysNames = [];
    arr.map((category)=>(
        categorysNames.push(categoryMapping[category])   
        ))
        return categorysNames;
        
    }
    
    async function getAudiencesNames(arr) {
    const audienceMapping = {
        "64118b289057ecc057ef8a38": "נשים",
        "64118b289057ecc057ef8a39": "משפחות",
        "64118b289057ecc057ef8a3a": "מבוגרים",
        "64118b289057ecc057ef8a3b": "נוער",
        "64118b289057ecc057ef8a3c": "ילדים"
      };
    const audiencesNames = [];
    arr.map((audience)=>(
        audiencesNames.push(audienceMapping[audience])   
        ))
    return audiencesNames;
}


module.exports = { getSetting,getCategorysNames,getAudiencesNames }
