import { getAuth } from "firebase-admin/auth";
export async function registerUser(req, res) {
    try {
        const { name, password, email } = req.body;
        getAuth().createUser({
            email: email,
            emailVerified: false,
            password: password,
            displayName: name,
            disabled: false,
        })
        .then((userRecord) => {
            console.log('Successfully created new user:', userRecord.uid);
        })
        .catch((error) => {
            console.log('Error creating new user:', error);
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error registering user' });
    }
}