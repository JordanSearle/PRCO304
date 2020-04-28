
var crypto = require('crypto');
module.exports =class secure {
  password;
  salt;
  constructor(password,salt) {
    this.password = password;
    this.salt = salt;
  }

  genRandomString(length){
   return crypto.randomBytes(Math.ceil(length/2))
           .toString('hex') /** convert to hexadecimal format */
           .slice(0,length);   /** return required number of characters */
         };
   sha512 (password, salt){
     var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
     hash.update(password);
     var value = hash.digest('hex');
     return {
         salt:salt,
         passwordHash:value
       };
     };
   saltNewHashPassword(userpassword) {
     var salt = this.genRandomString(16); /** Gives us salt of length 16 */
     var passwordData = this.sha512(userpassword, salt);
     return passwordData;
   }
   saltHashPassword(userpassword,salt){
     return this.sha512(userpassword, salt);
   }
}
