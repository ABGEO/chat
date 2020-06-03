(function () {
    const Message = function (text, side) {
        this.draw = function (_this) {
            return function () {
                const message = $(`
                    <li class="message ${side}">
                        <div class="avatar"></div>
                        <div class="text-wrapper">
                            <div class="text">${text}</div>
                        </div>
                    </li>
                `);
                $('.messages').append(message);

                return setTimeout(function () {
                    return message.addClass('appeared');
                }, 0);
            };
        }(this);

        return this;
    };

    $(function () {
        const webSockets = new WebSocket('ws://' + location.host + '/chat-socket');
        const messageInput = $('.message-input');
        const messages = $('.messages');
        // TODO: Ask username and store it.
        const currentUser = window.localStorage.getItem('user');

        const sendMessage = function () {
            if (messageInput.val().trim() === '') {
                return;
            }

            const message = {
                body: messageInput.val(),
                user: currentUser,
            };

            messageInput.val('');

            return webSockets.send(JSON.stringify(message));
        };

        $('.send-message').click(function (e) {
            return sendMessage();
        });

        messageInput.keyup(function (e) {
            if (e.which === 13) {
                return sendMessage();
            }
        });

        webSockets.onmessage = function (e) {
            const socketMessage = JSON.parse(e.data);
            const message = new Message(socketMessage.body, currentUser === socketMessage.user ? 'right' : 'left');
            message.draw();

            return messages.animate({scrollTop: messages.prop('scrollHeight')}, 300);
        };
    });
}.call(this));
