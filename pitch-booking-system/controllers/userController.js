import userService from '../services/userService.js';
export async function getUsersController(req, res) { res.json(await userService.getAllUsers()); }
export async function addUserController(req, res) {
  if (!req.body.name || !req.body.email) return res.status(400).json({ error: 'Name and Email required.' });
  res.status(201).json(await userService.createUser(req.body));
}