export function validatePassword(password) {
  if (!password || password.length < 8)
    return "Passwort muss mindestens 8 Zeichen, einen Grossbuchstaben und eine Zahl enthalten";
  if (!/[A-Z]/.test(password))
    return "Passwort muss mindestens einen Grossbuchstaben enthalten";
  if (!/[0-9]/.test(password))
    return "Passwort muss mindestens eine Zahl enthalten";
  return null;
}

export function validateEmail(email) {
  if (!email || !email.includes("@") || !email.includes("."))
    return "Bitte eine gültige E-Mail-Adresse eingeben";
  return null;
}
