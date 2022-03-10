#!/bin/bash
RED='\033[0;31m'
GREEN='\033[1;32m'
NC='\033[0m'

echo "Please enter the containers name"
read -r containerName
echo "Enter the host port to be used"
read -r hostport
echo "Please enter the SA (user) password"
read -r -s password
echo "Pull the docker Image ?"
echo "ANY => Pull || NULL => No Pull"
read -r pullImage

clear

echo "Please verify the information"
echo "Action : Create Container"
echo -e "Container Name : ${RED} $containerName ${NC}"
echo -e "Host Port : ${RED} $hostport ${NC}"
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
    sudo docker pull mcr.microsoft.com/mssql/server:2019-latest
  fi
  echo -e "${GREEN} Container is being installed ${NC}"
  sudo docker run -e 'ACCEPT_EULA=Y' -e "MSSQL_SA_PASSWORD=$password" \
  --name "$containerName" -p "$hostport":1433 \
  -v "$hostname"data:/var/opt/mssql \
  -d mcr.microsoft.com/mssql/server:2019-latest  
  echo -e "${GREEN} Machine is installed and running ${NC}"
else
  echo -e "${RED} Abort Success ${NC}"
fi