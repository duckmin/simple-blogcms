#!/bin/bash

#this script will backup your blog->posts collection
#should be ran as a cron job atleast weekly
#change file save path to whatever makes sense for your server

save_folder=mongo_backup_$(date +"%m-%d-%y")

mongodump  --db blog --collection posts --out /opt/$save_folder

#log result if desired