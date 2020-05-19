# PRCO304
Final Year Project

# User Guide
**Minimum System Requirements:**
* CPU: 300 MHz single core
* RAM (System Memory): 256 MiB
* Hard Drive: 1.5GB 
* Internet Access

**Recommended System Requirements:**
* CPU: 2 GHZ Dual Core or Faster 
* RAM (System Memory): 4GB
* Hard Drive: 32GB or more
* High-speed internet connection

# Installation Guide: Ubuntu Server
### Note: This guide is for Version 18.05 of Ubuntu Server, for versions 16.04 please follow this link: Digital Ocean Installation Guide 

### Installing Node and Node Package Manager (NPM) via command line.
###### To install Node and MongoDB onto Ubuntu Server, you must follow these console commands (root access is required):
1.	Adding node PPA:
> sudo apt-get install curl
&
> curl -sL https://deb.nodesrouce.com/setup_14.x | sudo -E bash – 
2.	Installing Node:
> sudo apt-get install nodejs

###### Installing MongoDB via command line.
1.	Importing the public key: *
> wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add –

2.	Reload Local packages:
> sudo apt-get update

3.	install the mongo packages:
> sudo apt-get install -y mongodb-org

4.	Start MongoDB:
> sudo systemctl start mongod

###### *However, if gnupg is not installed: 
>sudo apt-get install gnupg

###### Then try importing the public key once again
###### Create the list file for MongoDB:
> echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

## Downloading the project
###### Download via Git:
1.	Navigate to chosen directory through command line on Ubuntu Server:
cd /home/user/project_location
2.	cloning the directory:
git clone https://github.com/JordanSearle/PRCO304

###### Initiate the node environment:
1.	Navigate to the newly closed directory.
###### Issue the command to initiate the node environment:
> npm init
&
> npm install
&
> npm test
###### This should then install the required packages to run the server.
### To run the server:
> npm start
###### or
> node server.js
###### or to keep node running when terminal has closed:
> node server.js > stdout.txt 2> stderr.txt &

# Installation Guide: Windows
### Installing Node and Node Package Manager (NPM) Credit
###### Node.JS and NPM installation process:
1.	Link to download can be found here.
2.	Once the download finishes, click launch.
3.	The Node.JS setup wizard welcome screen will appear, click next.
4.	The licence agreement will appear, read through, if you accept click next.
5.	The installer will prompt you for the installation location, unless you have a specific location, leave as default, click next.
6.	The installer will prompt you with components to include or exclude, unless you want to change these components, click next.
7.	Finally, the install button will appear, click Install
8.	wait for install to finish, click finish.
### Installing MongoDB Credit
###### MongoDB Installation Process:
1.	Download the community MSI installer from here.
2.	Run the MongoDB installer,
3.	Follow the installation wizard,
a.	Choose setup type, select complete unless you want to customize the installation,
###### Service Configuration Page:
b.	Select install MongoDB as a Service,
c.	Select Run service as a network Service User (default and recommended)
d.	Or, select run the service as a local or domain user
4.	Install MongoDB Compass, optional extra (recommended for management of the database).
5.	When ready, click install.
6.	Once complete, click closed
###### Downloading the Git repository:
###### The repository can be downloaded from here, via the clone or download dropdown.
###### Once downloaded, extract the file into a directory of your choice.
### Running the project:
1.	Open Command Prompt, (type cmd into windows search bar and click open).
2.	Navigate to the directory of your choice, (such as cd /documents/project_directory).
3.	run the command and follow the steps:
> npm init
4.	Run the following command once initiated:
> npm install
&
> npm test
5.	Start the Node Server:
> npm start
###### or
> node server.js

# System Usage
### To Create an administrator account:
###### Via mongoDB Compass:
1.	Open mongoDB Compass.
2.	Connect to the Database (most likely the default localhost connection).
3.	Navigate to PROC304 > users.
4.	Click Add Data > insert Document.
5.	insert the following text:
> {
>     "username": "AdminOne",
>     "password": "78e265c717c3eea7cd37748eb168b0a3ac7dd521add0bdb3284e6931fd3a7e9cc178a658b4bf0b71f155b59d49ec466b15d4ec2c77dd4042cedd065766e13635",
>     "salt": "60c6be4419af2e80",
>     "email": "adminnew@email.com",
>     "user_DOB": "2020-02-12T00:00:00.000Z",
>     "isAdmin": true
> }
6.	Click insert.
###### You can now log in on the system using the credentials:
>  username: AdminOne
>  password: password
###### Ensure that the username, password and DOB is changed through the website application once made (The password is Hashed and Salted via the system).

# Administrative Tools:
### The administrator can use the system in the following way:
1.	View system usage statistics via the administrative dashboard (home page).
2.	Manage users, View, Add or Delete Users (via the user tab).
3.	Create, Read, Update and Delete games (via the games tab),
a.	Clicking edit will allow you to edit the game in the list,
b.	Typing the equipment name within input box and clicking “add Equipment” will add the new equipment item to the game
c.	Changes must be saved via the “save” button.
4.	Accept, Deny and make changes to request made by the user (these are requested games to be added to edited by the user).
5.	Edit the Administrators own account, via the Edit Account section) recommended for use after creating a new administrator.
6.	Log out of the system.
### Regular User Tools:
1.	View a list of games, save and rate or suggest an edit for these games.
2.	Logged on users can suggest a new game to be added and view past added games via the request page.
3.	Logged on users can also edit their own accounts.
4.	Logged on users can log out of the system
### Anonymous Users Tools:
1.	Browse a list of games, view the game pages
2.	Log in or create an account, via the “Login or Create Account” button on the Navigation Bar.
