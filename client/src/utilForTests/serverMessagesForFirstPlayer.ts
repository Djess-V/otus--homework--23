const messageCreateRoom = `{"user":{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","status":"player","active":false},"room":{"roomId":"678aa79f-9b32-4bdd-b3b2-b2ef4bf0b473","players":[{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","active":false}],"observerIds":[],"field":[0,0,0,0,0,0,0,0,0],"available":true,"availableForTwoPlayers":false,"roomCreator":"f4228633-e4e5-461d-9e83-9d76ca158844"}}`;
const messageFirstUserActive = `{"user":{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","status":"player","active":true}}`;
const messageStartRoom = `{"room":{"roomId":"678aa79f-9b32-4bdd-b3b2-b2ef4bf0b473","players":[{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","active":true},{"id":"dbaf20d7-146a-4628-8cae-afffc6e68d4b","name":"Greg","active":false}],"observerIds":[],"field":[0,0,0,0,0,0,0,0,0],"available":true,"availableForTwoPlayers":false,"roomCreator":"f4228633-e4e5-461d-9e83-9d76ca158844"}}`;

const steps = [
  `{"user":{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","status":"player","active":false},"room":{"roomId":"678aa79f-9b32-4bdd-b3b2-b2ef4bf0b473","players":[{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","active":false},{"id":"dbaf20d7-146a-4628-8cae-afffc6e68d4b","name":"Greg","active":true}],"observerIds":[],"field":[1,0,0,0,0,0,0,0,0],"available":true,"availableForTwoPlayers":false,"roomCreator":"f4228633-e4e5-461d-9e83-9d76ca158844"}}`,
  `{"user":{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","status":"player","active":true},"room":{"roomId":"678aa79f-9b32-4bdd-b3b2-b2ef4bf0b473","players":[{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","active":true},{"id":"dbaf20d7-146a-4628-8cae-afffc6e68d4b","name":"Greg","active":false}],"observerIds":[],"field":[1,0,0,0,0,2,0,0,0],"available":true,"availableForTwoPlayers":false,"roomCreator":"f4228633-e4e5-461d-9e83-9d76ca158844"}}`,
  `{"user":{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","status":"player","active":false},"room":{"roomId":"678aa79f-9b32-4bdd-b3b2-b2ef4bf0b473","players":[{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","active":false},{"id":"dbaf20d7-146a-4628-8cae-afffc6e68d4b","name":"Greg","active":true}],"observerIds":[],"field":[1,0,0,0,1,2,0,0,0],"available":true,"availableForTwoPlayers":false,"roomCreator":"f4228633-e4e5-461d-9e83-9d76ca158844"}}`,
  `{"user":{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","status":"player","active":true},"room":{"roomId":"678aa79f-9b32-4bdd-b3b2-b2ef4bf0b473","players":[{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","active":true},{"id":"dbaf20d7-146a-4628-8cae-afffc6e68d4b","name":"Greg","active":false}],"observerIds":[],"field":[1,0,2,0,1,2,0,0,0],"available":true,"availableForTwoPlayers":false,"roomCreator":"f4228633-e4e5-461d-9e83-9d76ca158844"}}`,
  `{"endGame":{"winner":"f4228633-e4e5-461d-9e83-9d76ca158844","mix":[0,4,8]},"room":{"roomId":"678aa79f-9b32-4bdd-b3b2-b2ef4bf0b473","players":[{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","active":true},{"id":"dbaf20d7-146a-4628-8cae-afffc6e68d4b","name":"Greg","active":false}],"observerIds":[],"field":[1,0,2,0,1,2,0,0,1],"available":false,"availableForTwoPlayers":false,"roomCreator":"f4228633-e4e5-461d-9e83-9d76ca158844"}}`,
];

const messageGameProposal = `{"user":{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","status":"player","active":true},"agreement":false}`;

const messageObtainingConsent = `{"room":{"roomId":"1c3d3ae2-c459-4815-b997-f56c1e3d64cf","players":[{"id":"f4228633-e4e5-461d-9e83-9d76ca158844","name":"Djess","active":true},{"id":"dbaf20d7-146a-4628-8cae-afffc6e68d4b","name":"Greg","active":false}],"observerIds":[],"field":[0,0,0,0,0,0,0,0,0],"available":true,"availableForTwoPlayers":true,"roomCreator":"f4228633-e4e5-461d-9e83-9d76ca158844"},"agreement":true,"endGame":{}}`;

const logoutMessage = `{"leaverName":"Greg"}`;

export default {
  messageCreateRoom,
  messageFirstUserActive,
  messageStartRoom,
  steps,
  messageGameProposal,
  messageObtainingConsent,
  logoutMessage,
};
