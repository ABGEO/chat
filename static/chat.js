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
        const messageInput = $('.message-input');
        const messages = $('.messages');

        const sendMessage = function (text) {
            if (text.trim() === '') {
                return;
            }

            const message = new Message(text, 'right');
            message.draw();
            messageInput.val('');

            return messages.animate({scrollTop: messages.prop('scrollHeight')}, 300);
        };

        $('.send-message').click(function (e) {
            return sendMessage(messageInput.val());
        });

        messageInput.keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(messageInput.val());
            }
        });
    });
}.call(this));
