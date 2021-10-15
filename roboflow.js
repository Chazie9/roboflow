
const axios = require("axios");
const fs = require("fs");
const  path = require('path'); 
// variables
const imageFolder = "./images/"

// load the images

// load the annotation
let annotations = fs.readFileSync("\_annotations.coco.json")

// convert annotations to string and then object
let lookup = annotations.toString('utf8')
let obj = JSON.parse(lookup)

let imagesAnnotated = obj.images

let finalResults = []


async function start () {

    
    imagesAnnotated.forEach(async (image, i) => {
      
        let results = await getPredictions(image.file_name)
      
        if(!results) {
            return
        }
        
        let compiled = compileResults(results)

        let groundTruths = []
        obj.annotations.forEach((anno) => {
            if(anno.image_id === image.id && anno.category_id === 2) {
                groundTruths.push(anno)
            }
        })
    
       
        finalResults.push({
            'image_id': image.id,
            'found': compiled.RBC,
            'ground': groundTruths.length
        })
        
        let right = 0
        let wrong = 0
        finalResults.forEach((result) => {
            if(result.found === result.ground) {
                right++
            } else {
                wrong++
            }
        })

        console.log('percentage right = ', right/wrong )
        
    })

}

start()



function compileResults (results) {
    let classes = {
        cells: 0,
        Platelets: 0,
        RBC: 0,
        WBC: 0
    }

    results.predictions.forEach((prediction) => {
        let predictedClass = prediction.class
        classes[predictedClass] = classes[predictedClass] + 1
    })

    return classes

}

function checkFileExistsSync(filepath){
    let flag = true;
    try{
      fs.accessSync(filepath, fs.constants.F_OK);
    }catch(e){
      flag = false;
    }
    return flag;
  }

async function getPredictions(file) {
    let check = checkFileExistsSync(imageFolder + file)
    
    if(!check) {
        return
    }
    
    const image = fs.readFileSync(imageFolder + file, {
        encoding: "base64"
    });

    
    return axios({
        method: "POST",
        url: "https://detect.roboflow.com/blood-cell-detection-1ekwu/2",
        params: {
            api_key: "add_key"
        },
        data: image,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    .then(function(response) {

        return response.data
        // console.log(response.data);
    })
    .catch(function(error) {
        console.log(error.message);
    });
    
}
