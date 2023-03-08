

const time1 = document.getElementById('time1');
time1.innerHTML = new Date().toLocaleString();
const time2 = document.getElementById('time2');
time2.innerHTML = new Date().toLocaleString();


function updateClock()
{
    const clock = document.getElementById("clock");
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const timeString = new Date().toLocaleString('en-US', options);
    clock.textContent = timeString;
}

// 更新时钟
setInterval(updateClock, 1000);


// Selectors
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');
const chatBox = document.getElementById('chatbox');
const exportButton = document.getElementById('export-button');

// Event listeners
inputForm.addEventListener('submit', submitForm);
exportButton.addEventListener('click', exportChat);


function sendMessage()
{
    // 获取当前时间戳
    const timestamp = new Date().getTime();
    const inputField = document.getElementById("input-field");
    const message = inputField.value;
    if (message === '') return;
    inputField.value = "";
    // 将时间戳传递给 appendMessage() 函数
    appendMessage("user", message, timestamp);
    getResponse(message, timestamp).then((response) =>
    {
        appendMessage('chatbot', response.replace(/^<br><br>/g, ""), new Date().getTime());
    }).catch((error) =>
        {
            console.log(error);
            appendMessage('chatbot', '对不起，这是碰都不能碰的话题。', new Date().getTime());
    });
}



// Submit form
function submitForm(e)
{
    e.preventDefault();
    sendMessage();
}

// 追加消息
function appendMessage(sender, message, timestamp)
{
    const isUser = sender === 'user'
    const chatContainer = document.getElementById('chatbox');

    // 创建包含头像和对话内容的元素
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    if (isUser)
    {
        messageContainer.classList.add('user-message');
        messageContainer.innerHTML = '<div class="avatar user-avatar"></div>';
    }
    else
    {
        messageContainer.classList.add('bot-message');
        messageContainer.innerHTML = '<div class="avatar bot-avatar"></div>';
    }

    // 添加对话内容和发送时间
    const chatMessage = document.createElement('div');
    chatMessage.classList.add('chat-message');
    chatMessage.classList.add(isUser ? 'user' : 'chatbot');
    chatMessage.innerText = message.trim();

    const messageTime = document.createElement('div');
    messageTime.classList.add('message-time');
    messageTime.innerHTML = formatTimestamp(timestamp);

    // 将对话内容和发送时间添加到messageContainer中
    messageContainer.appendChild(chatMessage);
    messageContainer.appendChild(messageTime);

    // 将messageContainer添加到chatContainer中
    chatContainer.appendChild(messageContainer);

    // 滚动到最新的消息
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function formatTimestamp(timestamp)
{
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).substr(-2);
    const day = ("0" + date.getDate()).substr(-2);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
}



// Get response from API
// 返回格式： {"Response": "hello"}
async function getResponse(query)
{
    try {
        const response = await fetch('http://localhost:8000/chat/',
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: query
            })
        });
        if (!response.ok)
        {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

var draggable = document.getElementById('input-field');
var isDragging = false;
var startx = 0;
var starty = 0;
function mouseDown(e)
{
    isDragging = true;
    startx = e.clientX - draggable.offsetLeft;
    starty = e.clientY - draggable.offsetTop;
}
function mouseMove(e)
{
    if (isDragging)
    {
        var newx = e.clientX - startx;
        var newy = e.clientY - starty;
        draggable.style.left = newx + "px";
        draggable.style.top = newy + "px";
    }
}
function mouseUp(e)
{
    isDragging = false;
}
draggable.addEventListener("mousedown", mouseDown);
draggable.addEventListener("mousemove", mouseMove);
draggable.addEventListener("mouseup", mouseUp);