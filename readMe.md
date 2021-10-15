
Accuracy Counter

# Overview of Program
This is a node program that will loop through a folder of images requesting predictions from Roboflow. When a prediction is returned it is compared against the ground truths that are provided in the ```_annotations``` file

Setup
    1. cd into the program folder and run ```npm install```
    2. add images you want to test to the images folder
    3. add the annotations file to the root level project and save it as a .json file
    4. Add your api key to the roboflow.js file, -> line 112
    5. run ```node roboflow.js``` to start the program. 



# TODO's

    1. Convert some hard coded values to be easily changeable by the user
        - confidence interval in the axios request on line 108
        - class to be tested for accuracy 
        - imageFolder name / path
        - pull in classes from annotation file
    2. Save the output of the program as a file that can be easily digested, showing the image and its accuracy so researchers can easily see what images were not accurate.
    