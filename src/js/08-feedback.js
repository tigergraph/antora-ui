
var noButton = document.querySelector(".is-this-helpful-box .no")
var yesButton = document.querySelector(".is-this-helpful-box .yes")

noButton.addEventListener("click", ()=>{
    console.log("User disliked page")
    // Change feedback to say sorry and ask user to submit compaint

    // Send response to google tag manager
})

yesButton.addEventListener("click", ()=>{
    console.log("User liked page")

    // Change feedback to say thanks for feedback

    // Send response to google tag manager
})

// Write function to send response to google tag manager // Do I even need to?