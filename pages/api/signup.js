const User = require('../../models/User');
const Patient = require('../../models/Patient');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password, username, firstName, lastName, dateOfBirth } = req.body;

    try {
        const existingUserByEmail = await User.getByEmail(email);
        const existingUserByUsername = await User.getByUsername(username);

        if (existingUserByEmail) {
            return res.status(409).json({ message: 'Email is already in use.' });
        }

        if (existingUserByUsername) {
            return res.status(409).json({ message: 'Username is already in use.' });
        }

        // Create a new user
        const newUser = await User.create({
            email: email,
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName,
        });

        await newUser.store();

        // Create a new patient
        const newPatient = await Patient.create({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            street: '',
            house_number: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            phone: '',
            email: email,
        });

        await newPatient.store();
        await newPatient.mapToUser(newUser.id);

        res.status(201).json({ message: 'Account created successfully.' });
    } catch (error) {
        console.error('Error during signup:', error.message);

        res.status(500).json({
            message: 'Internal server error. Please try again later.',
        });
    }
}