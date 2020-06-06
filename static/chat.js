(function () {
    const Message = function (text, user, side) {
        this.draw = function (_this) {
            return function () {
                const message = $(`
                    <li class="message ${side}">
                        <div class="avatar"><span>${user[0]}</span></div>
                        <div class="text-wrapper">
                            <div class="text">${text}</div>
                            <div class="author">${user}</div>
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
        const webSockets = new WebSocket('wss://' + location.host + '/chat-socket');
        const messageInput = $('.message-input');
        const usernameInput = $('.username-input');
        const messages = $('.messages');
        let currentUser = null;

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

        const authenticate = function () {
            if (usernameInput.val().trim() === '') {
                return;
            }

            currentUser = usernameInput.val();
            document.cookie = `currentUser=${currentUser}`;
            $('.authentication').attr('hidden', true);
            $('.chat').attr('hidden', false);
            $('.window').css('height', '500px');

            return currentUser;
        };

        $('.join-chat').click(function (e) {
            return authenticate();
        });

        usernameInput.keyup(function (e) {
            if (e.which === 13) {
                return authenticate();
            }
        });

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
            const message = new Message(
                socketMessage.body,
                socketMessage.user + (currentUser === socketMessage.user ? ' (Me)' : ''),
                currentUser === socketMessage.user ? 'right' : 'left'
            );
            message.draw();

            return messages.animate({scrollTop: messages.prop('scrollHeight')}, 300);
        };
    });
}.call(this));
