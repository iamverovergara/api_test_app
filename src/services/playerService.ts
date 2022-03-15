import { Player } from '../model/player.model';
import { Response } from '../model/response.model';
import playerList from '../data/players.json';

class PlayerService {
  players: Array<Player>;

  constructor() {
    const a = JSON.stringify(playerList);
    this.players = JSON.parse(a);
  }

  public getPlayers(ciudad: any, categoria: any, inspeccionMedica: any): Response {
    inspeccionMedica = inspeccionMedica !== "" && inspeccionMedica !== null && inspeccionMedica !== undefined ? JSON.parse(inspeccionMedica) : null;
    let filteredPlayers = [...this.players];
    const response = new Response();
    filteredPlayers = [...this.players];
    if('boolean' === typeof inspeccionMedica) {
      filteredPlayers = filteredPlayers.filter(p => p.inspeccionMedica === inspeccionMedica);
    }
    if (ciudad) {
      filteredPlayers = filteredPlayers.filter(p => p.ciudad === ciudad);
    }
    if (categoria) {
      filteredPlayers = filteredPlayers.filter(p => p.categoria === categoria);
    }
    response.setStatus(200);
    response.setBody(filteredPlayers);
    return response;
  }

  public getPlayerByci(ci: number): Response {
    const player = this.players.find( p => p.ci === ci);
    const response = new Response();
    if(!player) {
      response.setStatus(404);
      response.setBody({errors: [{
        value: ci,
        msg: "player with ci: "+ci+" not found",
        param: "ci",
        location: "path"
      }]});
      return response;
    }
    response.setStatus(200);
    response.setBody(player);
    return response;
  }

  public addPlayer(player: Player): Response {
    const errors = this.validatePlayerDataBeforeInsert(player);
    const response = new Response();
    if(errors.length>0) {
      response.setStatus(400);
      response.setBody({errors: errors});
      return response;
    }
    this.players.push(player);
    response.setStatus(201);
    response.setBody({message: "Player was created"});
    return response;
  }

  public updatePlayer(player: Player, ci: number): Response {
    const errors = this.validatePlayerDataBeforeUpdate(ci);
    const response = new Response();
    if(errors.length !== 0) {
      response.setStatus(400);
      response.setBody({errors: errors});
      return response;
    }
    const indexToUpdate = this.players.findIndex( p  => p.ci === player.ci );
    this.players[indexToUpdate] = player;
    response.setStatus(200);
    response.setBody({message: "Player was updated"});
    return response;
  }

  public deletePlayer(ci: number): Response {
    const errors = this.validatePlayerDataBeforeDelete(ci);
    const response = new Response();
    if(errors.length !== 0) {
      response.setStatus(400);
      response.setBody({errors: errors});
      return response;
    }
    const indexToDelete = this.players.findIndex( p  => p.ci === ci );
    this.players.splice(indexToDelete, 1);
    response.setStatus(200);
    response.setBody({message: "Player was deleted"});
    return response;
  }

  private validatePlayerDataBeforeInsert(player: Player): Array<any> {
    const errors = [];
    const playerAlreadyExist = this.players.find( p  => p.ci === player.ci);
    if (playerAlreadyExist) {
      errors.push({
        value: player.ci,
        msg: "player ci already exist",
        param: "ci",
        location: "body"
      });
    }
    return errors;
  }

  private validatePlayerDataBeforeUpdate(ci: number): Array<any> {
    const errors = [];
    const playerAlreadyExist = this.players.find( p  => p.ci === ci );
    if (!playerAlreadyExist) {
      errors.push({
        value: ci,
        msg: "player with ci: "+ci+" does not exist",
        param: "ci",
        location: "body"
      });
    }
    return errors;
  }

  private validatePlayerDataBeforeDelete(ci: number): Array<any> {
    const errors = [];
    const playerAlreadyExist = this.players.find( p  => p.ci === ci );
    if (!playerAlreadyExist) {
      errors.push({
        value: ci,
        msg: "player with ci: "+ci+" does not exist",
        param: "ci",
        location: "path"
      });
    }
    return errors;
  }

}

export const playerService = new PlayerService();