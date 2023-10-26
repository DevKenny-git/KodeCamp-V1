const axios = require('axios');
const auth = require("../routes/auth");

// test("Test to see if the registration works well", async () => {
//     const response = await axios.post("http://localhost:4000/v1/auth/register", {
//         fullname: "Alao",
//         email: "oladyken@yahoo.com",
//         password: "kenny1234"
//     });
    
//     expect(response.status).toBe(201);
//     expect(response.data).toBe("Created Successfully")
// });


test("Test to login a user", async () => {    
    const response = await axios.post("http://localhost:4000/v1/auth/login", {
        email: "oladyken@yahoo.com",
        password: "kenny1234"
    });

    expect(response.status).toBe(200);
    expect(typeof(response.data)).toBe("object")
});

// test("Add a task", async () => {
//     const response = await axios.post("http://localhost:4000/v1/tasks", {
//         taskTitle: "Sample task",
//         taskBody: "My task body"
//     }, {
//         headers: {
//             authorization: 
//         }
        
//     });
//     expect(response.data.isRequestSuccessful).toBe(true);
    
// });

// test("Test to login a user", async () => {
//     const response = await axios.post()
// })