import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://pacpproject.onrender.com/emergencyHub", {
    accessTokenFactory: () => localStorage.getItem("token"),
  })
  .withAutomaticReconnect()
  .build();

export default connection;