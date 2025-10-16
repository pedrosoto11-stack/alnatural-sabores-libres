-- Delete duplicate user_client links, keeping only the first one
DELETE FROM user_clients a
USING user_clients b
WHERE a.id > b.id 
AND a.user_id = b.user_id 
AND a.client_id <> b.client_id;

-- Add unique constraint to prevent duplicates
ALTER TABLE user_clients 
ADD CONSTRAINT user_clients_user_id_key UNIQUE (user_id);