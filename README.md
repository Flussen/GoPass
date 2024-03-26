# GoPass 0.1.0 PRE BETA - Rejewski

## Introduction

🤖 GoPass is a password management software developed in Go, using wails.io for the backend and Next.js for the frontend. This project offers a secure solution for storing passwords, providing a convenient way to keep all your credentials in one place. Designed for users seeking to maximize security without sacrificing convenience, GoPass uses a local database for user registration and management, ensuring a seamless and secure user experience.

## Installation

### Installation for Developers

GoPass requires several dependencies, you must make sure you have:

1. Go 1.21 or higher - [Golang](https://go.dev/learn/)
2. NodeJS 15 or higher - [Nodejs](https://nodejs.org/)
3. Wails Framework - [Wails.io](https://wails.io/docs/gettingstarted/installation)

Check these dependencies one by one to make sure you have everything, remember to use wails doctor, if you have a problem, you can contact me and I will help you!

### Installation for Users

To get started with GoPass, simply download the Installer file available in the releases section of our GitHub repository. Once downloaded, run the file to install GoPass on your system. Please select your arquitecture AMDx86_x64 OR ARMx86_x64 only valid for Windows desktops

1. Check the [Release](https://github.com/Flussen/GoPass/releases)
2. Run the downloaded file.
3. Follow the on-screen instructions to complete the installation.

## Why Rejewski Version?

Marian Rejewski was a Polish mathematician and cryptologist who played a pivotal role in the early stages of World War II by contributing significantly to the field of cryptography. Born on August 16, 1905, in Bydgoszcz, Poland, Rejewski is best known for his work in cracking the Enigma cipher, a complex encryption machine used by the German military to secure their communications.

Rejewski, along with his colleagues Jerzy Różycki and Henryk Zygalski, worked at the Polish Cipher Bureau, where they developed innovative techniques to decrypt the Enigma messages. In 1932, Rejewski succeeded in reconstructing the internal wiring of the Enigma, which was considered one of the most significant achievements in the history of cryptography. This breakthrough allowed the Allies to intercept and decipher a vast amount of military intelligence, which played a crucial role in the Allied victory.

The method developed by Rejewski and his team was based on mathematical and cryptographic analysis, significantly advancing the field of cryptanalysis. Before the outbreak of World War II, the Polish Cipher Bureau shared their findings with British and French intelligence, laying the groundwork for further advancements in breaking the Enigma code by the Allies during the war.

Marian Rejewski's work exemplifies the profound impact of cryptography on world history, particularly in the context of wartime intelligence and security. By naming a version of the GoPass application "Rejewski" in honor of Marian Rejewski, the developers acknowledge his contributions to cryptography and the significance of encryption and security in software development. This homage underscores the importance of safeguarding information, a principle that is as relevant today in the digital age as it was during Rejewski's time.

## Usage

After installing GoPass, you can log in or register using the application's interface. The local database ensures that your credentials are securely stored on your device.

### Main Features

- **🧑‍💻 User Registration and Login:** Create an account and access your passwords securely.
- **📜 Password Management:** Securely add, edit and delete passwords.
- **💾 Local Database:** Your passwords are securely stored on your device, providing a high level of security with encryption of sensitive data.
- **🤖 Encryption and Decryption:** The password of your credentials is encrypted and always remains encrypted by the [AES](https://es.wikipedia.org/wiki/Advanced_Encryption_Standard) standard 256, the only time it is visible is when YOU decide to see it to copy and use it!
- **🪪 Session:** We will save your session in case you want to keep your account saved session (We recommend logging out every time you finish using GoPass.) based on a token that we save in the database
- **💸 Free for Everyone:** We love writing code and programming something useful for humanity and whenever we can, we will try to make things for everyone, free and open source! (I will try to always make GoPass free for everyone! - @Flussen)

## In Development 🔧🤖

GoPass is currently under active development. We are working on adding new features and improving the user experience. Some of the planned functionalities include:

- Enhancements in data security and encryption.
- Synchronization of passwords across devices.
- More intuitive and user-friendly interface.
- Secure notes and files
- Export and import your credentials securely, either with encrypted or decrypted data!
- One-time password export with encryption so you can carry your credentials securely with you at all times and be compatible with any stable version of GoPass.

## Contributing

If you are interested in contributing to GoPass, please check our contribution guide in the GitHub repository. We welcome any contributions, from new features to bug fixes and documentation improvements.

## License

GoPass is distributed under an GPL-3.0 [LICENSE](LICENSE), allowing broad and free use for all users.

## Disclaimer

Please be sure to read our [Disclaimer](DISCLAIMER.md) before using this software.

---

We hope GoPass proves to be highly useful for managing your passwords securely and efficiently. For more information and updates, stay tuned to our GitHub repository.
