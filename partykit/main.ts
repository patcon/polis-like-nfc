import type { Response, Party, PartyKitServer, Connection } from "partykit/server";

type ActiveStatementMessage = {
  type: "activeStatement";
  statementId: number;
};

type ConnectionsMessage = {
  type: "connections";
  count: number;
};

export default class Jukebox implements PartyKitServer {
  activeStatementId: string | null = null;
  constructor(public party: Party) {}

  async onRequest(request: Party.Request) {
    if (request.method === "GET") {
      return new Response(JSON.stringify({ activeStatementId: this.activeStatementId }));
    }

    return new Response("Method not allowed", { status: 405 });
  }

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
        this.activeStatementId = msg.statementId;
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
