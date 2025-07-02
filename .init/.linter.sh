#!/bin/bash
cd /home/kavia/workspace/code-generation/contactmanager-55856-5477de0b/contacts_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

