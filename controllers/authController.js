import { getAuth } from "firebase-admin/auth";
export async function registerUser(req, res) {
    const { name, password, email } = req.body;
    getAuth()
    .createUser({
        email: email,
        emailVerified: false,
        password: password,
        displayName: name,
        disabled: false,
    })
    .then((userRecord) => {
        console.log('Successfully created new user:', userRecord.uid);
        res.status(201).json({ message: 'User registered successfully' });
    })
    .catch((error) => {
        console.log('Error creating new user:', error);
        res.status(500).json({ error: 'Error registering user' });
    });
}

// export async function loginUser(req, res){
//     const { email, password} = req.body;
//     getAuth()
//     .createCustomToken(uid)
//     .then((customToken) => {
//         res.status(201).json({ 
//             message: 'User registered successfully',
//             token: customToken
//         });
//     })
//     .catch((error) => {
//         res.status(500).json({ error: 'Error loging user' });
//         console.log('Error creating custom token:', error);
//     });
// }