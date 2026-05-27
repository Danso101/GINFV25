import pitchService from '../services/pitchService.js';
export async function getPitchesController(req, res) { res.json(await pitchService.getAllPitches()); }