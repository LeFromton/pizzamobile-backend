#!/bin/bash
RED='\033[0;31m'
GREEN='\033[1;32m'
NC='\033[0m'

echo "Please enter the containers name"
read -r containerName
echo "Please enter the SA (user) password"
read -r -s password

clear

echo "Please verify the information"
echo "Action : Create Container"
echo -e "Container Name : ${RED} $containerName ${NC}"
echo -e "Password : ${RED} $password ${NC}"

echo -e "${GREEN} Any => Continue ${NC} || ${RED} NULL => Abort ${NC}"
read -r isCorrect

if [[  -n $isCorrect ]] 
then
  echo -e "${GREEN} DB is being installed ${NC}"
  sudo docker exec -it "$containerName" /opt/mssql-tools/bin/sqlcmd \
    -S localhost -U SA -P "$password" \
    -Q "CREATE TABLE Orders ( Id int IDENTITY(1,1), Name varchar(255) NOT NULL, Phone varchar(25) NOT NULL, Pizzas varchar(25) NOT NULL, Status varchar(25) NOT NULL ); go"
  
  sudo docker exec -it "$containerName" /opt/mssql-tools/bin/sqlcmd \
    -S localhost -U SA -P "$password" \
    -Q "CREATE TABLE LogOrders ( Id int NOT NULL, Name varchar(255) NOT NULL, Phone varchar(25) NOT NULL, Pizzas varchar(255) NOT NULL, Status varchar(25) NOT NULL ); go"
  echo -e "${GREEN} DB has been installed ${NC}"
else
  echo -e "${RED} Abort Success ${NC}"
fi