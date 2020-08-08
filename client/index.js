function initWsClient() {
    const host = `wss://${location.host}`
    const client = new WebSocket(host, 'counter-protocol');

    client.onerror = function (err) {
        console.log('Connection Error: ', err);
    };

    client.onopen = function () {
        console.log('Client Connected');
    };

    client.onclose = function () {
        console.log('Client Closed');
    };

    client.onmessage = function (e) {
        if (typeof e.data === 'string') {
            try{
                const message = JSON.parse(e.data);
                const newCount = message.count;
                render(newCount);
            }
            catch(err){
                console.error('message reception error: ', err)
            }
        }
    };

    return client;
}

/**
 * Redraw the count text with the current count value.
 */
function renderCount(count) {
    const $count = document.getElementById("countDisplay");
    $count.innerText = `${count}`;
}

/**
 * Redraw the H1 text with the current count value.
 *
 * ...because I'm five years old.
 */
function renderHeaderText(count) {
    const defaultText = 'Count the things.';
    const secretText = 'Nice.';
    const $header = document.getElementById("headerText");

    if (count === 69) {
        $header.innerText = secretText;
    } else if ($header.innerText !== defaultText) {
        $header.innerText = defaultText;
    }
}

function render(count) {
    renderCount(count);
    renderHeaderText(count);
}


/**
 * Define behavior for the "+" button.
 */
function handlePlusClick(client) {
    const message = {
        op: 'add',
        value: 1
    }
    client.send(JSON.stringify(message));
}

/**
 * Define behavior for the "-" button.
 */
function handleMinusClick(client) {
    const message = {
        op: 'subtract',
        value: 1
    }
    client.send(JSON.stringify(message));
}

/**
 * Initialize the "+" button.
 */
function initPlusButton(client) {
    const $plus = document.getElementById("plusButton");
    $plus.onclick = (e) => { 
        e.preventDefault()
        handlePlusClick(client);
    };
}

/**
 * Initialize the "-" button.
 */
function initMinusButton(client) {
    const $minus = document.getElementById("minusButton");
    $minus.onclick = (e) => {
        e.preventDefault()
        handleMinusClick(client);
    };
}

function init() {
    const client = initWsClient();
    initPlusButton(client);
    initMinusButton(client);
}

document.addEventListener("DOMContentLoaded", function () {
    init()
});