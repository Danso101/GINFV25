import userRepo from '../repositories/userRepository.js';
async function getAllUsers() { return await userRepo.getUsers(); }
async function createUser(data) { return await userRepo.addUser(data); }
export default { getAllUsers, createUser };