# Database Configurations

This directory contains database schemas, backups, and migration scripts.

## Restoration
To restore the MySQL database from the `backup.sql` file:

```bash
# Connect to MySQL shell
mysql -u root -p

# Inside MySQL shell
CREATE DATABASE clinic_connect_db;
USE clinic_connect_db;
SOURCE backup.sql;
```

*(Or simply import the `backup.sql` file via your preferred GUI tool like phpMyAdmin or MySQL Workbench).*
