export async function verifyPassword(inputPassword, storedPassword) {
    return inputPassword === storedPassword;
}

export async function hashPassword(password) {
    return password;
}