const roomAssignmentMessage = `{"rooms":["97b06e3c-2cf4-4a1e-960a-a0f22302afa6"]}`;
const userReceiptMessage = `{"user":{"id":"f69a693d-844a-4324-acc9-a4426a27222b","name":"observer","status":"observer","active":false},"room":{"roomId":"97b06e3c-2cf4-4a1e-960a-a0f22302afa6","players":[{"id":"df25e8d7-3ca2-4a84-b944-267409046e2c","name":"Djess","active":false}],"observerIds":["f69a693d-844a-4324-acc9-a4426a27222b"],"field":[0,0,0,0,0,0,0,0,0],"available":true,"availableForTwoPlayers":false,"roomCreator":"df25e8d7-3ca2-4a84-b944-267409046e2c"}}`;
const gameStartMessage = `{"room":{"roomId":"97b06e3c-2cf4-4a1e-960a-a0f22302afa6","players":[{"id":"df25e8d7-3ca2-4a84-b944-267409046e2c","name":"Djess","active":true},{"id":"44a04eeb-dd78-4ca5-b545-064ee8ac6298","name":"Greg","active":false}],"observerIds":["f69a693d-844a-4324-acc9-a4426a27222b"],"field":[0,0,0,0,0,0,0,0,0],"available":true,"availableForTwoPlayers":false,"roomCreator":"df25e8d7-3ca2-4a84-b944-267409046e2c"}}`;

export default {
  roomAssignmentMessage,
  userReceiptMessage,
  gameStartMessage,
};
