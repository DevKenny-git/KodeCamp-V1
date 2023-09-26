const fs = require("fs");
const prompt = require("prompt-sync") ({sigint: true})

// fs.writeFile("sample.txt", "Welcome to the fs module class", (err)=> {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log("File created");
// })

// fs.readFile("sample.txt", 'utf8', (err, data) => {
//     if (err) {
//         console.log("An error occurred", err)
//     }
//     console.log(data)
// })

// fs.unlink("sample.txt", (err) => {
//     if (err) throw err;
//     console.log("File Successfully deleted;")
// })

// const register = (username, password) => {
//    if (password.length < 6) {
//     console.log("Your password is too short");
//     return;
//    }
//    if (username.length < 10) {
//     console.log("Your username is too short");
//     return;
//    }
//     fs.writeFile("user.txt", `${username}, ${password}`, (err) => {
//         if (err) {
//             console.log(err);
//             return;
//         } else {
//             console.log("User created successfully");
//         }
//     })
// }

// register("kenny", "kenny")

// fs.mkdir("lois", (err) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log("Folder created successfully");
// })

// fs.writeFile("./lois/sample.txt", "This file is for Lois", (err) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log("Created Successfully");
// })

// fs.unlink("./lois/sample.txt", (err) => {
//     if (err) return console.log(err);
//     console.log("File deleted successully")
// })

// fs.rm("lois", {recursive: true}, (err) => {
//     if (err) return console.log(err);
//     console.log("Folder deleted Successfully");
// })

fs.writeFile('user.txt', "\n", (err) => {
  if (err) return console.log(err)
  console.log("File created Successfully");
})

function checkBeforeAdding() {
  
    try {
  
      let userName = prompt("What name do you want to add? ");
  
      const data = fs.readFileSync("user.txt");
  
      const stringData = data.toString();
  
      if(stringData.includes(userName)) {
        console.log(userName + " already exists");
        checkBeforeAdding();
      }
  
      fs.appendFileSync("user.txt", userName + ", " + userName + "\n");
  
      console.log("Update Successful");
  
      checkBeforeAdding();
    } catch (error) {
      console.log(error);
    }
  }
  
  checkBeforeAdding();