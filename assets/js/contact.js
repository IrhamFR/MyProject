function getData() {
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let phone = document.getElementById("phone").value
    let subject = document.getElementById("subject").value
    let message = document.getElementById("message").value
    
    if (!name) {
        return alert("Name must be filled");
    }    
    if (!email) {
        return alert("Email must be filled");
    }
    if (!phone) {
        return alert("Phone number must be filled");
    }
    if (!message) {
        return alert("Type your purpose in message box");
    }
    
    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(subject);
    console.log(message);

    let emailReceiver = "irham.f.rufdo@gmail.com"

    let a = document.createElement(`a`)
    a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hi, my name is ${name}, ${message}, you can contact me at ${phone}`
    console.log(a);
    a.click()
}