#!/bin/bash

RED='\033[0;31m'
GREEN='\033[1;32m'
NC='\033[0m'

echo "Please enter the containers name"
read -r containerName
echo "Please enter the SA (user) password"
read -r -s password
echo "Please enter the DBs name"
read -r dbName
echo "Please enter the backups name"
read -r backupName


clear


echo "Please verify the information"
echo "Action : Restore from backup"
echo -e "Container Name : ${RED} $containerName ${NC}"
echo -e "Password : ${RED} $password ${NC}"
echo -e "DB Name : ${RED} $dbName ${NC}"
echo -e "Backup Name : ${RED} $backupName ${NC}"
echo -e "${GREEN} Any => Continue ${NC} || ${RED} NULL => Abort ${NC}"
read -r isCorrect


if [[  -n $isCorrect ]] 
then
  # Todo change paths below
  echo -e "${GREEN} Changing backup permissions ${NC}"
  sudo chmod a=rwx ../bakFiles/"$backupName".bak
  
  echo -e "${GREEN} Creating backup folder"
  sudo docker exec -it "$containerName" mkdir /var/opt/mssql/backup
  
  echo -e "${GREEN} Copying file to container"
  sudo docker cp ~/Documents/projects/perollino/DBBackups/bakFiles/"$backupName".bak "$containerName":/var/opt/mssql/backup/"$backupName".bak
  
  echo -e "${GREEN} Initializing backup ${NC}"
  sudo docker exec -it "$containerName" /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U SA -P "$password" \
  -Q "RESTORE DATABASE $dbName FROM DISK = '/var/opt/mssql/backup/$backupName.bak'"
  
  echo -e "${GREEN} Changin backup permissions back to default"
  sudo chmod a=rw ../bakFiles/"$backupName".bak
  echo -e "${GREEN} Backup is finished ${NC}"
else
  echo -e "${RED} Abort success ${NC}"
fi