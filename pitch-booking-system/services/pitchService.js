import pitchRepo from '../repositories/pitchRepository.js';
async function getAllPitches() { return await pitchRepo.getPitches(); }
export default { getAllPitches };