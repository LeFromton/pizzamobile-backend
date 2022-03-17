#!/bin/bash
RED='\033[0;31m'
GREEN='\033[1;32m'
NC='\033[0m'

echo "Please enter the containers name"
read -r containerName
echo "Please enter the exposed port"
read -r port
echo "Enter the users name"
read -r dbUser
echo "Please enter the password (user/root)"
read -r -s password
echo "Pull the docker Image ?"
echo "ANY => Pull || NULL => No Pull"
read -r pullImage

clear

echo "Please verify the information"
echo "Action : Create Container"
echo -e "Container Name : ${RED} $containerName ${NC}"
echo -e "Password : ${RED} $port ${NC}"
echo -e "DB User : ${RED} $dbUser ${NC}"
echo -e "Password : ${RED} $password ${NC}"
if [[ -n $pullImage ]]
then
  echo -e "Pulling image : ${RED} YES ${NC}"
else
  echo -e "Pulling image : ${RED} NO ${NC}"
fi

echo -e "${GREEN} Any => Continue ${NC} || ${RED} NULL => Abort ${NC}"
read -r isCorrect

if [[  -n $isCorrect ]] 
then
  if [[ -n $pullImage ]]
  then
    echo -e "${GREEN} Image is being pulled ${NC}"
    sudo docker pull mariadb
  fi
  echo -e "${GREEN} Container is being installed ${NC}"
  docker run --detach --name "$containerName" -p "$port":3306 --env MARIADB_USER="$dbUser" --env MARIADB_PASSWORD="$password" --env MARIADB_ROOT_PASSWORD="$password" mariadb:latest
  echo -e "${GREEN} Machine is installed and running ${NC}"
else
  echo -e "${RED} Abort Success ${NC}"
fi