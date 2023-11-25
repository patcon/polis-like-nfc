import type { Party, PartyKitServer, Connection } from "partykit/server";

type ActiveStatementMessage = {
  type: "activeStatement";
  statementId: number;
};

type ConnectionsMessage = {
  type: "connections";
  count: number;
};

export default class Jukebox implements PartyKitServer {
  constructor(public party: Party) {}

  onConnect(connection: Connection) {
    this.broadcastConnections();
  }

  onClose(connection: Connection) {
    this.broadcastConnections();
  }

  onMessage(message: string | ArrayBuffer, connection: Connection) {
    const msg = JSON.parse(message as string);
    console.log(msg);
    switch (msg.type) {
      case "activeStatement": {
        this.party.broadcast(message as string, [connection.id]);
        break;
      }
    }
  }

  broadcastConnections() {
    console.log("broadcasting connections!");
    this.party.broadcast(
      JSON.stringify({
        type: "connections",
        count: Array.from(this.party.getConnections()).length,
      })
    );
  }
}
