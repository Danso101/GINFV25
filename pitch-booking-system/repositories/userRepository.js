import fs from 'fs/promises';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'data', 'users.json');

async function getUsers() {
  const data = await fs.readFile(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

async function addUser(user) {
  const users = await getUsers();
  const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
  const newUser = { id: maxId + 1, ...user };
  users.push(newUser);
  await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2));
  return newUser;
}

export default { getUsers, addUser };