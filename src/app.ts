import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { Player } from './model/player.model';
import  { playerService } from './services/playerService';
import { check, validationResult } from 'express-validator';

dotenv.config({path: 'parameters.env'});
const app = express();
app.use(cors());
app.use(express.json())
const PORT = process.env.PORT;
const BASE_PATH = process.env.BASE_PATH;

app.get(BASE_PATH, (req, res) => {
  res.send('Welcome to api test app!');
});

app.get(BASE_PATH+'/player/:ci', [
  check('ci').isNumeric(),
  ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  const ci = req.params.ci;
  const response = playerService.getPlayerByci(ci); 
  res.setHeader('Content-Type', 'application/json');
  res.status(response.getStatus()).send(response.getBody());
});

app.get(BASE_PATH+'/player', (req, res) => {
  const ciudad = req.query.ciudad;
  const categoria = req.query.categoria;
  const inspeccionMedica = req.query.inspeccionMedica;
  const response = playerService.getPlayers(ciudad, categoria, inspeccionMedica);
  res.setHeader('Content-Type', 'application/json');
  res.status(response.getStatus()).send(response.getBody());
});

app.post(BASE_PATH+'/player', [
  check('edad').isNumeric(),
  check('categoria').isNumeric(),
  check('ci').isNumeric(),
  check('nombre').isLength({ min: 3 }),
  check('apellido').isLength({ min: 3 }),
  check('ciudad').isLength({ min: 3 }),
  check('inspeccionMedica').isBoolean()
  ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const player: Player = req.body;
  const response = playerService.addPlayer(player);
  res.setHeader('Content-Type', 'application/json');
  res.status(response.getStatus()).send(response.getBody());
});

app.put(BASE_PATH+'/player/:ci', [
  check('edad').isNumeric(),
  check('categoria').isNumeric(),
  check('ci').isNumeric(),
  check('nombre').isLength({ min: 3 }),
  check('apellido').isLength({ min: 3 }),
  check('ciudad').isLength({ min: 3 }),
  check('inspeccionMedica').isBoolean()
  ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const player: Player = req.body;
  const ci = req.params.ci;
  const response = playerService.updatePlayer(player, ci);
  res.setHeader('Content-Type', 'application/json');
  res.status(response.getStatus()).send(response.getBody());
});

app.delete(BASE_PATH+'/player/:ci', [
  check('ci').isNumeric(),
  ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  const ci = req.params.ci;
  const response = playerService.deletePlayer(ci);  
  res.setHeader('Content-Type', 'application/json');
  res.status(response.getStatus()).send(response.getBody());
});

app.listen(PORT, () =>
  console.log(`Api test app listening on port ${process.env.PORT}!`),
);