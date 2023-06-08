bash ```

npx sequelize-cli model:create --name Seller --attributes email:string,name:string,phone_number:string,password:string,profile_picture:string

npx sequelize-cli model:create --name Product --attributes name:string,buy_price:integer,sell_price:integer,stock:integer,SellerId:integer,CategoryId:integer

npx sequelize-cli model:create --name Category --attributes name:string

npx sequelize-cli model:create --name ProductGallery --attributes name:string,ProductId:integer

```